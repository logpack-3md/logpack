// src/app/estoque/page.jsx
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { Search } from 'lucide-react';
import EstoqueSection from '@/components/Blocks/Estoque/EstoqueSection';
import { CreateButton } from '@/components/ui/create-button';

export default function EstoquePage() {
  const [search, setSearch] = useState('');

  const handleCreateArea = () => {
    alert('Nova área criada: Área 10 - Depósito Externo\nProduto: Bobina de Plástico\nCapacidade: 800 unidades');
    // Futuro: POST /api/estoque/areas
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-sm text-gray-600 mt-1">Monitoramento de todas as áreas</p>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Box sx={{ position: 'relative', maxWidth: '400px' }}>
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

      {/* BOTÃO + NOVA ÁREA */}
      <CreateButton title="Criar Nova Área">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateArea(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Área</label>
              <input
                type="text"
                defaultValue="Área 10 - Depósito Externo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
              <input
                type="text"
                defaultValue="Bobina de Plástico"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (unidades)</label>
              <input
                type="text"
                defaultValue="800"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                readOnly
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCreateArea()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Criar Área
              </button>
            </div>
          </div>
        </form>
      </CreateButton>
    </Box>
  );
}