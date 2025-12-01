import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useInsumosOperations = () => {
    const [loading, setLoading] = useState(true);
    const [insumos, setInsumos] = useState([]); // Lista filtrada exibida
    const [allInsumos, setAllInsumos] = useState([]); // Lista completa (cache)
    const [setores, setSetores] = useState([]);
    
    // Filtros
    const [search, setSearch] = useState('');
    const [setorFilter, setSetorFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');

    // --- CARREGAR DADOS ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Busca Insumos (Limite alto para front-end filter, ideal seria back-end filter)
            const [resInsumos, resSetores] = await Promise.all([
                api.get('insumos?limit=1000'),
                api.get('setor?limit=100') // Simplificado: busca os primeiros 100 setores
            ]);

            // Processa Insumos
            const rawInsumos = resInsumos.data || [];
            const formattedInsumos = rawInsumos.map(i => ({
                id: i.id || i._id,
                name: i.name || i.nome || 'Sem nome',
                sku: i.SKU || i.sku || 'N/A',
                setorName: i.setorName || i.setor?.name || 'Geral',
                status: i.status || 'ativo',
                image: i.image || i.imagem,
                measure: i.measure || 'UN',
                max_storage: i.max_storage || 0,
                updatedAt: i.updatedAt || i.createdAt || new Date(),
                // Determina cor baseada no setor (hash simples ou aleatório consistente)
                colorIndex: (i.setorName?.length || 0) % 6 
            })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            setAllInsumos(formattedInsumos);
            setInsumos(formattedInsumos);

            // Processa Setores
            const rawSetores = resSetores.data || resSetores.setores || [];
            const formattedSetores = Array.isArray(rawSetores) 
                ? rawSetores.map(s => ({ id: s.id || s._id, name: s.name || s.nome }))
                : [];
            
            setSetores(formattedSetores.sort((a, b) => a.name.localeCompare(b.name)));

        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados.");
        } finally {
            setLoading(false);
        }
    }, []);

    // --- FILTRAGEM (Client-Side) ---
    useEffect(() => {
        let result = [...allInsumos];

        // 1. Busca Texto (Nome ou SKU)
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(i => 
                i.name.toLowerCase().includes(q) || 
                i.sku.toLowerCase().includes(q)
            );
        }

        // 2. Filtro de Setor
        if (setorFilter !== 'todos') {
            result = result.filter(i => i.setorName === setorFilter);
        }

        // 3. Filtro de Status
        if (statusFilter !== 'todos') {
            result = result.filter(i => i.status === statusFilter);
        }

        setInsumos(result);
    }, [search, setorFilter, statusFilter, allInsumos]);

    // --- CRIAR INSUMO ---
    const createInsumo = async (formData) => {
        try {
            // Se tiver arquivo, usa FormData, senão JSON
            let payload;
            let isMultipart = false;

            if (formData.file) {
                isMultipart = true;
                payload = new FormData();
                payload.append('file', formData.file);
                payload.append('name', formData.name);
                payload.append('SKU', formData.sku);
                payload.append('setorName', formData.setor);
                payload.append('description', formData.description || '');
                payload.append('measure', formData.measure);
                payload.append('max_storage', formData.max_storage);
                payload.append('status', formData.status);
            } else {
                payload = {
                    name: formData.name,
                    SKU: formData.sku,
                    setorName: formData.setor,
                    description: formData.description || '',
                    measure: formData.measure,
                    max_storage: Number(formData.max_storage),
                    status: formData.status
                };
            }

            const res = await api.post('manager/insumos', payload);

            if (res.success === false) throw new Error(res.message || "Erro ao criar");

            toast.success("Insumo criado com sucesso!");
            fetchData(); // Recarrega a lista
            return true;

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Erro ao criar insumo.");
            return false;
        }
    };

    return {
        insumos,
        setores,
        loading,
        filters: { search, setorFilter, statusFilter },
        setFilters: { setSearch, setSetorFilter, setStatusFilter },
        fetchData,
        createInsumo
    };
};