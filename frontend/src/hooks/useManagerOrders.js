import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_PRIORITY = {
    'aprovado': 1,
    'solicitado': 2,
    'pendente': 2,
    'renegociacao': 3,
    'compra_iniciada': 4,
    'concluido': 5,
    'compra_efetuada': 5,
    'negado': 6,
    'cancelado': 7
};

export const useManagerOrders = () => {
    const [loading, setLoading] = useState(true);
    const [pedidos, setPedidos] = useState([]);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LISTAGEM ---
    const fetchPedidos = useCallback(async (pageIndex = 1, pageSize = 10, search = '', statusFilter = 'todos') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: pageIndex.toString(), 
                limit: pageSize.toString() 
            });

            if (statusFilter && statusFilter !== 'todos') {
                queryParams.append('status', statusFilter);
            }
            
            const res = await api.get(`manager/pedido?${queryParams.toString()}`);
            
            const hasError = res && res.success === false;
            if (hasError) {
                const msg = (res.error || res.message || "").toLowerCase();
                const isNotFound = res.status === 404 || msg.includes('nenhum') || msg.includes('encontrado');

                if (isNotFound) {
                    setPedidos([]);
                    setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                    return; 
                }
                throw new Error(res.error || res.message);
            }

            const rawList = res?.data || res?.pedidos || [];
            console.log(rawList)
            
            let normalized = rawList.map(p => ({
                id: p.id || p._id,
                sku: p.insumoSKU || p.sku || '---',
                requesterId: p.userId, // Aqui garantimos que o ID vem da lista
                createdAt: p.createdAt || p.data_criacao || new Date().toISOString(), // Garantimos a data
                status: (p.status || 'pendente').toLowerCase(),
            }));

            if (search) {
                const q = search.toLowerCase();
                normalized = normalized.filter(p => p.sku.toLowerCase().includes(q));
            }

            normalized.sort((a, b) => {
                const pA = STATUS_PRIORITY[a.status] || 99;
                const pB = STATUS_PRIORITY[b.status] || 99;
                if (pA !== pB) return pA - pB; 
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setPedidos(normalized);
            setMeta(res?.meta || { 
                totalItems: normalized.length, 
                totalPages: Math.ceil(normalized.length / pageSize), 
                currentPage: pageIndex 
            });
            setPage(pageIndex);
            setLimit(pageSize);

        } catch (err) {
            console.warn("Fetch warning:", err);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- DETALHES COMPLETOS (Apenas enriquece com Insumo) ---
    const getPedidoDetails = async (pedidoId) => {
        try {
            // 1. Busca Pedido (Pode vir sem data dependendo do controller)
            const resPedido = await api.get(`manager/pedido/${pedidoId}`);
            const pedidoData = resPedido?.pedido || resPedido?.data || resPedido;
            
            if (!pedidoData) return null; // Retorna null para o front usar os dados da lista

            // 2. Insumo Detalhado
            const targetSku = pedidoData.insumoSKU || pedidoData.sku;
            let fullInsumoData = null;
            if (targetSku) {
                try {
                    const resInsumo = await api.get(`insumos/${targetSku}`);
                    fullInsumoData = Array.isArray(resInsumo) ? resInsumo[0] : resInsumo;
                } catch (e) {
                    // Silently fail, ui handles null
                }
            }

            return {
                ...pedidoData,
                fullInsumo: fullInsumoData
            };

        } catch (err) {
            console.error(err);
            return null; // Retornamos null para forçar uso dos dados básicos da lista
        }
    };

    // --- ACTIONS ---
    const updateStatus = async (id, newStatus) => {
        setIsSubmitting(true);
        try {
            const res = await api.put(`manager/pedido/status/${id}`, { status: newStatus });
            if (res && res.success === false) throw new Error(res.error || res.message);

            const label = newStatus === 'aprovado' ? 'Aprovado' : 'Negado';
            toast.success(`Pedido ${label} com sucesso.`);
            setPedidos(current => current.map(p => p.id === id ? { ...p, status: newStatus } : p));
            return true;
        } catch (err) {
            console.error(err);
            toast.error("Falha ao atualizar.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const createCompra = async (pedidoId, data) => {
        if (!data.description || data.description.length < 10) {
            toast.warning("Descrição muito curta.");
            return false;
        }
        const val = Number(data.amount);
        if (isNaN(val) || val < 200 || val % 200 !== 0) {
            toast.warning("Quantidade inválida (min 200).");
            return false;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post(`manager/compra/${pedidoId}`, {
                description: data.description,
                amount: val
            });
            if (res && res.success === false) throw new Error(res.error || "Erro");

            toast.success("Ordem enviada para Compras!");
            setPedidos(current => current.map(p => p.id === pedidoId ? { ...p, status: 'compra_iniciada' } : p));
            return true;
        } catch (err) {
            console.error("Erro createCompra:", err);
            toast.error(err.message || "Erro ao processar.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        pedidos, loading, isSubmitting, pagination: { page, limit, meta },
        fetchPedidos, updateStatus, createCompra, getPedidoDetails
    };
};