import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useEmployeeOperations = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Novo estado: Lista completa de SKUs bloqueados (independente da paginação)
    const [allActiveSkus, setAllActiveSkus] = useState([]);

    // --- BUSCAR PEDIDOS (Paginado para a Tabela) ---
    const fetchPedidos = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: page.toString(), 
                limit: limit.toString() 
            });

            const res = await api.get(`manager/pedido?${queryParams.toString()}`);

            if (res && res.success === false) {
                 if (res.status === 404 || res.status === 403 || (res.message && res.message.includes('Nenhum'))) {
                    setPedidos([]);
                    setMeta({ totalItems: 0, totalPages: 0, currentPage: 1 });
                    return;
                 }
                 throw new Error(res.error);
            }

            const rawList = res?.data || res?.pedidos || res?.requests || (Array.isArray(res) ? res : []);
            
            // Normalização
            const normalizedList = rawList.map(p => {
                const nomeInsumo = p.insumoNome || p.insumo?.name || p.insumo?.nome || p.name || '';
                const skuInsumo = p.insumoSKU || p.sku || '---';

                return {
                    id: p.id || p._id,
                    createdAt: p.createdAt || p.data_criacao || new Date().toISOString(),
                    status: p.status || p.estado || 'pendente',
                    displayInsumoName: nomeInsumo,
                    displaySku: skuInsumo
                };
            });

            normalizedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const metaData = res?.meta || { totalItems: normalizedList.length, totalPages: 1, currentPage: page };

            setPedidos(normalizedList);
            setMeta(metaData);

        } catch (err) {
            console.error('Erro fetchPedidos:', err);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- BUSCAR SKUS ATIVOS (Sem paginação, para Bloqueio Visual) ---
    const fetchActiveSkus = useCallback(async () => {
        try {
            // Busca até 1000 pedidos para garantir que pegamos todos os pendentes
            const res = await api.get(`manager/pedido?limit=1000`);
            const rawList = res?.data || res?.pedidos || [];
            
            const activeList = rawList
                .filter(p => {
                    const status = (p.status || '').toLowerCase();
                    const isFinished = ['concluido', 'concluído', 'negado', 'rejeitado', 'cancelado', 'compra_efetuada'].includes(status);
                    return !isFinished;
                })
                .map(p => (p.insumoSKU || p.sku || '').trim().toUpperCase())
                .filter(Boolean);

            setAllActiveSkus(activeList);
        } catch (err) {
            console.error("Erro ao atualizar SKUs ativos:", err);
        }
    }, []);

    // --- CRIAR SOLICITAÇÃO ---
    const criarSolicitacao = async (sku) => {
        const cleanSku = String(sku || '').trim().toUpperCase();
        
        if (cleanSku.length < 2) {
            toast.warning("SKU inválido.");
            return false;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('employee/request', { 
                insumoSKU: cleanSku 
            });

            if (res && res.success === false) {
                const msg = res.error || res.message || "";
                
                if (res.status === 409 || msg.includes('já existe')) {
                    toast.info(`Já existe uma solicitação aberta para este SKU.`);
                    // Se deu conflito, atualizamos a lista de bloqueio para garantir que o botão trave
                    fetchActiveSkus();
                } else if (res.status === 400 || msg.includes('Estoque')) {
                    toast.warning("Estoque acima do limite de reposição (35%).");
                } else {
                    toast.error(msg || "Erro ao solicitar.");
                }
                return false;
            }

            toast.success('Solicitação enviada com sucesso!');
            
            // Atualiza ambas as listas
            await Promise.all([
                fetchPedidos(1),
                fetchActiveSkus()
            ]);
            
            return true;

        } catch (err) {
            console.error("Erro criarSolicitacao:", err);
            toast.error("Erro de conexão.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        pedidos,
        allActiveSkus, // Exportando a lista completa
        meta,
        loading,
        isSubmitting,
        fetchPedidos,
        fetchActiveSkus, // Exportando a função
        criarSolicitacao
    };
};