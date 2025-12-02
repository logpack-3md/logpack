import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useSetoresOperations = () => {
    const [setores, setSetores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });

    const fetchSetores = useCallback(async (pageIndex = 1, pageSize = 10, search = '', statusFilter = 'todos') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            
            // TRUQUE PARA PESQUISA DE SETOR:
            // Se tiver busca, buscamos TUDO (limite alto) para filtrar no front,
            // já que a API padrão de setores pode não ter 'LIKE' no backend.
            // Se não tiver busca, usamos paginação normal do backend.
            const isClientSearch = search && search.length > 0;
            const apiLimit = isClientSearch ? 1000 : pageSize;
            const apiPage = isClientSearch ? 1 : pageIndex;

            queryParams.append('page', apiPage.toString());
            queryParams.append('limit', apiLimit.toString());
            
            if (statusFilter !== 'todos') queryParams.append('status', statusFilter);

            const res = await api.get(`setor?${queryParams.toString()}`);

            if (res && res.success === false) {
                setSetores([]);
                setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                return;
            }

            let list = res?.data || res?.setores || [];
            
            // Filtro Client-Side para "Pesquisa Geral" de Setor
            if (isClientSearch) {
                const q = search.toLowerCase();
                list = list.filter(s => s.name.toLowerCase().includes(q));
            }

            // Ordenação
            list.sort((a, b) => {
                if(a.status === 'ativo' && b.status !== 'ativo') return -1;
                if(a.status !== 'ativo' && b.status === 'ativo') return 1;
                return a.name.localeCompare(b.name);
            });

            // Se fizemos busca no client, precisamos paginar manualmente aqui
            if (isClientSearch) {
                const totalItems = list.length;
                const startIndex = (pageIndex - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedList = list.slice(startIndex, endIndex);
                
                setSetores(paginatedList);
                setMeta({ 
                    totalItems, 
                    totalPages: Math.ceil(totalItems / pageSize) || 1, 
                    currentPage: pageIndex 
                });
            } else {
                // Backend cuidou da paginação
                setSetores(list);
                setMeta(res?.meta || { 
                    totalItems: list.length, 
                    totalPages: 1,
                    currentPage: 1 
                });
            }

            setPage(pageIndex);
            setLimit(pageSize);

        } catch (err) {
            console.warn("Erro fetchSetores", err);
            setSetores([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ... MANTEM-SE CREATE/UPDATE IGUAIS ...
    const createSetor = async (data) => {
        setIsSubmitting(true);
        try {
            if (!data.name || data.name.length > 6) {
                toast.warning("Nome máx 6 chars."); return false;
            }
            await api.post('manager/setor', { name: data.name.toUpperCase(), status: 'ativo' });
            toast.success("Criado!"); return true;
        } catch { toast.error("Erro."); return false; } finally { setIsSubmitting(false); }
    };
    
    const updateSetorName = async (id, newName) => {
        setIsSubmitting(true);
        try {
            await api.put(`manager/setor/name/${id}`, { name: newName.toUpperCase() });
            toast.success("Atualizado!"); 
            setSetores(prev => prev.map(s => s.id===id ? {...s, name: newName.toUpperCase()} : s));
            return true;
        } catch { toast.error("Erro."); return false; } finally { setIsSubmitting(false); }
    };

    const toggleSetorStatus = async (id, currentStatus) => {
        setIsSubmitting(true);
        try {
            const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
            await api.put(`manager/setor/status/${id}`, { status: newStatus });
            toast.success(`Setor ${newStatus === 'inativo' ? 'desativado (vínculos removidos)' : 'ativado'}.`);
            setSetores(prev => prev.map(s => s.id===id ? {...s, status: newStatus} : s));
            return true;
        } catch { toast.error("Erro."); return false; } finally { setIsSubmitting(false); }
    };

    return {
        setores, loading, isSubmitting,
        pagination: { page, limit, meta },
        fetchSetores, createSetor, updateSetorName, toggleSetorStatus
    };
};