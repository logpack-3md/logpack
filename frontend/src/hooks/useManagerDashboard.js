import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useManagerDashboard = () => {
    const [loading, setLoading] = useState(true);
    
    // Estatísticas (Contadores)
    const [stats, setStats] = useState({
        totalInsumos: 0,
        totalSetores: 0,
        totalPedidos: 0,
        totalOrcamentos: 0
    });

    // Listas Recentes (Top 5)
    const [recentPedidos, setRecentPedidos] = useState([]);
    const [recentOrcamentos, setRecentOrcamentos] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Dispara todas as requisições em paralelo para performance
            // Limit 1 nos cadastros apenas para pegar o 'meta.totalItems'
            const [resInsumos, resSetores, resPedidos, resOrcamentos] = await Promise.all([
                api.get('insumos?limit=1'), 
                api.get('setor?limit=1'),   
                api.get('manager/pedido?limit=5'), // Pega os 5 últimos
                api.get('manager/orcamentos?limit=5') // Pega os 5 últimos
            ]);

            // --- PROCESSAMENTO DE TOTAIS ---
            const getCount = (res) => res?.meta?.totalItems || res?.data?.length || (Array.isArray(res) ? res.length : 0);

            setStats({
                totalInsumos: getCount(resInsumos),
                totalSetores: getCount(resSetores),
                totalPedidos: getCount(resPedidos),
                totalOrcamentos: getCount(resOrcamentos)
            });

            // --- PROCESSAMENTO DE LISTAS RECENTES ---
            // Extrai array de pedidos
            const listaPedidos = resPedidos?.data || resPedidos?.pedidos || (Array.isArray(resPedidos) ? resPedidos : []);
            
            // Extrai array de orçamentos
            const listaOrcamentos = resOrcamentos?.data || resOrcamentos?.orcamentos || (Array.isArray(resOrcamentos) ? resOrcamentos : []);

            // Garante ordem cronológica (mais recente primeiro) se a API não ordenar
            const sortByDate = (a, b) => new Date(b.createdAt || b.data_criacao) - new Date(a.createdAt || a.data_criacao);

            setRecentPedidos(listaPedidos.sort(sortByDate).slice(0, 5));
            setRecentOrcamentos(listaOrcamentos.sort(sortByDate).slice(0, 5));

        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            // toast.error("Erro ao atualizar dados do painel."); // Opcional: descomente se quiser feedback de erro visual
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        stats,
        recentPedidos,
        recentOrcamentos,
        loading,
        refresh: fetchDashboardData
    };
};