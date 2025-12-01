import { useState, useCallback, useMemo, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useEmployeeInsumos = (onRequestSuccess) => {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestingId, setRequestingId] = useState(null);

    // Controles de UI
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 12;

    // 1. BUSCA DE DADOS (API REAL)
    const fetchInsumos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('insumos?limit=2000');
            
            let rawData = [];
            if (res) {
                if (Array.isArray(res)) rawData = res;
                else if (Array.isArray(res.data)) rawData = res.data;
                else if (Array.isArray(res.insumos)) rawData = res.insumos;
            }

            // Normalização dos dados
            const normalized = rawData.map(item => ({
                ...item,
                id: item.id || item._id,
                name: String(item.name || item.nome || '').trim(),
                sku: String(item.sku || item.SKU || '').trim().toUpperCase(),
                status: String(item.status || 'ativo').toLowerCase(), // Normaliza status
                current_storage: Number(item.current_storage || 0),
                max_storage: Number(item.max_storage || 1),
                isLowStock: (Number(item.current_storage || 0) / Number(item.max_storage || 1)) <= 0.35
            }));

            // --- FILTRO DE NEGÓCIO: EMPLOYEE SÓ VÊ ATIVOS ---
            const activeItems = normalized.filter(item => item.status === 'ativo');

            // Ordenação: Críticos primeiro
            activeItems.sort((a, b) => {
                if (a.isLowStock && !b.isLowStock) return -1;
                if (!a.isLowStock && b.isLowStock) return 1;
                return a.name.localeCompare(b.name);
            });

            setAllItems(activeItems);

        } catch (error) {
            console.error("Erro no fetchInsumos:", error);
            toast.error("Erro ao carregar catálogo.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInsumos();
    }, [fetchInsumos]);

    // 2. FILTRO DE BUSCA (Sobre a lista já filtrada de ativos)
    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return allItems;

        return allItems.filter(item => 
            item.name.toLowerCase().includes(term) || 
            item.sku.toLowerCase().includes(term)
        );
    }, [allItems, search]);

    // 3. PAGINAÇÃO
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    
    const paginatedItems = useMemo(() => {
        const safePage = page > totalPages ? 1 : page;
        if (page > totalPages && page !== 1) setPage(1);

        const start = (safePage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, page, totalPages]);

    // 4. AÇÃO: SOLICITAR
    const handleRequest = async (item) => {
        if (requestingId) return;
        setRequestingId(item.id);
        
        const toastId = toast.loading("Enviando solicitação...");

        try {
            const res = await api.post('employee/request', { 
                insumoSKU: item.sku 
            });

            if (res && res.success === false) {
                toast.dismiss(toastId);
                const msg = res.error || res.message || "";
                const status = res.status;

                if (status === 409 || msg.toLowerCase().includes("já existe")) {
                    toast.info(`Já existe um pedido aberto para ${item.sku}.`);
                } else if (status === 400 || msg.toLowerCase().includes("estoque")) {
                    toast.warning("Estoque seguro. Solicitação permitida apenas abaixo de 35%.");
                } else {
                    toast.error(msg || "Erro ao solicitar.");
                }
                return false;
            }

            toast.dismiss(toastId);
            toast.success("Solicitação Enviada!", {
                description: `O pedido para ${item.name} foi criado.`
            });
            
            if (onRequestSuccess) onRequestSuccess();
            
            return true;

        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.dismiss(toastId);
            toast.error("Falha na conexão.");
            return false;
        } finally {
            setRequestingId(null);
        }
    };

    return {
        insumos: paginatedItems,
        loading,
        pagination: { page, setPage, totalPages, totalItems: filteredItems.length },
        searchProps: { value: search, onChange: (e) => setSearch(e.target.value) },
        requestingId,
        handleRequest
    };
};