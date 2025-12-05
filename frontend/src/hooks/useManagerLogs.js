"use client";
import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Mapeamento de abas para endpoints
const ENDPOINTS = {
    compras: 'log/compras/logs',
    orcamentos: 'log/orcamentos/logs',
    pedidos: 'log/pedidos/logs',
    setores: 'log/setores/logs',
    insumos: 'log/insumos/logs',
    // Fallback para todos (poderia ser um endpoint unificado se existisse no back)
    todos: 'log/insumos/logs' 
};

export const useManagerLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });

    const fetchLogs = useCallback(async (pageIndex = 1, pageSize = 10, actionFilter = 'todos', activeTab = 'todos') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: pageIndex.toString(), 
                limit: pageSize.toString() 
            });

            if (actionFilter && actionFilter !== 'todos') {
                queryParams.append('action', actionFilter);
            }
            
            // Seleciona a URL baseada na tab atual
            const endpoint = ENDPOINTS[activeTab] || ENDPOINTS['insumos'];
            
            const res = await api.get(`${endpoint}?${queryParams.toString()}`);
            
            if (res && res.success === false) {
                 setLogs([]);
                 setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                 return; 
            }

            const dataList = res.data || [];
            const metaData = res.meta || { totalItems: dataList.length, totalPages: 1, currentPage: 1 };

            setLogs(dataList);
            setMeta(metaData);
            setPage(pageIndex);
            setLimit(pageSize);

        } catch (err) { 
            console.warn("Erro ao buscar logs:", err); 
            setLogs([]); 
            toast.error("Não foi possível carregar o histórico.");
        } finally { 
            setLoading(false); 
        }
    }, []);

    return {
        logs,
        loading,
        pagination: { page, limit, meta },
        fetchLogs
    };
};