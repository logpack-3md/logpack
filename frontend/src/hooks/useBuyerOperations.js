import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export const useBuyerOperations = () => {
    const [loading, setLoading] = useState(false);
    // Inicializa com array vazio para evitar erros de .length undefined
    const [compras, setCompras] = useState([]); 
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
    const [error, setError] = useState(null);

    // --- LEITURA (GET) ---
    const fetchCompras = useCallback(async (page = 1, limit = 10, status = '') => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({ 
                page: page.toString(), 
                limit: limit.toString() 
            });
            
            if (status && status !== 'todos') {
                queryParams.append('status', status);
            }
            
            const response = await api.get(`/buyer/compras?${queryParams.toString()}`);
            
            // Tratamento robusto da resposta
            if (response.data && Array.isArray(response.data.data)) {
                setCompras(response.data.data);
                setMeta(response.data.meta || { totalItems: 0, totalPages: 0, currentPage: 1 });
            } else {
                setCompras([]);
                setMeta({ totalItems: 0, totalPages: 0, currentPage: 1 });
            }

        } catch (err) {
            console.error("Erro ao buscar compras:", err);
            // Se for 404, apenas limpamos a lista
            if (err.response && err.response.status === 404) {
                setCompras([]);
                setMeta({ totalItems: 0, totalPages: 0, currentPage: 1 });
            } else {
                setError("Não foi possível carregar as solicitações. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // --- ESCRITA (POST/PUT) ---
    const createOrcamento = async (compraId, payload) => {
        setLoading(true);
        try {
            await api.post(`/buyer/orcamento/${compraId}`, payload);
            await fetchCompras(meta.currentPage);
            return true;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const renegociarOrcamento = async (orcamentoId, payload) => {
        setLoading(true);
        try {
            await api.put(`/buyer/orcamento/renegociar/${orcamentoId}`, payload);
            await fetchCompras(meta.currentPage);
            return true;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDescricao = async (orcamentoId, payload) => {
        setLoading(true);
        try {
            await api.put(`/buyer/orcamento/descricao/${orcamentoId}`, payload);
            await fetchCompras(meta.currentPage);
            return true;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelarOrcamento = async (orcamentoId) => {
        setLoading(true);
        try {
            await api.put(`/buyer/orcamento/cancelar/${orcamentoId}`);
            await fetchCompras(meta.currentPage);
            return true;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        compras,
        loading,
        error,
        meta,
        fetchCompras,
        createOrcamento,
        renegociarOrcamento,
        updateDescricao,
        cancelarOrcamento
    };
};