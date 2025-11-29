import { useState, useCallback, useMemo, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useEmployeeInsumos = () => {
    // --- ESTADOS ---
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestingId, setRequestingId] = useState(null); // ID do item sendo solicitado

    // Controles de UI
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 12;

    // --- 1. BUSCA DE DADOS (API) ---
    const fetchInsumos = useCallback(async () => {
        setLoading(true);
        try {
            // Busca catálogo completo
            const res = await api.get('insumos?limit=2000');
            
            let rawData = [];
            if (res) {
                if (Array.isArray(res)) rawData = res;
                else if (Array.isArray(res.data)) rawData = res.data;
                else if (Array.isArray(res.insumos)) rawData = res.insumos;
            }

            // Normalização dos dados para garantir que SKU e Status existam
            const normalized = rawData.map(item => ({
                ...item,
                id: item.id || item._id, // Garante ID
                name: String(item.name || item.nome || '').trim(),
                sku: String(item.sku || item.SKU || '').trim().toUpperCase(), // SKU sempre Maiúsculo
                // Conversão segura de números
                current_storage: Number(item.current_storage || 0),
                max_storage: Number(item.max_storage || 1),
                
                // Flag de Estoque Baixo (Lógica de Negócio < 35%)
                isLowStock: (Number(item.current_storage || 0) / Number(item.max_storage || 1)) <= 0.35
            }));

            // Ordenação: Itens com estoque baixo aparecem primeiro
            normalized.sort((a, b) => {
                if (a.isLowStock && !b.isLowStock) return -1;
                if (!a.isLowStock && b.isLowStock) return 1;
                return a.name.localeCompare(b.name);
            });

            setAllItems(normalized);

        } catch (error) {
            console.error("Erro no hook fetchInsumos:", error);
            toast.error("Não foi possível carregar o catálogo.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Carrega apenas na montagem do componente
    useEffect(() => {
        fetchInsumos();
    }, [fetchInsumos]);


    // --- 2. FILTRO E PAGINAÇÃO (Local) ---
    
    // Filtra por Nome ou SKU
    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return allItems;

        return allItems.filter(item => 
            item.name.toLowerCase().includes(term) || 
            item.sku.toLowerCase().includes(term)
        );
    }, [allItems, search]);

    // Pagina os resultados filtrados
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    
    const paginatedItems = useMemo(() => {
        const safePage = (page > totalPages) ? 1 : page;
        if (page > totalPages && page !== 1) setPage(1);

        const start = (safePage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, page, totalPages]);


    // --- 3. AÇÃO: SOLICITAR REPOSIÇÃO ---
    const handleRequest = async (item) => {
        if (requestingId) return; // Evita duplo clique
        setRequestingId(item.id);

        try {
            console.log(`[Solicitação] Enviando SKU: ${item.sku}`);

            // Envia para a rota correta do funcionário
            const res = await api.post('employee/request', { 
                insumoSKU: item.sku 
            });

            // Tratamento de Erros de Negócio (400, 409, etc vindo da API)
            if (res && res.success === false) {
                const msg = res.error || res.message || "";
                const status = res.status;

                if (status === 409 || msg.includes("já existe")) {
                    toast.info(`Já existe um pedido aberto para ${item.sku}.`);
                } else if (status === 400 || msg.includes("Estoque")) {
                    toast.warning("Estoque seguro. Solicitação permitida apenas abaixo de 35%.");
                } else {
                    toast.error(msg || "Erro ao solicitar.");
                }
                return false;
            }

            // Sucesso
            toast.success(`Solicitação enviada: ${item.name}`);
            return true;

        } catch (error) {
            console.error("Erro fatal handleRequest:", error);
            
            // Tratamento de erros de rede (axios throw)
            const status = error.response?.status;
            const msg = error.response?.data?.message || error.message;

            if (status === 409) toast.info("Já solicitado.");
            else if (status === 400) toast.warning("Estoque acima do limite.");
            else toast.error("Falha na conexão com o servidor.");
            
            return false;
        } finally {
            setRequestingId(null);
        }
    };

    return {
        insumos: paginatedItems,
        loading,
        pagination: {
            page,
            setPage,
            totalPages,
            totalItems: filteredItems.length
        },
        searchProps: {
            value: search,
            onChange: (e) => setSearch(e.target.value)
        },
        requestingId,
        handleRequest,
        fetchInsumos
    };
};