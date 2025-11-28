import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from "sonner"; // Se estiver usando sonner, senão remove

export const useBuyerOperations = () => {
    const [loading, setLoading] = useState(false);
    const [compras, setCompras] = useState([]); 
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
    const [error, setError] = useState(null);

    // --- LEITURA (GET) ---
    const fetchCompras = useCallback(async (page = 1, limit = 10, status = '') => {
        setLoading(true);
        setError(null);
        
        try {
            const queryParams = new URLSearchParams({ 
                page: page.toString(), 
                limit: limit.toString() 
            });
            
            if (status && status !== 'todos') {
                queryParams.append('status', status);
            }
            
            const resCompras = await api.get(`buyer/compras?${queryParams.toString()}`);
            
            // Tratamento de lista vazia
            if (resCompras && resCompras.success === false) {
                const msg = resCompras.error || '';
                if (msg.includes('Nenhum') || msg.includes('404') || resCompras.status === 404) {
                     setCompras([]);
                     setMeta({ totalItems: 0, totalPages: 0, currentPage: 1 });
                     return;
                }
                throw new Error(resCompras.error);
            }

            const listaCompras = Array.isArray(resCompras?.data) ? resCompras.data : [];
            const metaData = resCompras?.meta || { totalItems: 0, totalPages: 0, currentPage: 1 };

            // JOIN MANUAL
            const resOrcamentos = await api.get(`buyer/orcamentos?limit=100`); 
            const listaOrcamentos = Array.isArray(resOrcamentos?.data) ? resOrcamentos.data : [];

            const comprasComOrcamento = listaCompras.map(compra => {
                const orcamentoEncontrado = listaOrcamentos.find(orc => orc.compraId === compra.id);
                return {
                    ...compra,
                    orcamento: orcamentoEncontrado || compra.orcamento || null
                };
            });

            setCompras(comprasComOrcamento);
            setMeta(metaData);

        } catch (err) {
            console.error("Fetch error:", err);
            const errorMsg = err.message || '';
            if (errorMsg.includes('Nenhum') || errorMsg.includes('404')) {
                setCompras([]);
                setMeta({ totalItems: 0, totalPages: 0, currentPage: 1 });
            } else {
                setError("Não foi possível carregar as solicitações.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper genérico
    const handleOperation = async (operationFn) => {
        setLoading(true);
        try {
            const res = await operationFn();
            // Verifica se a API retornou erro lógico (mesmo com status 200/201 do fetch wrapper)
            if (res && res.success === false) {
                // Se o backend mandou issues (Zod), formatamos a mensagem
                if (res.issues) {
                    const zodErrors = res.issues.map(i => i.message).join(', ');
                    throw new Error(zodErrors);
                }
                throw new Error(res.error || "Erro na operação");
            }
            await fetchCompras(meta.currentPage); 
            return true;
        } catch (err) {
            console.error(err);
            throw err; // Repassa o erro para o componente exibir
        } finally {
            setLoading(false);
        }
    };

    const createOrcamento = (compraId, payload) => 
        handleOperation(() => api.post(`buyer/orcamento/${compraId}`, payload));

    const renegociarOrcamento = (orcamentoId, payload) => 
        handleOperation(() => api.put(`buyer/orcamento/renegociar/${orcamentoId}`, payload));

    // ROTA VERIFICADA: /buyer/orcamento/descricao/:id
    const updateDescricao = (orcamentoId, payload) => 
        handleOperation(() => api.put(`buyer/orcamento/descricao/${orcamentoId}`, payload));

    const cancelarOrcamento = (orcamentoId) => 
        handleOperation(() => api.put(`buyer/orcamento/cancelar/${orcamentoId}`));

    return {
        compras, loading, error, meta,
        fetchCompras, createOrcamento, renegociarOrcamento, updateDescricao, cancelarOrcamento
    };
};