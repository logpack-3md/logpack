import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useManagerOrders = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoAtual, setPedidoAtual] = useState(null); // Para a página de detalhes
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LISTAR PEDIDOS ---
    const fetchPedidos = useCallback(async (page = 1, limit = 10, status = '') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: page.toString(), 
                limit: limit.toString() 
            });
            if (status && status !== 'todos') queryParams.append('status', status);

            const res = await api.get(`manager/pedido?${queryParams.toString()}`);
            
            const lista = res?.data || res?.pedidos || [];
            // Se precisar de metadados de paginação, extraia aqui: const meta = res.meta...
            
            setPedidos(Array.isArray(lista) ? lista : []);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            // Evita toast de erro se for apenas lista vazia
            if (err.response?.status !== 404) {
                toast.error('Erro ao carregar lista de pedidos.');
            }
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- BUSCAR UM PEDIDO (Detalhes) ---
    const fetchPedidoById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await api.get(`manager/pedido/${id}`);
            const dados = res?.pedido || res?.data || res;
            setPedidoAtual(dados);
            return dados;
        } catch (err) {
            console.error('Erro ao buscar pedido:', err);
            toast.error('Pedido não encontrado.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // --- CRIAR PEDIDO (Manager também pode pedir insumos) ---
    const createPedido = async (sku) => {
        setIsSubmitting(true);
        try {
            const res = await api.post('employee/request', { insumoSKU: sku });

            if (res && res.success === false) {
                throw new Error(res.error || res.message);
            }

            toast.success(res.message || 'Solicitação criada com sucesso!');
            await fetchPedidos(); // Recarrega lista
            return true;
        } catch (err) {
            console.error('Erro ao criar:', err);
            toast.error(err.message || 'Erro ao criar solicitação.');
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
        createPedido
    };
};