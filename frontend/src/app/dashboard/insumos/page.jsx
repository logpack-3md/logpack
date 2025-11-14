// src/app/dashboard/insumos/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [filtro, setFiltro] = useState('todos');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [setores, setSetores] = useState([]);

  const limit = 12;

  // CARREGAR SETORES DO BACK-END
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await api.get('setor');
        console.log('Resposta do back-end (setor):', response);

        let setoresArray = [];

        if (Array.isArray(response)) {
          setoresArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          setoresArray = response.data;
        } else if (response?.setores && Array.isArray(response.setores)) {
          setoresArray = response.setores;
        } else {
          toast.error('Nenhum setor encontrado');
          return;
        }

        const formatted = setoresArray.map(s => ({
          id: s.id || s._id,
          name: s.name || s.nome || 'Sem nome'
        }));

        setSetores(formatted);
        if (formatted.length > 0) {
          toast.success(`Carregados ${formatted.length} setores`);
        }
      } catch (err) {
        console.error('Erro ao carregar setores:', err);
        toast.error('Falha ao carregar setores');
      }
    };
    fetchSetores();
  }, []);

  // CARREGAR INSUMOS
  const loadInsumos = useCallback(async (reset = false) => {
    if (loading || loadingMore || !hasMore) return;

    const currentPage = reset ? 1 : page;
    if (reset) {
      setPage(1);
      setInsumos([]);
    }

    if (currentPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        ...(search && { search }),
        ...(filtro !== 'todos' && { setor: filtro }),
        ...(statusFiltro !== 'todos' && { status: statusFiltro }),
      });

      const response = await api.get(`insumos?${params}`);
      if (!response || response.error) {
        toast.error(response?.message || 'Erro ao carregar insumos');
        return;
      }

      const formatted = response.data.map(insumo => ({
        id: insumo.id,
        name: insumo.name,
        email: insumo.SKU,
        bgColor: getRandomColor(),
        tipo: insumo.setorName?.toLowerCase() || 'insumo',
        ultima: formatLastCheck(insumo.last_check),
        image: insumo.image,
      }));

      if (reset) {
        setInsumos(formatted);
      } else {
        setInsumos(prev => [...prev, ...formatted]);
      }

      setPage(currentPage + 1);
      setHasMore(response.meta.currentPage < response.meta.totalPages);
    } catch (err) {
      toast.error('Falha ao carregar insumos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, search, filtro, statusFiltro]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadInsumos(true);
  }, [search, filtro, statusFiltro, loadInsumos]);

  // === CRIAR INSUMO (100% FUNCIONAL) ===
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

    // Validação básica
    if (!payload.name || !payload.SKU || !payload.setorName || !payload.measure) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }

    try {
      let result;

      if (file) {
        // COM IMAGEM → FormData
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.append(key, value);
          }
        });
        form.append('file', file);

        result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}insumos`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getTokenFromCookie()}`,
          },
          body: form,
        });
      } else {
        // SEM IMAGEM → JSON via api.post()
        result = await api.post('insumos', payload);
      }

      const data = result.ok ? await result.json() : null;

      if (!result.ok) {
        console.error('Erro do back-end:', data);
        if (data?.issues) {
          data.issues.forEach(issue => toast.error(issue.message || 'Campo inválido'));
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error(`Erro ${result.status}: Falha ao criar insumo`);
        }
        return false;
      }

      toast.success('Insumo criado com sucesso!');
      loadInsumos(true);
      return true;
    } catch (err) {
      console.error('Erro de rede:', err);
      toast.error('Falha na conexão com o servidor');
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
                    <p className="text-xs text-gray-500">{insumo.email}</p>
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

      {/* VER MAIS */}
      {hasMore && !loading && (
        <div className="flex justify-center mb-12">
          <button
            onClick={() => loadInsumos()}
            disabled={loadingMore}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-3 font-medium shadow-lg hover:shadow-xl"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Carregando...
              </>
            ) : (
              'Carregar mais insumos'
            )}
          </button>
        </div>
      )}

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
                {setores.length > 0 ? (
                  setores.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))
                ) : (
                  <option disabled>Carregando setores...</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição *</label>
              <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} rows={3} placeholder="Descreva o insumo com pelo menos 10 caracteres..." className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none" required />
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