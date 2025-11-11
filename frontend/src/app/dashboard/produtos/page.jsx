// src/app/produtos/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Search, Package, Droplets, Box as BoxIcon, FileText, Shield, Clock, Plus } from 'lucide-react';
import { RiArrowRightUpLine } from '@remixicon/react';
import { CreateButton } from '@/components/ui/create-button';
import { FloatingActions } from '@/components/ui/floating-actions';

const iconMap = {
  insumo: Droplets,
  embalagem: BoxIcon,
  acessório: FileText,
  suporte: Package,
  proteção: Shield,
};

export default function ProdutosPage() {
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 12; // Quantidade por página

  // Carregar produtos (simulação + pronto para backend)
  const loadProdutos = async (reset = false) => {
    if (loading || loadingMore || !hasMore) return;

    const isInitial = reset && skip === 0;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      // FUTURO: BACKEND
      // const res = await fetch(`/api/produtos?skip=${skip}&limit=${limit}&search=${search}&tipo=${filtro}`);
      // const data = await res.json();

      // SIMULAÇÃO (substitua pelo fetch acima)
      await new Promise(r => setTimeout(r, 800));
      const mockData = [
        { id: skip + 1, name: `Produto ${skip + 1}`, email: `prod${skip + 1}@ex.com`, bgColor: 'bg-blue-100', tipo: 'insumo', ultima: 'agora' },
        { id: skip + 2, name: `Caixa ${skip + 2}`, email: `caixa${skip + 2}@ex.com`, bgColor: 'bg-orange-100', tipo: 'embalagem', ultima: '1h' },
        // ... mais 10
      ].slice(0, limit);

      if (reset) {
        setProdutos(mockData);
      } else {
        setProdutos(prev => [...prev, ...mockData]);
      }

      setSkip(prev => prev + limit);
      setHasMore(mockData.length === limit); // Simula fim
    } catch (err) {
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Carregar inicial
  useEffect(() => {
    loadProdutos(true);
  }, [search, filtro]);

  // Resetar ao mudar filtro/busca
  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    loadProdutos(true);
  }, [search, filtro]);

  const openModal = () => {
    document.dispatchEvent(new CustomEvent('open-create-modal'));
  };

  const handleCreateProduto = async (data) => {
    console.log('Criando:', data);
    alert('Produto criado com sucesso!');
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 }, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <p className="text-sm text-gray-600 mt-1">Gerencie todos os insumos e embalagens</p>
      </Box>

      {/* FILTROS */}
      <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </Box>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="todos">Todos os tipos</option>
          <option value="insumo">Insumo</option>
          <option value="embalagem">Embalagem</option>
          <option value="acessório">Acessório</option>
          <option value="suporte">Suporte</option>
          <option value="proteção">Proteção</option>
        </select>
      </Box>

      {/* GRID DE PRODUTOS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4, mb: 8 }}>
        {produtos.map((p) => {
          const Icon = iconMap[p.tipo] || Package;
          const colorKey = p.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'gray';
          const textColor = `text-${colorKey}-500`;

          return (
            <Box key={p.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow transition-all duration-200 border border-gray-100 group">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box className={`p-2 rounded-lg ${textColor} bg-opacity-10`}>
                    <Icon className="w-5 h-5" />
                  </Box>
                  <Box>
                    <h3 className="text-sm font-medium text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.email}</p>
                  </Box>
                </Box>
                <RiArrowRightUpLine className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', pt: 3 }}>
                <Box>
                  <p className="text-gray-500">Tipo</p>
                  <p className="font-medium flex items-center mt-0.5">
                    <Shield className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {p.tipo}
                  </p>
                </Box>
                <Box>
                  <p className="text-gray-500">Última reposição</p>
                  <p className="font-medium flex items-center mt-0.5">
                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {p.ultima}
                  </p>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* BOTÃO VER MAIS */}
      {hasMore && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => loadProdutos()}
            disabled={loadingMore}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Carregando...
              </>
            ) : (
              'Ver mais produtos'
            )}
          </button>
        </div>
      )}

      {/* BOTÃO + */}
      <button
        onClick={openModal}
        className="fixed top-4 right-36 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 duration-200 z-[999]"
        aria-label="Criar novo produto"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* SININHO + AVATAR */}
      <FloatingActions />

      {/* MODAL */}
      <CreateButton title="Criar Novo Produto" onSubmit={handleCreateProduto}>
        {({ formData, handleChange }) => (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input name="nome" value={formData.nome || ''} onChange={handleChange} placeholder="Saco de Lixo" className="w-full px-3 py-2 border rounded-lg" required />
            </div>
          </div>
        )}
      </CreateButton>
    </Box>
  );
}