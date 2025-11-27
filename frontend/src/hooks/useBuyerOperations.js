import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

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
            
            const response = await api.get(`/buyer/compras?${queryParams.toString()}`);
            
            // Garante que data.data seja array ou fallback para vazio
            const dataList = Array.isArray(response.data?.data) ? response.data.data : [];
            const metaData = response.data?.meta || { totalItems: 0, totalPages: 0, currentPage: 1 };

            setCompras(dataList);
            setMeta(metaData);

        } catch (err) {
            console.error("Erro ao buscar compras:", err);
            // Se for 404, não é erro crítico, apenas lista vazia
            if (err.response && err.response.status === 404) {
                setCompras([]);
                setMeta({ totalItems: 0, totalPages: 0, currentPage: 1 });
            } else {
                setError("Não foi possível carregar as solicitações.");
                // Opcional: Toast de erro aqui
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper genérico para requests de escrita
    const handleOperation = async (operationFn) => {
        setLoading(true);
        try {
            await operationFn();
            // Recarrega a página atual para atualizar dados
            await fetchCompras(meta.currentPage); 
            return true;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createOrcamento = (compraId, payload) => 
        handleOperation(() => api.post(`/buyer/orcamento/${compraId}`, payload));

    const renegociarOrcamento = (orcamentoId, payload) => 
        handleOperation(() => api.put(`/buyer/orcamento/renegociar/${orcamentoId}`, payload));

    const updateDescricao = (orcamentoId, payload) => 
        handleOperation(() => api.put(`/buyer/orcamento/descricao/${orcamentoId}`, payload));

    const cancelarOrcamento = (orcamentoId) => 
        handleOperation(() => api.put(`/buyer/orcamento/cancelar/${orcamentoId}`));

    return {
        compras,
        loading,
        error,
        meta,
        fetchCompras,
        createOrcamento,
        renegociarOrcamento,
        updateDescricao,
        cancelarOrcamento
    };
};