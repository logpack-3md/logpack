// src/app/dashboard/manager/setores/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Search, Plus, Shield, Clock, Edit2 } from 'lucide-react';
import CreateButton from '@/components/ui/create-button';
import { FloatingActions } from '@/components/ui/floating-actions';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const iconMap = {
  insumo: Shield,
  embalagem: Shield,
  acessório: Shield,
  suporte: Shield,
  proteção: Shield,
};

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

export default function SetoresPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [setores, setSetores] = useState([]);
  const [allSetores, setAllSetores] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState(null);

  // FUNÇÃO PARA CARREGAR SETORES — AGORA ESTÁ NO ESCOPO CORRETO
  const fetchSetores = async () => {
    setLoading(true);
    try {
      const response = await api.get('setor?limit=1000');
      if (response?.error) {
        toast.error(response.message || 'Erro ao carregar setores');
        return;
      }

      const data = Array.isArray(response) ? response : response.data || response.setores || [];
      const formatted = data.map(s => ({
        id: s.id || s._id,
        name: s.name || s.nome || 'Sem nome',
        status: s.status || 'pendente',
        maxStorage: s.max_storage || null,
        bgColor: getRandomColor(),
        tipo: (s.name || s.nome || '').toLowerCase(),
        ultima: formatLastCheck(s.updatedAt || s.last_check),
      }));

      setAllSetores(formatted);
      setSetores(formatted);
    } catch (err) {
      console.error('Erro ao carregar setores:', err);
      toast.error('Falha ao carregar setores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchSetores(); // Carrega na primeira vez
  }, []);

  useEffect(() => {
    let filtered = [...allSetores];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q));
    }
    setSetores(filtered);
  }, [debouncedSearch, allSetores]);

  const handleCreateSetor = async (formData) => {
    const nome = formData.nome?.trim();
    if (!nome) {
      toast.error('Nome do setor é obrigatório');
      return false;
    }

    try {
      await api.post('manager/setor', { name: nome });
      toast.success('Setor criado com sucesso!');
      await fetchSetores();
      return true;
    } catch (err) {
      toast.error('Erro ao criar setor');
      return false;
    }
  };

  const openEditModal = (setor) => {
    setEditingSetor(setor);
    setEditOpen(true);
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 }, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Setores</h1>
        <p className="text-sm text-gray-600 mt-1">Gerencie todos os setores da operação</p>
      </Box>

      <Box sx={{ position: 'relative', maxWidth: '400px', mb: 6 }}>
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar setor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </Box>

      <div className="mb-4 text-sm text-gray-600">
        Mostrando <strong>{setores.length}</strong> de <strong>{allSetores.length}</strong> setores
      </div>

      {loading && setores.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando setores...</p>
        </div>
      )}

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
        gap: 4,
        mb: 8
      }}>
        {setores.map((setor) => {
          const Icon = iconMap[setor.tipo] || Shield;
          const colorKey = setor.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
          const textColor = `text-${colorKey}-600`;

          return (
            <Box
              key={setor.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(setor);
                }}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-md opacity-0 group-hover:opacity-100 transition-all z-10 border border-gray-200"
                title="Editar setor"
              >
                <Edit2 className="w-4 h-4 text-gray-700" />
              </button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pr: 10 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box className={`p-3 rounded-xl ${setor.bgColor} ${textColor}`}>
                    <Icon className="w-6 h-6" />
                  </Box>
                  <Box>
                    <h3 className="font-semibold text-gray-900">{setor.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                      setor.status === 'ativo' ? 'bg-green-100 text-green-700' :
                      setor.status === 'inativo' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {setor.status}
                    </span>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 3 }}>
                <p className="text-xs text-gray-500">Última atualização</p>
                <p className="text-sm font-medium flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                  {setor.ultima}
                </p>
                {setor.maxStorage != null && (
  <p className="text-xs text-gray-500 mt-2">
    Estoque máx: <strong>{Number(setor.maxStorage).toLocaleString('pt-BR')}</strong> unid.
  </p>
)}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Botão + */}
      <button
        onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal'))}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-110 duration-200 z-50 border-4 border-white"
      >
        <Plus className="w-7 h-7" />
      </button>

      <FloatingActions />

      {/* Modal Criação */}
      <CreateButton title="Criar Novo Setor" onSubmit={handleCreateSetor}>
        {({ formData, handleChange }) => (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Setor *</label>
              <input
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                placeholder="Ex: B01 - Embalagem"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>
        )}
      </CreateButton>

      {/* MODAL DE EDIÇÃO — AGORA FUNCIONA 100% */}
      <CreateButton
        title="Editar Setor"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={async (formData) => {
          if (!editingSetor) return false;
        
          try {
            const promises = [];
        
            // 1. NOME
            if (formData.nome?.trim() && formData.nome.trim() !== editingSetor.name) {
              promises.push(
                api.put(`manager/setor/name/${editingSetor.id}`, { name: formData.nome.trim() })
              );
            }
        
            // 2. STATUS
            if (formData.status && formData.status !== editingSetor.status) {
              promises.push(
                api.put(`manager/setor/status/${editingSetor.id}`, { status: formData.status })
              );
            }
        
            // 3. MAX STORAGE
            if (formData.maxStorage !== undefined && formData.maxStorage !== '' && formData.maxStorage !== null) {
              const value = Number(formData.maxStorage);
              if (isNaN(value)) {
                toast.error('Capacidade inválida');
                return false;
              }
              if (value % 200 !== 0) {
                toast.error('Deve ser múltiplo de 200');
                return false;
              }
              if (value !== editingSetor.maxStorage) {
                promises.push(
                  api.put(`manager/insumos/storage/${editingSetor.id}`, { max_storage: value })
                );
              }
            }
        
            if (promises.length === 0) {
              toast.info('Nenhuma alteração');
              setEditOpen(false);
              return true;
            }
        
            await Promise.all(promises);
            toast.success('Setor atualizado com sucesso!');
            await fetchSetores();
            setEditOpen(false);
            return true;
          } catch (err) {
            console.error('Erro ao salvar:', err);
            toast.error('Erro ao salvar. Verifique o console.');
            return false;
          }
        }}
      >
        {({ formData, handleChange }) => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Setor</label>
              <input name="nome" defaultValue={editingSetor?.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="status" defaultValue={editingSetor?.status || 'pendente'} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidade Máxima de Estoque</label>
              <input type="number" name="maxStorage" defaultValue={editingSetor?.maxStorage || ''} placeholder="Ex: 5000" step="200" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">Múltiplo de 200</p>
            </div>
          </div>
        )}
      </CreateButton>
    </Box>
  );
}