// src/app/pedidos/page.jsx
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { RiTruckLine } from '@remixicon/react'; // ← IMPORT FALTANDO
import PedidosSection from '@/components/Blocks/Pedidos/PedidosSection';
import { CreateButton } from '@/components/ui/create-button';
import { FloatingActions } from '@/components/ui/floating-actions';
import Sidebar from '@/components/layout/sidebar';

export default function PedidosPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePedido = (data) => {
    setLoading(true);
    console.log('Criando pedido:', data);
    setTimeout(() => {
      alert(`Pedido criado!\nItem: ${data.item}\nCliente: ${data.cliente}`);
      setLoading(false);
    }, 1000);
  };

  const openModal = () => {
    document.dispatchEvent(new CustomEvent('open-create-modal'));
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, lg: 3 } }}>

  {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Cabeçalho */}
      <Box sx={{ mb: 6 }}>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <RiTruckLine className="w-6 h-6" />
          </span>
          Pedidos
        </h1>
        <p className="text-sm text-gray-600 mt-1">Acompanhe todos os pedidos em tempo real</p>
      </Box>

      {/* Barra de busca */}
      <Box sx={{ mb: 6, maxWidth: '500px' }}>
        <Box sx={{ position: 'relative' }}>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por item, cliente ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </Box>
      </Box>

      {/* PedidosSection com fundo criativo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl blur-3xl opacity-70 -z-10"></div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-1">
          <PedidosSection />
        </div>
      </div>

      {/* BOTÃO + */}
      <button
        onClick={openModal}
        className="fixed top-4 right-36 p-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 duration-200 z-[999] flex items-center justify-center"
        aria-label="Criar novo pedido"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* SININHO + AVATAR */}
      <FloatingActions />

      {/* MODAL DE CRIAÇÃO */}
      <CreateButton title="Criar Novo Pedido" onSubmit={handleCreatePedido} isLoading={loading}>
        {({ formData, handleChange }) => (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item</label>
              <input
                name="item"
                value={formData.item || ''}
                onChange={handleChange}
                placeholder="Ex: Impressora Laser Pro"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cliente</label>
              <input
                name="cliente"
                value={formData.cliente || ''}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Empresa</label>
              <input
                name="empresa"
                value={formData.empresa || ''}
                onChange={handleChange}
                placeholder="Ex: Tech Solutions Ltda"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade || ''}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>
        )}
      </CreateButton>
    </Box>
  );
}