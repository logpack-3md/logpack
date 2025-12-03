import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

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
                const msg = (resCompras.error || "").toLowerCase();
                if (msg.includes('nenhum') || resCompras.status === 404) {
                     setCompras([]); 
                     setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                     return;
                }
                throw new Error(resCompras.error);
            }

            const listaCompras = Array.isArray(resCompras?.data) ? resCompras.data : [];
            
            // JOIN DE DADOS (IMPORTANTE: Recuperar ID/Data dos orçamentos)
            let listaOrcamentos = [];
            try {
                // Busca todos (ou limitados aos recentes) para cruzar dados
                const resOrcamentos = await api.get(`buyer/orcamentos?limit=200`); 
                listaOrcamentos = Array.isArray(resOrcamentos?.data) ? resOrcamentos.data : [];
            } catch (err) { console.warn("Join falhou"); }

            const comprasProcessadas = listaCompras.map(compra => {
                // Procura o orçamento específico
                const orcamentoEncontrado = listaOrcamentos.find(orc => orc.compraId === compra.id);
                // Prioriza dados do orcamento encontrado, senão usa o que veio na compra
                const orcamentoFinal = orcamentoEncontrado || compra.orcamento || null;
                
                return {
                    ...compra,
                    orcamento: orcamentoFinal,
                    // Data prioritária: Criação do orçamento (interação mais recente) > Criação do Pedido
                    createdAt: orcamentoFinal?.createdAt || compra.createdAt || compra.updatedAt || new Date().toISOString(),
                    status: (orcamentoFinal?.status === 'renegociacao') ? 'renegociacao_solicitada' : compra.status
                };
            });
            
            // Ordenação: Prioriza ações pendentes (Pendente e Renegociação)
            comprasProcessadas.sort((a, b) => {
                const getWeight = (s) => {
                   if(s === 'renegociacao_solicitada') return 1;
                   if(s === 'pendente') return 2;
                   return 10;
                }
                const wA = getWeight(a.status);
                const wB = getWeight(b.status);
                if(wA !== wB) return wA - wB;
                return new Date(b.createdAt) - new Date(a.createdAt);
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

    // ... Funções handleOperation, createOrcamento etc. iguais ao anterior ...
    // Certifique-se que create/renegociar etc atualizem o estado
    const handleOperation = async (fn, msg) => {
        setIsSubmitting(true);
        try {
            const res = await fn();
            if(res && res.success === false) throw new Error(res.error || res.message);
            toast.success(msg);
            return true;
        } catch(err) {
            toast.error("Erro na operação");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    const createOrcamento = (id, payload) => handleOperation(() => api.post(`buyer/orcamento/${id}`, payload), "Orçado!").then(r=>{if(r) fetchCompras(meta.currentPage); return r});
    const renegociarOrcamento = (id, payload) => handleOperation(() => api.put(`buyer/orcamento/renegociar/${id}`, payload), "Valor atualizado!").then(r=>{if(r) fetchCompras(meta.currentPage); return r});
    // Apenas para constar no return, updateDescricao removida do frontend para não confundir usuário
    const cancelarOrcamento = (id) => handleOperation(() => api.put(`buyer/orcamento/cancelar/${id}`), "Cancelado!").then(r=>{if(r) fetchCompras(meta.currentPage); return r});

    return { 
        compras, loading, meta, isSubmitting,
        fetchCompras, createOrcamento, renegociarOrcamento, cancelarOrcamento 
    };
};