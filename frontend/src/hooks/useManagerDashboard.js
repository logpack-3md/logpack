import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const TABS = {
    PEDIDOS: 'pedidos',
    ORCAMENTOS: 'orcamentos',
    INSUMOS: 'insumos',
    SETORES: 'setores'
};

export const useManagerDashboard = () => {
    // 1. Estado Geral (Stats)
    const [loadingStats, setLoadingStats] = useState(true);
    const [stats, setStats] = useState({
        totalInsumos: 0,
        totalSetores: 0,
        totalPedidos: 0,
        totalOrcamentos: 0
    });

    // 2. Estado da Tabela (Dados, Loading, Aba Atual)
    const [activeTab, setActiveTab] = useState(TABS.PEDIDOS);
    const [tableData, setTableData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    // 3. Estado de Paginação (Controlado pelo Hook)
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    // --- AÇÃO 1: CARREGAR STATS ---
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const [resInsumos, resSetores, resPedidos, resOrcamentos] = await Promise.all([
                api.get('insumos?limit=1'), 
                api.get('setor?limit=1'),   
                api.get('manager/pedido?limit=1'), 
                api.get('manager/orcamentos?limit=1')
            ]);

            const getCount = (res) => res?.meta?.totalItems || (Array.isArray(res?.data) ? res.data.length : 0);

            setStats({
                totalInsumos: getCount(resInsumos),
                totalSetores: getCount(resSetores),
                totalPedidos: getCount(resPedidos),
                totalOrcamentos: getCount(resOrcamentos)
            });
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    // --- AÇÃO 2: CARREGAR DADOS DA TABELA ATIVA ---
    const fetchTableData = useCallback(async () => {
        setTableLoading(true);
        try {
            let endpoint = '';
            
            switch (activeTab) {
                case TABS.PEDIDOS: 
                    endpoint = `manager/pedido?limit=${limit}&page=${page}`; 
                    break;
                case TABS.ORCAMENTOS: 
                    endpoint = `manager/orcamentos?limit=${limit}&page=${page}`; 
                    break;
                case TABS.INSUMOS: 
                    endpoint = `insumos?limit=${limit}&page=${page}`; 
                    break;
                case TABS.SETORES: 
                    endpoint = `setor?limit=${limit}&page=${page}`; 
                    break;
                default: return;
            }

            const res = await api.get(endpoint);
            
            // Tratamento da lista bruta
            const rawList = res?.data || res?.pedidos || res?.orcamentos || res?.setores || (Array.isArray(res) ? res : []);
            
            // NORMALIZAÇÃO DE DADOS (Crucial para datas aparecerem)
            const normalizedList = rawList.map(item => ({
                ...item,
                // Tenta pegar createdAt, senão data_criacao, senão updatedAt, senão nulo
                createdAt: item.createdAt || item.data_criacao || item.updatedAt || null, 
                // Garante normalização de nomes
                name: item.name || item.nome || null,
                sku: item.insumoSKU || item.SKU || item.sku || null
            }));

            // Ordena pedidos pela data (mais recente primeiro)
            if (activeTab === TABS.PEDIDOS || activeTab === TABS.ORCAMENTOS) {
                normalizedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            const metaData = res?.meta || { currentPage: page, totalPages: 1, totalItems: normalizedList.length };

            setTableData(normalizedList);
            setMeta(metaData);

        } catch (error) {
            console.error(`Erro ao carregar ${activeTab}:`, error);
            toast.error("Erro ao carregar tabela.");
            setTableData([]);
        } finally {
            setTableLoading(false);
        }
    }, [activeTab, page, limit]); 

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    // Handlers
    const changeTab = (newTab) => {
        if (newTab !== activeTab) {
            setActiveTab(newTab);
            setPage(1); 
        }
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= meta.totalPages) {
            setPage(newPage);
        }
    };

    const changeLimit = (val) => {
        const newLimit = parseInt(val, 10);
        setLimit(newLimit);
        setPage(1);
    };

    const refresh = () => {
        fetchStats();
        fetchTableData();
        toast.success("Dados atualizados.");
    };

    return {
        stats,
        loadingStats,
        activeTab,
        tableData,
        tableLoading,
        pagination: { 
            page, 
            limit, 
            meta,
            hasPrevious: meta.currentPage > 1,
            hasNext: meta.currentPage < meta.totalPages
        },
        changeTab,
        changePage,
        changeLimit,
        refresh
    };
};