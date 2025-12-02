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
    
    // --- DEPENDÊNCIAS E VALIDAÇÃO DE OCUPAÇÃO ---
    const fetchDependencies = useCallback(async () => {
        try {
            const [resSetores, resAllInsumos] = await Promise.all([
                api.get('setor?limit=1000'), 
                api.get('insumos?limit=5000')
            ]);
            
            const listaSetores = resSetores?.data || resSetores?.setores || [];
            setSetores(Array.isArray(listaSetores) ? listaSetores : []);

            const listaTodosInsumos = resAllInsumos?.data || resAllInsumos?.insumos || [];
            const occupied = new Set();
            if (Array.isArray(listaTodosInsumos)) {
                listaTodosInsumos.forEach(item => {
                    if (item.setorName && item.setorName !== 'N/A' && item.setorName !== 'null') {
                        occupied.add(item.setorName);
                    }
                });
            }
            setOccupiedSectors(occupied);
        } catch (err) { console.error("Erro deps", err); }
    }, []);

    // --- LISTAR (SEM SEARCH TEXTUAL) ---
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
                 const isNotFound = res.status === 404 || (res.message && (res.message.includes('Nenhum') || res.message.includes('encontrado')));
                 if (isNotFound) {
                    setInsumos([]);
                    setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
                    return;
                 }
                 setInsumos([]);
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
            console.warn("Fetch error:", err); 
            setInsumos([]); 
        } finally { 
            setLoading(false); 
        }
    }, []);

    const createInsumo = async (formData) => {
        setIsSubmitting(true);
        try {
            let payload;
            const cleanSku = String(formData.sku || "").toUpperCase().trim();
            
            if (!formData.name || cleanSku.length < 3 || !formData.setor) {
                toast.warning("Preencha os campos obrigatórios.");
                return false;
            }
            
            // Validação: O setor está ocupado por OUTRO insumo?
            // Nota: Se occupiedSectors contem o nome, e estamos criando um NOVO, bloqueia.
            if (occupiedSectors.has(formData.setor)) {
                toast.error(`O setor ${formData.setor} já está ocupado.`);
                return false;
            }

            if (formData.file) {
                payload = new FormData();
                payload.append('image', formData.file);
                payload.append('name', formData.name);
                payload.append('SKU', cleanSku);
                payload.append('setorName', formData.setor);
                payload.append('description', formData.description || '');
                payload.append('measure', formData.measure || 'UN');
                payload.append('max_storage', formData.max_storage || '0');
                payload.append('status', formData.status || 'ativo');
            } else {
                payload = { name: formData.name, SKU: cleanSku, setorName: formData.setor, description: formData.description, measure: formData.measure, max_storage: Number(formData.max_storage), status: formData.status };
            }

            const res = await api.post('manager/insumos', payload);

            if (res && res.success === false) {
                const msg = res.error || res.message || "Erro ao criar";
                toast.error(msg);
                return false;
            }

            toast.success("Criado com sucesso!");
            fetchDependencies(); // Atualiza lista de ocupação
            return true;

        } catch (err) {
            console.error(err);
            toast.error("Erro de conexão.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const updateInsumo = async (id, formData) => {
        setIsSubmitting(true);
        try {
            let payload;
            if (formData.file) {
                payload = new FormData();
                payload.append('image', formData.file);
                payload.append('name', formData.name);
                // Não envia SKU se não for necessário alterar
                payload.append('setorName', formData.setor);
                payload.append('description', formData.description);
                payload.append('measure', formData.measure);
                payload.append('max_storage', formData.max_storage);
            } else {
                payload = { 
                    name: formData.name, 
                    // SKU: formData.sku, // Comentado para segurança, geralmente SKU não muda
                    setorName: formData.setor, 
                    description: formData.description, 
                    measure: formData.measure, 
                    max_storage: Number(formData.max_storage) 
                };
            }

            const res = await api.put(`manager/insumos/${id}`, payload);
            
            if (res && res.success === false) { 
                const msg = res.error || res.message;
                if(msg?.includes('utilizado') || msg?.includes('ocupado')) {
                    toast.error("Setor indisponível.", { description: "Escolha um setor vazio." });
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

    const toggleStatus = async (id, currentStatus) => { 
        try {
            const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
            await api.put(`manager/insumos/status/${id}`, { status: newStatus });
            setInsumos(current => current.map(i => i.id === id ? { ...i, status: newStatus } : i));
            toast.success("Status alterado.");
            return true;
        } catch { 
            toast.error("Erro ao alterar status."); 
            return false; 
        }
    };

    const verifyInsumo = async (id) => {
        try {
            const res = await api.post(`manager/insumos/verify/${id}`);
            if (res && res.success === false) throw new Error(res.error);
            const newDate = res.lastCheck || new Date().toISOString();
            setInsumos(current => current.map(i => i.id === id ? { ...i, last_check: newDate } : i));
            toast.success("Verificado!");
            return newDate;
        } catch {
            toast.error("Erro ao verificar.");
            return null;
        }
    };

    return {
        insumos, setores, occupiedSectors, loading, isSubmitting, 
        pagination: { page, limit, meta },
        fetchData, fetchDependencies, createInsumo, updateInsumo, toggleStatus, verifyInsumo
    };
};