// src/app/dashboard/[role]/insumos/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Search, Droplets, Package, Box as BoxIcon, FileText, Shield, Clock, Plus, Upload } from 'lucide-react';
import { RiArrowRightUpLine } from '@remixicon/react';
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

export default function InsumosPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [insumos, setInsumos] = useState([]);           // exibidos
  const [allInsumos, setAllInsumos] = useState([]);     // todos (base)
  const [setores, setSetores] = useState([]);

  // === DEBOUNCE: 300ms ===
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // === CARREGAR SETORES ===
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await api.get('setor');
        let setoresArray = [];
        if (Array.isArray(response)) {
          setoresArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          setoresArray = response.data;
        } else if (response?.setores && Array.isArray(response.setores)) {
          setoresArray = response.setores;
        }

        if (setoresArray.length === 0) {
          toast.warning('Nenhum setor encontrado');
          return;
        }

        const formatted = setoresArray
          .filter(s => s && (s.name || s.nome))
          .map(s => ({
            id: s.id || s._id,
            name: s.name || s.nome || 'Sem nome'
          }));

        setSetores(formatted);
        toast.success(`Carregados ${formatted.length} setores`);
      } catch (err) {
        console.error('Erro ao carregar setores:', err);
        toast.error('Falha ao carregar setores');
      }
    };
    fetchSetores();
  }, []);

  // === CARREGAR TODOS OS INSUMOS (SÓ UMA VEZ) ===
  useEffect(() => {
    const fetchAllInsumos = async () => {
      setLoading(true);
      try {
        const response = await api.get('insumos?limit=1000');

        if (response?.error) {
          toast.error(response.message || 'Erro ao carregar insumos');
          return;
        }

        const formatted = (response.data || []).map(insumo => ({
          id: insumo.id || insumo._id,
          name: insumo.name,
          SKU: insumo.SKU,
          setorName: insumo.setorName,
          status: insumo.status || 'ativo',
          image: insumo.image,
          last_check: insumo.last_check || insumo.updatedAt,
          bgColor: getRandomColor(),
          tipo: insumo.setorName?.toLowerCase() || 'insumo',
          ultima: formatLastCheck(insumo.last_check || insumo.updatedAt),
        }));

        setAllInsumos(formatted);
        setInsumos(formatted);
        toast.success(`Carregados ${formatted.length} insumos`);
      } catch (err) {
        console.error('Erro ao carregar insumos:', err);
        toast.error('Falha ao carregar insumos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllInsumos();
  }, []);

  // === FILTRAR NO FRONT-END ===
  useEffect(() => {
    let filtered = [...allInsumos];

    // Busca por nome ou SKU
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.SKU?.toLowerCase().includes(query)
      );
    }

    // Filtro por setor
    if (filtro !== 'todos') {
      filtered = filtered.filter(item => item.setorName === filtro);
    }

    // Filtro por status
    if (statusFiltro !== 'todos') {
      filtered = filtered.filter(item => item.status === statusFiltro);
    }

    setInsumos(filtered);
  }, [debouncedSearch, filtro, statusFiltro, allInsumos]);

  // === CRIAR INSUMO ===
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
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) form.append(key, value);
        });
        form.append('file', file);

        const token = getTokenFromCookie();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}manager/insumos`, {
          method: 'POST',
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          body: form,
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || `Erro ${response.status}`);
          return false;
        }
        result = data;
      } else {
        result = await api.post('manager/insumos', payload);
        if (result?.error) {
          toast.error(result.message);
          return false;
        }
      }

      toast.success('Insumo criado com sucesso!');

      // RECARREGA TODOS OS INSUMOS
      const response = await api.get('insumos?limit=1000');
      const formatted = (response.data || []).map(insumo => ({
        id: insumo.id || insumo._id,
        name: insumo.name,
        SKU: insumo.SKU,
        setorName: insumo.setorName,
        status: insumo.status || 'ativo',
        image: insumo.image,
        last_check: insumo.last_check || insumo.updatedAt,
        bgColor: getRandomColor(),
        tipo: insumo.setorName?.toLowerCase() || 'insumo',
        ultima: formatLastCheck(insumo.last_check || insumo.updatedAt),
      }));
      setAllInsumos(formatted);
      setInsumos(formatted);

      return true;
    } catch (err) {
      console.error('Erro ao criar insumo:', err);
      toast.error('Erro inesperado');
      return false;
    }
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 }, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Insumos</h1>
        <p className="text-sm text-gray-600 mt-1">Gerencie todos os insumos, embalagens e materiais</p>
      </Box>

      {/* FILTROS */}
      <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </Box>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="todos">Todos os setores</option>
          {setores.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </Box>

      {/* CONTADOR DE RESULTADOS */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando <strong>{insumos.length}</strong> de <strong>{allInsumos.length}</strong> insumos
      </div>

      {/* LOADING */}
      {loading && insumos.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando insumos...</p>
        </div>
      )}

      {/* GRID */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, 
        gap: 4, 
        mb: 8 
      }}>
        {insumos.map((insumo) => {
          const Icon = iconMap[insumo.tipo] || Droplets;
          const colorKey = insumo.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
          const textColor = `text-${colorKey}-600`;

          return (
            <Box key={insumo.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group cursor-pointer">
              {insumo.image && (
                <img src={insumo.image} alt={insumo.name} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box className={`p-3 rounded-xl ${insumo.bgColor} ${textColor}`}>
                    <Icon className="w-6 h-6" />
                  </Box>
                  <Box>
                    <h3 className="font-semibold text-gray-900">{insumo.name}</h3>
                    <p className="text-xs text-gray-500">{insumo.SKU}</p>
                  </Box>
                </Box>
                <RiArrowRightUpLine className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, fontSize: '0.8rem', borderTop: '1px solid #e5e7eb', pt: 3 }}>
                <Box>
                  <p className="text-gray-500 text-xs">Setor</p>
                  <p className="font-medium capitalize flex items-center mt-1">
                    <Shield className="w-4 h-4 mr-1.5 text-gray-400" />
                    {insumo.tipo}
                  </p>
                </Box>
                <Box>
                  <p className="text-gray-500 text-xs">Última reposição</p>
                  <p className="font-medium flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    {insumo.ultima}
                  </p>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* BOTÃO + */}
      <button
        onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal'))}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-110 duration-200 z-50 border-4 border-white"
      >
        <Plus className="w-7 h-7" />
      </button>

      <FloatingActions />

      {/* MODAL DE CRIAÇÃO */}
      <CreateButton title="Criar Novo Insumo" onSubmit={handleCreateInsumo}>
        {({ formData, handleChange, setFile }) => (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Insumo *</label>
              <input name="nome" value={formData.nome || ''} onChange={handleChange} placeholder="Ex: Saco de lixo 100L" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
              <input name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="Ex: SACO-100L" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Setor *</label>
              <select name="setor" value={formData.setor || ''} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Selecione o setor</option>
                {setores.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição *</label>
              <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} rows={3} placeholder="Descreva o insumo..." className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unidade de Medida *</label>
              <select name="medida" value={formData.medida || ''} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Selecione</option>
                <option value="KG">KG</option>
                <option value="G">G</option>
                <option value="ML">ML</option>
                <option value="L">L</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estoque Máximo (opcional)</label>
              <input name="max_storage" type="number" value={formData.max_storage || ''} onChange={handleChange} placeholder="100" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status || 'ativo'} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Imagem (opcional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Clique para fazer upload</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>
        )}
      </CreateButton>
    </Box>
  );
}

// === FUNÇÕES AUXILIARES ===
const getRandomColor = () => {
  const colors = ['bg-blue-100', 'bg-orange-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-teal-100'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const formatLastCheck = (date) => {
  if (!date) return 'Nunca';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return 'agora';
};

const getTokenFromCookie = () => {
  const match = document.cookie.match(/(^|;)\s*token=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
};