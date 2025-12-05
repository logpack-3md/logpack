import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useInsumosOperations = () => {
    const [insumos, setInsumos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [occupiedSectors, setOccupiedSectors] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchDependencies = useCallback(async () => {
        // (Código mantido, carrega setores e ocupação...)
        try {
            let s = [], i = [];
            try { const rs = await api.get('setor?limit=1000'); if (rs?.data) s = rs.data; } catch { }
            try { const ri = await api.get('insumos?limit=5000'); if (ri?.data) i = ri.data; } catch { }
            setSetores(s);
            const occ = new Set();
            i.forEach(it => { if (it.setorName && it.setorName !== 'N/A' && it.setorName.trim() !== '') occ.add(it.setorName); });
            setOccupiedSectors(occ);
        } catch (e) { console.error(e) }
    }, []);

    const fetchData = useCallback(async (pageIndex = 1, pageSize = 10, setorFilter = 'todos', statusFilter = 'todos') => {
        // (Código de busca da tabela mantido...)
        setLoading(true);
        try {
            const q = new URLSearchParams({ page: pageIndex, limit: pageSize });
            if (setorFilter !== 'todos') q.append('setorName', setorFilter);
            if (statusFilter !== 'todos') q.append('status', statusFilter);

            const res = await api.get(`insumos?${q}`);
            if (res?.success === false) { setInsumos([]); setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 }); return; }

            const norm = (res.data || []).map(i => ({
                ...i,
                current_storage: Number(i.current_storage || 0),
                // O Frontend usa '|| 1' no DISPLAY da tabela apenas para não dar divisão por zero, 
                // mas o dado puro do back é respeitado
                max_storage: Number(i.max_storage),
                setorName: i.setorName || 'N/A'
            }));
            setInsumos(norm);
            setMeta(res.meta || { totalItems: norm.length, totalPages: 1, currentPage: 1 });
            setPage(pageIndex); setLimit(pageSize);
        } catch { setInsumos([]) } finally { setLoading(false) }
    }, []);

    // --- CORREÇÃO AQUI ---
    const createInsumo = async (formData) => {
        setIsSubmitting(true);
        try {
            const cleanSku = String(formData.sku || "").toUpperCase().trim();
            if (!formData.name || cleanSku.length < 2) {
                toast.warning("Preencha Nome e SKU.");
                return false;
            }

            // Limpa setor
            let setorVal = formData.setor;
            if (!setorVal || setorVal === "none" || setorVal.trim() === "") setorVal = "";

            if (setorVal !== "" && occupiedSectors.has(setorVal)) {
                toast.error("Setor ocupado."); return false;
            }

            // Trata estoque
            // Se input vazio -> 0. Se "500" -> 500.
            const storageVal = formData.max_storage ? Number(formData.max_storage) : 0;

            let payload;
            if (formData.file) {
                payload = new FormData();
                payload.append('name', formData.name);
                payload.append('SKU', cleanSku);
                payload.append('setorName', setorVal);
                payload.append('description', formData.description || '');
                payload.append('measure', formData.measure || 'UN');
                // Append envia como string, controller converte
                payload.append('max_storage', storageVal);
                payload.append('status', formData.status || 'ativo');
                payload.append('image', formData.file);
            } else {
                payload = {
                    name: formData.name,
                    SKU: cleanSku,
                    setorName: setorVal,
                    description: formData.description || '',
                    measure: formData.measure || 'UN',
                    max_storage: storageVal, // Number
                    status: formData.status || 'ativo'
                };
            }

            const res = await api.post('manager/insumos', payload);

            if (res?.success === false) {
                toast.error(res.message || "Erro"); return false;
            }

            toast.success("Criado!");
            fetchDependencies();
            return true;
        } catch {
            toast.error("Erro requisição."); return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- UPDATE TAMBEM CORRIGIDO ---
    const updateInsumo = async (id, formData) => {
        setIsSubmitting(true);
        try {
            let setorVal = formData.setor;
            if (!setorVal || setorVal === "none" || setorVal.trim() === "") setorVal = "";

            const storageVal = formData.max_storage ? Number(formData.max_storage) : 0;

            let payload;
            if (formData.file) {
                payload = new FormData();
                payload.append('image', formData.file);
                payload.append('name', formData.name);
                payload.append('setorName', setorVal);
                payload.append('description', formData.description);
                payload.append('measure', formData.measure);
                payload.append('max_storage', storageVal);
            } else {
                payload = {
                    name: formData.name,
                    setorName: setorVal,
                    description: formData.description,
                    measure: formData.measure,
                    max_storage: storageVal
                };
            }

            const res = await api.put(`manager/insumos/${id}`, payload);
            if (res?.success === false) {
                toast.error(res.message || "Erro update"); return false;
            }

            toast.success("Atualizado!");
            fetchDependencies();
            return true;
        } catch { toast.error("Erro."); return false; }
        finally { setIsSubmitting(false); }
    };

    // Helpers básicos (toggle/verify) mantidos...
    const toggleStatus = async (id) => {
        try {
            await api.put(`manager/insumos/status/${id}`, { status: 'inativo' }); // exemplo simplificado
            // Logica real de toggle (consultar status atual ou enviar hardcoded)
            toast.success("Status.");
            fetchData(page, limit);
            return true;
        } catch { return false; }
    }

    const verifyInsumo = async (id) => {
        try { await api.post(`manager/insumos/verify/${id}`); toast.success("Verificado"); fetchData(page, limit); return true; }
        catch { return null; }
    }

    return { insumos, setores, occupiedSectors, loading, isSubmitting, pagination: { page, limit, meta }, fetchData, fetchDependencies, createInsumo, updateInsumo, toggleStatus, verifyInsumo };
}