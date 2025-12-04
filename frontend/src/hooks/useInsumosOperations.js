import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useInsumosOperations = () => {
    const [insumos, setInsumos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [occupiedSectors, setOccupiedSectors] = useState(new Set());
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
    
    // --- CARREGAR DEPENDÊNCIAS (SETORES E OCUPAÇÃO) ---
    const fetchDependencies = useCallback(async () => {
        let listaSetores = [];
        let listaTodosInsumos = [];

        try {
            // Tenta buscar setores
            try {
                const resSetores = await api.get('setor?limit=1000');
                if (resSetores && (resSetores.data || resSetores.setores)) {
                    listaSetores = resSetores.data || resSetores.setores;
                }
            } catch (e) { 
                console.warn("Aviso: Não foi possível carregar setores.", e); 
            }

            // Tenta buscar insumos para verificar ocupação
            try {
                const resAllInsumos = await api.get('insumos?limit=5000');
                if (resAllInsumos && (resAllInsumos.data || resAllInsumos.insumos)) {
                    listaTodosInsumos = resAllInsumos.data || resAllInsumos.insumos;
                }
            } catch (e) { 
                console.warn("Aviso: Não foi possível mapear ocupação.", e); 
            }

            setSetores(Array.isArray(listaSetores) ? listaSetores : []);

            // Mapeia setores ocupados
            const occupied = new Set();
            if (Array.isArray(listaTodosInsumos)) {
                listaTodosInsumos.forEach(item => {
                    if (item.setorName && item.setorName !== 'N/A' && item.setorName.trim() !== '') {
                        occupied.add(item.setorName);
                    }
                });
            }
            setOccupiedSectors(occupied);

        } catch (err) { 
            console.error("Erro geral ao carregar dependências", err); 
        }
    }, []);

    // --- LISTAR INSUMOS PAGINADOS ---
    const fetchData = useCallback(async (pageIndex = 1, pageSize = 10, setorFilter = 'todos', statusFilter = 'todos') => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ 
                page: pageIndex.toString(), 
                limit: pageSize.toString() 
            });

            if (setorFilter !== 'todos') queryParams.append('setorName', setorFilter);
            if (statusFilter !== 'todos') queryParams.append('status', statusFilter);
            
            const res = await api.get(`insumos?${queryParams.toString()}`);
            
            if (res && res.success === false) {
                 setInsumos([]);
                 setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                 return; 
            }

            const rawList = res?.data || res?.insumos || [];
            const normalized = rawList.map(i => ({
                id: i.id || i._id,
                name: i.name,
                sku: i.SKU || i.sku,
                setorName: i.setorName || 'N/A',
                current_storage: Number(i.current_storage || 0),
                max_storage: Number(i.max_storage || 1),
                status: i.status,
                image: i.image,
                description: i.description,
                measure: i.measure,
                last_check: i.last_check
            }));

            setInsumos(normalized);
            setMeta(res?.meta || { totalItems: normalized.length, totalPages: Math.ceil(normalized.length / pageSize), currentPage: pageIndex });
            
            setPage(pageIndex);
            setLimit(pageSize);

        } catch (err) { 
            console.warn("Erro ao buscar insumos:", err); 
            setInsumos([]); 
        } finally { 
            setLoading(false); 
        }
    }, []);

    // --- CRIAR INSUMO ---
    const createInsumo = async (formData) => {
        setIsSubmitting(true);
        try {
            const cleanSku = String(formData.sku || "").toUpperCase().trim();
            
            // Validação Mínima
            if (!formData.name || cleanSku.length < 2) {
                toast.warning("Preencha o Nome e SKU.");
                return false;
            }

            // LÓGICA DO SETOR: Se for "none", vazio ou null, envia string vazia
            let setorToSend = formData.setor;
            if (!setorToSend || setorToSend === "none" || setorToSend.trim() === "") {
                setorToSend = ""; 
            }
            
            // Validação de ocupação: Só ocorre se realmente existir um setor selecionado
            if (setorToSend !== "" && occupiedSectors.has(setorToSend)) {
                toast.error(`O setor ${setorToSend} já está ocupado.`);
                return false;
            }

            let payload;

            // Se tiver arquivo, usa FormData
            if (formData.file) {
                payload = new FormData();
                payload.append('image', formData.file);
                payload.append('name', formData.name);
                payload.append('SKU', cleanSku);
                payload.append('setorName', setorToSend); // Backend deve tratar "" como NULL
                payload.append('description', formData.description || '');
                payload.append('measure', formData.measure || 'UN');
                payload.append('max_storage', formData.max_storage || '0');
                payload.append('status', formData.status || 'ativo');
            } 
            // Se não, usa JSON normal
            else {
                payload = { 
                    name: formData.name, 
                    SKU: cleanSku, 
                    setorName: setorToSend, 
                    description: formData.description || "", 
                    measure: formData.measure || 'UN', 
                    max_storage: Number(formData.max_storage || 0), 
                    status: formData.status || 'ativo'
                };
            }

            const res = await api.post('manager/insumos', payload);

            if (res && res.success === false) {
                const msg = res.error || res.message || "Erro ao criar";
                toast.error(msg);
                return false;
            }

            toast.success("Insumo criado com sucesso!");
            fetchDependencies(); // Atualiza dependencias para bloquear setor usado
            return true;

        } catch (err) {
            console.error(err);
            toast.error("Erro de conexão.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- ATUALIZAR INSUMO ---
    const updateInsumo = async (id, formData) => {
        setIsSubmitting(true);
        try {
            // Lógica de Setor idêntica à criação
            let setorToSend = formData.setor;
            if (!setorToSend || setorToSend === "none" || setorToSend.trim() === "") {
                setorToSend = "";
            }

            let payload;
            if (formData.file) {
                payload = new FormData();
                payload.append('image', formData.file);
                payload.append('name', formData.name);
                payload.append('setorName', setorToSend);
                payload.append('description', formData.description);
                payload.append('measure', formData.measure);
                payload.append('max_storage', formData.max_storage);
            } else {
                payload = { 
                    name: formData.name, 
                    setorName: setorToSend, 
                    description: formData.description, 
                    measure: formData.measure, 
                    max_storage: Number(formData.max_storage) 
                };
            }

            const res = await api.put(`manager/insumos/${id}`, payload);
            
            if (res && res.success === false) { 
                const msg = res.error || res.message;
                // Exibe erro de ocupação se o backend reclamar
                if(msg?.includes('ocupado') || msg?.includes('indisponível')) {
                    toast.error("Setor ocupado. Escolha outro ou deixe vazio.");
                } else {
                    toast.error(msg || "Erro ao atualizar.");
                }
                return false; 
            }

            toast.success("Atualizado!"); 
            fetchDependencies();
            return true;
        } catch (err) { 
            toast.error("Erro ao editar."); 
            return false; 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    // --- OUTROS MÉTODOS ---
    
    const toggleStatus = async (id, currentStatus) => { 
        try {
            const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
            await api.put(`manager/insumos/status/${id}`, { status: newStatus });
            setInsumos(current => current.map(i => i.id === id ? { ...i, status: newStatus } : i));
            toast.success(`Insumo ${newStatus}.`);
            return true;
        } catch { 
            toast.error("Erro ao alterar status."); 
            return false; 
        }
    };

    const verifyInsumo = async (id) => {
        try {
            const res = await api.post(`manager/insumos/verify/${id}`);
            if(res && res.success === false) throw new Error(res.error);
            const newDate = res.lastCheck || new Date().toISOString();
            setInsumos(current => current.map(i => i.id === id ? { ...i, last_check: newDate } : i));
            toast.success("Verificado com sucesso!"); 
            return newDate;
        } catch { 
            toast.error("Erro ao verificar."); 
            return null; 
        }
    };

    return {
        insumos, 
        setores, 
        occupiedSectors, 
        loading, 
        isSubmitting, 
        pagination: { page, limit, meta },
        fetchData, 
        fetchDependencies, 
        createInsumo, 
        updateInsumo, 
        toggleStatus, 
        verifyInsumo
    };
};