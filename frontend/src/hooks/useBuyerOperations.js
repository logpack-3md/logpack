import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useBuyerOperations = () => {
    const [compras, setCompras] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
    
    // Estados de controle
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LEITURA ---
    const fetchCompras = useCallback(async (page = 1, limit = 10, status = '') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (status && status !== 'todos') queryParams.append('status', status);
            
            // Busca Compras
            const resCompras = await api.get(`buyer/compras?${queryParams.toString()}`);
            
            if (resCompras && resCompras.success === false) {
                const msg = (resCompras.error || "").toLowerCase();
                if (msg.includes('nenhum') || resCompras.status === 404) {
                     setCompras([]); setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 }); return;
                }
                throw new Error(resCompras.error);
            }

            const listaCompras = Array.isArray(resCompras?.data) ? resCompras.data : [];
            const metaData = resCompras?.meta || { totalItems: 0, totalPages: 1, currentPage: 1 };

            // Join Manual com Orçamentos para pegar ID/Status corretos
            let listaOrcamentos = [];
            try {
                const resOrcamentos = await api.get(`buyer/orcamentos?limit=100`); 
                listaOrcamentos = Array.isArray(resOrcamentos?.data) ? resOrcamentos.data : [];
            } catch (err) { console.warn("Falha ao cruzar orçamentos", err); }

            const comprasComOrcamento = listaCompras.map(compra => {
                // Encontra o orçamento vinculado à compra
                const orcamentoEncontrado = listaOrcamentos.find(orc => orc.compraId === compra.id);
                return {
                    ...compra,
                    // Importante: 'orcamento' agora é o objeto cheio
                    orcamento: orcamentoEncontrado || compra.orcamento || null,
                    // O status exibido deve refletir o do orçamento se ele existir e estiver em renegociação,
                    // senão usa o da compra.
                    displayStatus: (orcamentoEncontrado?.status === 'renegociacao') ? 'renegociacao' : compra.status
                };
            });

            setCompras(comprasComOrcamento);
            setMeta(metaData);
        } catch (err) {
            console.error(err);
            setCompras([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper para tratar erros de API e Validação sem quebrar a UI
    const handleOperation = async (operationFn, successMessage) => {
        setIsSubmitting(true);
        try {
            const res = await operationFn();
            
            // Se houve erro na resposta da API (Ex: 400 Bad Request do Zod)
            if (res && res.success === false) {
                if (res.issues) {
                    // Formata erros do Zod (Ex: "Descrição muito curta")
                    const issuesMsg = res.issues.map(i => i.message).join('. ');
                    toast.warning("Atenção nos dados:", { description: issuesMsg });
                } else {
                    // Erros genéricos
                    toast.error("Não foi possível completar a ação", { description: res.error || res.message });
                }
                return false;
            }

            toast.success(successMessage || "Operação realizada com sucesso!");
            return true;
        } catch (err) {
            console.error("Operation error:", err);
            toast.error("Erro de comunicação.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const createOrcamento = (compraId, payload) => 
        handleOperation(
            () => api.post(`buyer/orcamento/${compraId}`, payload), 
            "Orçamento enviado com sucesso!"
        ).then(res => { if(res) fetchCompras(meta.currentPage); return res; });

    const renegociarOrcamento = (orcamentoId, payload) => 
        handleOperation(
            () => api.put(`buyer/orcamento/renegociar/${orcamentoId}`, payload),
            "Novo valor enviado!"
        ).then(res => { if(res) fetchCompras(meta.currentPage); return res; });

    const updateDescricao = (orcamentoId, payload) => 
        handleOperation(
            () => api.put(`buyer/orcamento/descricao/${orcamentoId}`, payload),
            "Descrição atualizada."
        ).then(res => { if(res) fetchCompras(meta.currentPage); return res; });

    const cancelarOrcamento = (orcamentoId) => 
        handleOperation(
            () => api.put(`buyer/orcamento/cancelar/${orcamentoId}`),
            "Pedido cancelado."
        ).then(res => { if(res) fetchCompras(meta.currentPage); return res; });

    return {
        compras, loading, meta, isSubmitting,
        fetchCompras, createOrcamento, renegociarOrcamento, updateDescricao, cancelarOrcamento
    };
};