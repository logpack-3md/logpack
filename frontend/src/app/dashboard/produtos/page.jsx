// src/app/produtos/page.jsx
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { Search, Package, Droplets, Box as BoxIcon, FileText, Shield, Clock } from 'lucide-react';
import { RiArrowRightUpLine } from '@remixicon/react';
import { CreateButton } from '@/components/ui/create-button';

const produtos = [/* seus 12 itens existentes */];

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

  const filtered = produtos.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === 'todos' || p.tipo === filtro;
    return matchSearch && matchFiltro;
  });

  const handleCreateProduto = () => {
    alert('Novo produto criado:\nNome: Saco de Lixo 100L\nTipo: Embalagem\nEstoque: 500 unidades');
    // Futuro: POST /api/produtos
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <p className="text-sm text-gray-600 mt-1">Gerencie todos os insumos e embalagens</p>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </Box>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="todos">Todos os tipos</option>
          <option value="insumo">Insumo</option>
          <option value="embalagem">Embalagem</option>
          <option value="acessório">Acessório</option>
          <option value="suporte">Suporte</option>
          <option value="proteção">Proteção</option>
        </select>
      </Box>

      {/* Grid de produtos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
        {filtered.map((p, i) => {
          const Icon = iconMap[p.tipo] || Package;
          const colorKey = p.bgColor.match(/bg-([a-z]+)-100/)?.[1];
          const textColor = `text-${colorKey}-500`;

          return (
            <Box key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow transition-all duration-200 border border-gray-100 group">
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box className={`p-2 rounded-lg ${textColor} bg-opacity-10`}>
                    <Icon className="w-5 h-5" />
                  </Box>
                  <Box>
                    <h3 className="text-sm font-medium text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.email}</p>
                  </Box>
                </Box>
                <RiArrowRightUpLine className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', pt: 3 }}>
                <Box>
                  <p className="text-gray-500">Tipo</p>
                  <p className="font-medium text-gray-900 flex items-center mt-0.5">
                    <Shield className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {p.tipo}
                  </p>
                </Box>
                <Box>
                  <p className="text-gray-500">Última reposição</p>
                  <p className="font-medium text-gray-900 flex items-center mt-0.5">
                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {p.ultima}
                  </p>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* BOTÃO + NOVO PRODUTO */}
      <CreateButton title="Criar Novo Produto">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateProduto(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input
                type="text"
                defaultValue="Saco de Lixo 100L"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="embalagem" disabled>
                <option value="insumo">Insumo</option>
                <option value="embalagem">Embalagem</option>
                <option value="acessório">Acessório</option>
                <option value="suporte">Suporte</option>
                <option value="proteção">Proteção</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
              <input
                type="text"
                defaultValue="500 unidades"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                readOnly
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCreateProduto()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Criar Produto
              </button>
            </div>
          </div>
        </form>
      </CreateButton>
    </Box>
  );
}