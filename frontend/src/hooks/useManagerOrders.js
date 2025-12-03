import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Ordenação
const STATUS_PRIORITY = {
    'aprovado': 1, 'solicitado': 2, 'pendente': 2, 'renegociacao': 3, 
    'compra_iniciada': 4, 'concluido': 5, 'compra_efetuada': 5, 'negado': 6, 'cancelado': 7
};

export const useManagerOrders = () => {
    const [loading, setLoading] = useState(true);
    const [pedidos, setPedidos] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // REMOVIDO PARAMETRO SEARCH
    const fetchPedidos = useCallback(async (pageIndex = 1, pageSize = 10, _searchIgnored, statusFilter = 'todos') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ page: pageIndex.toString(), limit: pageSize.toString() });

            if (statusFilter && statusFilter !== 'todos') queryParams.append('status', statusFilter);
            
            const res = await api.get(`manager/pedido?${queryParams.toString()}`);
            
            if (res && res.success === false) {
                const msg = (res.error || res.message || "").toLowerCase();
                if (res.status === 404 || msg.includes('nenhum') || msg.includes('encontrado')) {
                    setPedidos([]); setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                    return; 
                }
                throw new Error(res.error || res.message);
            }

            const rawList = res?.data || res?.pedidos || [];
            
            let normalized = rawList.map(p => ({
                id: p.id || p._id,
                sku: p.insumoSKU || p.sku || '---',
                requesterId: p.userId, // Isso garante o ID do user na tabela
                createdAt: p.createdAt || p.data_criacao || new Date().toISOString(),
                status: (p.status || 'pendente').toLowerCase(),
            }));

            normalized.sort((a, b) => {
                const pA = STATUS_PRIORITY[a.status] || 99;
                const pB = STATUS_PRIORITY[b.status] || 99;
                if (pA !== pB) return pA - pB; 
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setPedidos(normalized);
            setMeta(res?.meta || { totalItems: normalized.length, totalPages: Math.ceil(normalized.length / pageSize), currentPage: pageIndex });
            setPage(pageIndex);
            setLimit(pageSize);

        } catch (err) { console.warn("Fetch:", err); setPedidos([]); } finally { setLoading(false); }
    }, []);

    // --- DETALHES ---
    const getPedidoDetails = async (pedidoId) => {
        try {
            const res = await api.get(`manager/pedido/${pedidoId}`);
            const data = res?.pedido || res?.data || res;
            
            if (!data) return null; 

            // Busca Info Extra do Insumo
            let fullInsumo = null;
            if (data.insumoSKU || data.sku) {
                try {
                    const resIns = await api.get(`insumos/${data.insumoSKU || data.sku}`);
                    fullInsumo = Array.isArray(resIns) ? resIns[0] : resIns;
                } catch {}
            }
            return { ...data, fullInsumo };
        } catch { return null; }
    };

    const updateStatus = async (id, newStatus) => {
        setIsSubmitting(true);
        try {
            const res = await api.put(`manager/pedido/status/${id}`, { status: newStatus });
            if (res && res.success === false) throw new Error(res.error);
            toast.success(`Status atualizado!`);
            setPedidos(prev => prev.map(p => p.id===id ? {...p, status: newStatus} : p));
            return true;
        } catch { toast.error("Erro."); return false; } finally { setIsSubmitting(false); }
    };

    const createCompra = async (id, data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post(`manager/compra/${id}`, { description: data.description, amount: Number(data.amount) });
            if (res && res.success === false) throw new Error(res.error);
            toast.success("Compra iniciada!");
            setPedidos(prev => prev.map(p => p.id===id ? {...p, status: 'compra_iniciada'} : p));
            return true;
        } catch { toast.error("Erro ao criar compra."); return false; } finally { setIsSubmitting(false); }
    }

    return { pedidos, loading, isSubmitting, pagination: { page, limit, meta }, fetchPedidos, updateStatus, createCompra, getPedidoDetails };
};