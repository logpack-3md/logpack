// src/app/estoque/page.jsx
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { Search, Plus } from 'lucide-react';
import EstoqueSection from '@/components/Blocks/Estoque/EstoqueSection';
import { CreateButton } from '@/components/ui/create-button';
import { FloatingActions } from '@/components/ui/floating-actions';

export default function EstoquePage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateArea = async (data) => {
    setLoading(true);
    console.log('Criando área:', data);
    setTimeout(() => {
      alert(`Área criada!\nNome: ${data.nome}\nProduto: ${data.produto}\nCapacidade: ${data.capacidade}`);
      setLoading(false);
    }, 1000);
  };

  const openModal = () => {
    document.dispatchEvent(new CustomEvent('open-create-modal'));
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-sm text-gray-600 mt-1">Monitoramento de todas as áreas</p>
      </Box>

      <Box sx={{ mb: 6, maxWidth: '400px' }}>
        <Box sx={{ position: 'relative' }}>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar área ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </Box>
      </Box>

      <EstoqueSection />

      {/* BOTÃO + (APENAS NESSA PÁGINA) */}
      <button
        onClick={openModal}
        className="fixed top-4 right-36 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 duration-200 z-[999]"
        aria-label="Criar nova área"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* SININHO + AVATAR (COMPONENTE ORIGINAL) */}
      <FloatingActions />

      {/* MODAL DE CRIAÇÃO */}
      <CreateButton
        title="Criar Nova Área"
        onSubmit={handleCreateArea}
        isLoading={loading}
      >
        {({ formData, handleChange }) => (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Área</label>
              <input
                type="text"
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                placeholder="Ex: Área 10 - Depósito Externo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
              <input
                type="text"
                name="produto"
                value={formData.produto || ''}
                onChange={handleChange}
                placeholder="Ex: Bobina de Plástico"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (unidades)</label>
              <input
                type="number"
                name="capacidade"
                value={formData.capacidade || ''}
                onChange={handleChange}
                placeholder="800"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}
      </CreateButton>
    </Box>
  );
}