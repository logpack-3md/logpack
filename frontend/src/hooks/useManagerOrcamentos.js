import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useManagerOrcamentos = () => {
    const [orcamentos, setOrcamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });

    const fetchOrcamentos = useCallback(async (pageIndex = 1, pageSize = 10, statusFilter = 'todos') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: pageIndex.toString(), 
                limit: pageSize.toString() 
            });

            if (statusFilter !== 'todos') {
                queryParams.append('status', statusFilter);
            }
            
            const res = await api.get(`manager/orcamentos?${queryParams.toString()}`);

            const hasError = res && res.success === false;
            if (hasError) {
                const msg = (res.error || res.message || "").toLowerCase();
                if (res.status === 404 || msg.includes('nenhum') || msg.includes('encontrado')) {
                    setOrcamentos([]);
                    setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                    return; 
                }
                throw new Error(res.error || res.message);
            }

            const rawList = res?.data || res?.orcamentos || (Array.isArray(res) ? res : []);
            
            const normalized = rawList.map(o => ({
                id: o.id,
                compraId: o.compraId,
                buyerId: o.buyerId,
                description: o.description,
                originalAmount: o.amount,
                valor_total: Number(o.valor_total || 0),
                status: (o.status || 'pendente').toLowerCase(),
                createdAt: o.createdAt || new Date().toISOString(),
            }));

            normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setOrcamentos(normalized);
            setMeta(res?.meta || { 
                totalItems: normalized.length, 
                totalPages: Math.ceil(normalized.length / pageSize), 
                currentPage: pageIndex 
            });

            setPage(pageIndex);
            setLimit(pageSize);

        } catch (err) {
            console.warn("Fetch Orcamentos warning:", err);
            setOrcamentos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- UPDATE DA FUNÇÃO CONTESTAR ---
    // Agora aceita 'description' (opcional)
    const contestarOrcamento = async (orcamentoId, decision, description = null) => {
        setIsSubmitting(true);
        try {
            const payload = { status: decision };
            // Só envia description se houver e se a decisão for renegociacao (ou outra se desejar)
            if (description && decision === 'renegociacao') {
                payload.description = description;
            }

            const res = await api.put(`manager/orcamentos/contestar/${orcamentoId}`, payload);

            if (res && res.success === false) {
                throw new Error(res.error || res.message || "Erro ao processar decisão.");
            }

            let message = "Status atualizado.";
            if (decision === 'aprovado') message = "Orçamento APROVADO e Compra Efetuada!";
            if (decision === 'negado') message = "Orçamento NEGADO e Compra Cancelada.";
            if (decision === 'renegociacao') message = "Solicitação enviada ao Comprador.";

            toast.success(message);
            
            setOrcamentos(prev => prev.map(o => o.id === orcamentoId ? { ...o, status: decision, description: description || o.description } : o));
            
            return true;
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Falha ao contestar orçamento.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const getOrcamentoDetails = async (id) => {
        try {
            const res = await api.get(`manager/orcamentos/${id}`);
            return res?.data || res; 
        } catch {
            return null;
        }
    }

    return {
        orcamentos, loading, isSubmitting,
        pagination: { page, limit, meta },
        fetchOrcamentos, contestarOrcamento, getOrcamentoDetails
    };
};