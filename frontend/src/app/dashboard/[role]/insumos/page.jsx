// src/app/dashboard/[role]/insumos/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Box } from '@mui/material';
import { 
  Search, Droplets, Package, Box as BoxIcon, FileText, Shield, Clock, Plus, Upload, ArrowUpRight, AlertCircle, ChevronDown 
} from 'lucide-react';
import CreateButton from '@/components/ui/create-button';
import { FloatingActions } from '@/components/ui/floating-actions';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const iconMap = {
  insumo: Droplets,
  embalagem: BoxIcon,
  acessório: FileText,
  suporte: Package,
  proteção: Shield,
};

// SELECT CUSTOMIZADO QUE ABRE PRA BAIXO E ROLA SUAVE
function CustomSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg bg-white flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {selectedLabel}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange({ target: { name: 'setor', value: opt.value } });
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-gray-800 text-sm"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InsumosPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [allInsumos, setAllInsumos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // CARREGA TODOS OS SETORES (50+)
  useEffect(() => {
    const fetchAllSetores = async () => {
      try {
        let allSetores = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await api.get(`setor?page=${page}&limit=100`);
          const data = res?.data || res?.setores || res || [];

          if (!Array.isArray(data) || data.length === 0) break;

          const formatted = data
            .filter(s => s && (s.name || s.nome))
            .map(s => ({
              id: s.id || s._id,
              name: s.name || s.nome || 'Sem nome',
              status: s.status || 'ativo',
            }));

          allSetores = [...allSetores, ...formatted];
          if (data.length < 100) hasMore = false;
          else page++;
        }

        allSetores.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
        setSetores(allSetores);
        console.log(`Total de setores carregados: ${allSetores.length}`);
      } catch (err) {
        console.error(err);
        toast.error('Falha ao carregar setores');
      }
    };

    fetchAllSetores();
  }, []);

  // Carrega insumos
  const loadInsumos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('insumos?limit=1000');
      if (res?.error) throw new Error();

      const formatted = (res.data || []).map(i => {
        const sku = [i.SKU, i.sku, i.codigo, i.code, i.sku_code, i.Sku].find(s => s) || 'SEM SKU';
        return {
          id: i.id || i._id,
          name: i.name || i.nome || 'Sem nome',
          SKU: sku,
          setorName: i.setorName || i.setor?.name || 'Geral',
          status: i.status || 'ativo',
          image: i.image || i.imagem,
          createdAt: i.createdAt || i.updatedAt || new Date(),
          bgColor: getRandomColor(),
          tipo: (i.setorName || i.setor?.name || 'insumo').toLowerCase(),
          ultima: formatLastCheck(i.createdAt || i.updatedAt),
        };
      });

      const sorted = formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllInsumos(sorted);
      setInsumos(sorted);
    } catch {
      toast.error('Falha ao carregar insumos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInsumos(); }, [loadInsumos]);

  // Filtro
  useEffect(() => {
    let filtered = [...allInsumos];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(q) || i.SKU.toLowerCase().includes(q)
      );
    }
    if (filtro !== 'todos') filtered = filtered.filter(i => i.setorName === filtro);
    if (statusFiltro !== 'todos') filtered = filtered.filter(i => i.status === statusFiltro);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setInsumos(filtered);
  }, [debouncedSearch, filtro, statusFiltro, allInsumos]);

  // Criação
  const handleCreateInsumo = async (formData, file) => {
    const payload = {
      name: formData.nome?.trim(),
      SKU: formData.sku?.trim(),
      setorName: formData.setor,
      description: formData.descricao?.trim() || '',
      measure: formData.medida,
      max_storage: formData.max_storage ? Number(formData.max_storage) : undefined,
      status: formData.status || 'ativo',
    };

    if (!payload.name || !payload.SKU || !payload.setorName || !payload.measure) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }

    try {
      let result;
      if (file) {
        const form = new FormData();
        form.append('file', file, file.name);
        Object.entries(payload).forEach(([k, v]) => v !== undefined && v !== null && form.append(k, String(v)));
        result = await api.post('manager/insumos', form);
      } else {
        result = await api.post('manager/insumos', payload);
      }

      if (result?.error || result?.success === false) {
        setErrorModal({ open: true, message: result.error || result.message || 'Erro ao criar insumo' });
        return false;
      }

      toast.success('Insumo criado com sucesso!');
      await loadInsumos();
      return true;
    } catch (err) {
      setErrorModal({ open: true, message: 'Erro de conexão com o servidor' });
      return false;
    }
  };

  // Opções pro select customizado
  const setorOptions = setores.map(s => ({
    value: s.name,
    label: `${s.name} ${s.status === 'inativo' ? '(inativo)' : ''}`,
  }));

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 }, minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Insumos</h1>
        <p className="text-sm text-gray-600 mt-1">Gerencie todos os insumos, embalagens e materiais</p>
      </Box>

      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </Box>
        <select value={filtro} onChange={e => setFiltro(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg">
          <option value="todos">Todos os setores</option>
          {setores.map(s => (
            <option key={s.id} value={s.name}>
              {s.name} {s.status === 'inativo' ? '(inativo)' : ''}
            </option>
          ))}
        </select>
        <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg">
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </Box>

      {/* Cards de insumos */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
        gap: 4,
        mb: 8
      }}>
        {insumos.map(insumo => {
          const Icon = iconMap[insumo.tipo] || Droplets;
          const colorKey = insumo.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
          const textColor = `text-${colorKey}-600`;

          return (
            <Box key={insumo.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 group cursor-pointer">
              {insumo.image && <img src={insumo.image} alt={insumo.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box className={`p-3 rounded-xl ${insumo.bgColor} ${textColor}`}><Icon className="w-6 h-6" /></Box>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-gray-900 truncate max-w-[180px]">{insumo.name}</h3>
                    <span className="inline-flex items-center justify-center min-w-[68px] max-w-[90px] px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-700/10">
                      <span className="truncate block leading-none">{insumo.SKU}</span>
                    </span>
                  </div>
                </Box>
                <ArrowUpRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, fontSize: '0.8rem', borderTop: '1px solid #e5e7eb', pt: 3 }}>
                <Box><p className="text-gray-500 text-xs">Setor</p><p className="font-medium capitalize flex items-center mt-1"><Shield className="w-4 h-4 mr-1.5 text-gray-400" />{insumo.tipo}</p></Box>
                <Box><p className="text-gray-500 text-xs">Última reposição</p><p className="font-medium flex items-center mt-1"><Clock className="w-4 h-4 mr-1.5 text-gray-400" />{insumo.ultima}</p></Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Botão + */}
      <button onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal'))}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl z-50 border-4 border-white">
        <Plus className="w-7 h-7" />
      </button>

      <FloatingActions />

      {/* Modal de erro */}
      {errorModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Erro ao criar insumo</h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed mb-8">{errorModal.message}</p>
            <button onClick={() => setErrorModal({ open: false, message: '' })}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg text-lg">
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE CRIAÇÃO COM SELECT PERFEITO */}
      <CreateButton title="Criar Novo Insumo" onSubmit={handleCreateInsumo}>
        {({ formData, handleChange, setFile }) => (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome *</label>
              <input name="nome" value={formData.nome || ''} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
              <input name="sku" value={formData.sku || ''} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>

            {/* SELECT CUSTOMIZADO QUE ABRE PRA BAIXO */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Setor *</label>
              <CustomSelect
                options={setorOptions}
                value={formData.setor || ''}
                onChange={handleChange}
                placeholder="Selecione o setor"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
              <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medida *</label>
              <select name="medida" value={formData.medida || ''} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                <option value="">Selecione</option>
                <option value="KG">KG</option>
                <option value="G">G</option>
                <option value="ML">ML</option>
                <option value="L">L</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estoque Máx.</label>
              <input name="max_storage" type="number" value={formData.max_storage || ''} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status || 'ativo'} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Imagem</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-xs text-gray-500">Clique para upload</p>
                <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              </label>
            </div>
          </div>
        )}
      </CreateButton>
    </Box>
  );
}

const getRandomColor = () => ['bg-blue-100', 'bg-orange-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-teal-100'][Math.floor(Math.random() * 6)];

const formatLastCheck = date => {
  if (!date) return 'Nunca';
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  return d > 0 ? `${d}d atrás` : h > 0 ? `${h}h atrás` : m > 0 ? `${m}min atrás` : 'agora';
};