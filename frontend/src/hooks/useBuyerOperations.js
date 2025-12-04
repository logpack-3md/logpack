import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_PRIORITY = {
    'pendente': 1, // Novo (Action)
    'renegociacao_solicitada': 2, // Reneg (Action)
    'fase_de_orcamento': 3, // Esperando Gerente (View)
    'concluido': 4,
    'compra_efetuada': 4,
    'negado': 5,
    'cancelado': 6
};

export const useBuyerOperations = () => {
    const [compras, setCompras] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCompras = useCallback(async (page = 1, limit = 10, status = '') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (status && status !== 'todos') queryParams.append('status', status);
            
            const resCompras = await api.get(`buyer/compras?${queryParams.toString()}`);
            
            if (resCompras && resCompras.success === false) {
                if (resCompras.status === 404) {
                     setCompras([]); 
                     setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                     return;
                }
                throw new Error(resCompras.error);
            }

            const listaCompras = Array.isArray(resCompras?.data) ? resCompras.data : [];
            
            // --- BUSCA DADOS AUXILIARES ---
            let listaOrcamentos = [];
            try { const res = await api.get(`buyer/orcamentos?limit=1000`); listaOrcamentos = res.data || []; } catch {}

            let listaPedidos = [];
            try { const res = await api.get(`manager/pedido?limit=1000`); listaPedidos = res.data || []; } catch {}

            // --- PROCESSAMENTO ---
            const comprasProcessadas = listaCompras.map(compra => {
                // Acha orçamento vinculado
                const orcamentoEncontrado = listaOrcamentos.find(orc => orc.compraId === compra.id);
                
                // Acha pedido (para SKU)
                const pedidoFound = listaPedidos.find(p => p.id === compra.pedidoId);
                const finalSku = compra.insumoSKU || pedidoFound?.insumoSKU || '---';

                // --- CORREÇÃO DE STATUS ---
                let displayStatus = compra.status; // Começa com status da compra

                if (orcamentoEncontrado) {
                    // Se o orçamento existe, o status dele é quem manda na visualização de detalhe
                    if (orcamentoEncontrado.status === 'pendente') {
                        // Orçamento Pendente = Aguardando Gerente = 'fase_de_orcamento' para o Buyer
                        displayStatus = 'fase_de_orcamento';
                    } else if (orcamentoEncontrado.status === 'renegociacao') {
                        displayStatus = 'renegociacao_solicitada';
                    } else {
                        displayStatus = orcamentoEncontrado.status;
                    }
                }

                return {
                    ...compra,
                    orcamento: orcamentoEncontrado, // Garante que o objeto vá junto
                    sku: finalSku,
                    displayDate: orcamentoEncontrado?.updatedAt || compra.createdAt,
                    status: displayStatus
                };
            });
            
            // --- ORDENAÇÃO ---
            comprasProcessadas.sort((a, b) => {
                const wA = STATUS_PRIORITY[a.status] || 99;
                const wB = STATUS_PRIORITY[b.status] || 99;
                if(wA !== wB) return wA - wB;
                return new Date(b.displayDate) - new Date(a.displayDate);
            });

            setCompras(comprasProcessadas);
            setMeta(resCompras?.meta || { totalItems: 0, totalPages: 1, currentPage: 1 });

        } catch (err) {
            console.error(err);
            setCompras([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOperation = async (fn, msg) => {
        setIsSubmitting(true);
        try {
            const res = await fn();
            if(res && res.success === false) {
                // Erro de duplicidade (409)
                if(res.status === 409 || res.status === 'conflict') {
                    throw new Error("Pedido já orçado! Atualize a página.");
                }
                const errTxt = res.issues ? res.issues.map(i=>i.message).join('. ') : (res.error || res.message);
                throw new Error(errTxt);
            }
            toast.success(msg);
            return res;
        } catch(err) {
            toast.error(err.message || "Erro na operação");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    const createOrcamento = async (id, payload) => {
        const res = await handleOperation(() => api.post(`buyer/orcamento/${id}`, payload), "Enviado!");
        if(res) {
            // Atualiza estado local imediatamente
            setCompras(prev => prev.map(item => item.id === id ? {
                ...item,
                status: 'fase_de_orcamento', // MUDA VISUAL IMEDIATO
                orcamento: res.orcamento // Anexa o novo orcamento
            } : item));
            return true;
        }
        return false;
    };
    
    const renegociarOrcamento = (id, payload) => handleOperation(() => api.put(`buyer/orcamento/renegociar/${id}`, payload), "Renegociação enviada!").then(r=>{if(r) fetchCompras(meta.currentPage); return r});
    const cancelarOrcamento = (id) => handleOperation(() => api.put(`buyer/orcamento/cancelar/${id}`), "Cancelado!").then(r=>{if(r) fetchCompras(meta.currentPage); return r});

    return { 
        compras, loading, meta, isSubmitting,
        fetchCompras, createOrcamento, renegociarOrcamento, cancelarOrcamento 
    };
};