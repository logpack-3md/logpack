import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useEmployeeOperations = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- BUSCAR PEDIDOS ---
    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('employee/my-requests');
            // Tratamento robusto para garantir array
            const lista = Array.isArray(res) ? res : (res?.data || res?.requests || []);
            setPedidos(lista);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            // Não mostramos toast de erro se for apenas 404/Vazio para não assustar o usuário
            if (err.response?.status !== 404) {
                toast.error('Não foi possível atualizar a lista de pedidos.');
            }
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- CRIAR SOLICITAÇÃO ---
    const criarSolicitacao = async (sku) => {
        if (!sku || sku.trim().length < 3) {
            toast.warning("Por favor, digite um SKU válido.");
            return false;
        }

        setIsSubmitting(true);
        try {
            const skuFormatado = sku.trim().toUpperCase();
            
            const res = await api.post('employee/request', { 
                insumoSKU: skuFormatado 
            });

            if (res?.success === false || res?.error) {
                throw new Error(res?.message || res?.error || 'Erro desconhecido');
            }

            toast.success('Solicitação enviada com sucesso!');
            
            // Atualiza a lista imediatamente
            await fetchPedidos();

            // --- LÓGICA LEGADA DE NOTIFICAÇÃO (Janela/Sistema Antigo) ---
            // Mantida para compatibilidade, mas encapsulada aqui
            if (typeof window !== 'undefined') {
                const usuarioLogado = JSON.parse(localStorage.getItem('user') || '{}');
                const nomeUsuario = usuarioLogado.nome || usuarioLogado.name || 'Funcionário';

                if (window.adicionarNotificacaoPendente) {
                    window.adicionarNotificacaoPendente({
                        usuario: nomeUsuario,
                        sku: skuFormatado,
                        insumo: 'Solicitação de Reposição'
                    });
                }
                if (window.notificarNovoPedido) {
                    window.notificarNovoPedido({
                        usuario: nomeUsuario,
                        sku: skuFormatado
                    });
                }
            }

            return true;
        } catch (err) {
            console.error('Erro ao criar solicitação:', err);
            toast.error(err.response?.data?.message || err.message || 'Erro ao enviar solicitação.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        pedidos,
        loading,
        isSubmitting,
        fetchPedidos,
        criarSolicitacao
    };
};