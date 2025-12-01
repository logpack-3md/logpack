import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useEmployeeOperations = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- BUSCAR PEDIDOS ---
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
            
            // --- NORMALIZAÇÃO ROBUSTA ---
            const normalizedList = rawList.map(p => {
                // Busca Nome (várias possibilidades)
                const nomeInsumo = 
                    p.insumoNome ||          
                    p.insumo?.name ||        
                    p.insumo?.nome ||
                    p.name ||
                    '';

                // Busca SKU (várias possibilidades)
                const rawSku = 
                    p.insumoSKU || 
                    p.sku || 
                    p.insumo?.sku || 
                    p.insumo?.SKU || 
                    '---';
                
                // Limpeza do SKU (Trim + Upper)
                const cleanSku = String(rawSku).trim().toUpperCase();

                return {
                    id: p.id || p._id,
                    createdAt: p.createdAt || p.data_criacao || new Date().toISOString(),
                    status: p.status || p.estado || 'pendente',
                    displayInsumoName: nomeInsumo,
                    displaySku: cleanSku
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
                    toast.info("Já existe uma solicitação aberta para este SKU.");
                } else if (res.status === 400 || msg.includes('Estoque')) {
                    toast.warning("Estoque acima do limite de reposição (35%).");
                } else {
                    toast.error(msg || "Erro ao solicitar.");
                }
                return false;
            }

            toast.success('Solicitação enviada com sucesso!');
            await fetchPedidos(1); 
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
        meta,
        loading,
        isSubmitting,
        fetchPedidos,
        criarSolicitacao
    };
};