import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useManagerOrders = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoAtual, setPedidoAtual] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LISTAR PEDIDOS ---
    const fetchPedidos = useCallback(async (page = 1, limit = 10, search = '') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: page.toString(), 
                limit: limit.toString() 
            });

            const res = await api.get(`manager/pedido?${queryParams.toString()}`);
            
            // Tratamento de erro/vazio
            if (res && res.success === false) {
                if (res.status !== 404) throw new Error(res.error);
                setPedidos([]);
                return;
            }

            const rawList = res?.data || res?.pedidos || [];
            // Normalização
            const normalized = rawList.map(p => ({
                id: p.id || p._id,
                sku: p.insumoSKU || p.sku || '---',
                requesterId: p.userId,
                createdAt: p.createdAt || p.data_criacao,
                status: p.status || 'pendente',
            }));

            // Filtro local se necessário
            const filtered = search 
                ? normalized.filter(p => p.sku.toLowerCase().includes(search.toLowerCase()))
                : normalized;

            setPedidos(filtered);
        } catch (err) {
            console.error(err);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- DETALHES ---
    const fetchPedidoById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await api.get(`manager/pedido/${id}`);
            setPedidoAtual(res?.pedido || res?.data || res);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar pedido.');
        } finally {
            setLoading(false);
        }
    }, []);

    // --- AÇÃO: NEGAR PEDIDO ---
    const denyPedido = async (id) => {
        setIsSubmitting(true);
        try {
            const res = await api.put(`manager/pedido/status/${id}`, { status: 'negado' });
            
            if (res && res.success === false) throw new Error(res.error || res.message);

            toast.success("Pedido negado com sucesso.");
            await fetchPedidoById(id); // Recarrega os dados
            return true;
        } catch (err) {
            console.error(err);
            toast.error("Erro ao negar pedido.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- AÇÃO: APROVAR E CRIAR COMPRA ---
    const createCompra = async (pedidoId, data) => {
        // Validação Local do Schema antes de enviar
        if (!data.description || data.description.length < 10) {
            toast.warning("A descrição deve ter no mínimo 10 caracteres.");
            return false;
        }
        if (!data.amount || data.amount < 200 || data.amount % 200 !== 0) {
            toast.warning("A quantidade deve ser múltiplo de 200 (ex: 200, 400...).");
            return false;
        }

        setIsSubmitting(true);
        try {
            // 1. Se necessário, aprova o status do pedido antes (depende da sua API, 
            // mas geralmente criar a compra já implica aprovação ou move o status)
            // Vamos assumir que criar a compra move o fluxo.
            
            const res = await api.post(`manager/compra/${pedidoId}`, {
                description: data.description,
                amount: Number(data.amount)
            });

            if (res && res.success === false) {
                throw new Error(res.error || res.message || "Erro ao criar compra.");
            }

            toast.success("Pedido aprovado e compra enviada ao Comprador!");
            await fetchPedidoById(pedidoId);
            return true;

        } catch (err) {
            console.error(err);
            // Tratamento de erro Zod do backend
            if (err.response?.data?.issues) {
                toast.error("Dados inválidos. Verifique os campos.");
            } else {
                toast.error(err.message || "Erro ao processar compra.");
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        pedidos,
        pedidoAtual,
        loading,
        isSubmitting,
        fetchPedidos,
        fetchPedidoById,
        denyPedido,
        createCompra
    };
};