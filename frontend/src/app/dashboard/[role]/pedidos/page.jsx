'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { RiTruckLine } from '@remixicon/react';
import PedidosSection from '@/components/Blocks/Pedidos/PedidosSection';
import CreateButton from '@/components/ui/create-button';
import { FloatingActions } from '@/components/ui/floating-actions';
import Sidebar from '@/components/layout/sidebar';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function PedidosManagerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCreatePedido = async (data) => {
    try {
      // ROTA CORRETA DO FUNCIONÁRIO/COMPRADOR
      const resposta = await api.post('employee/request', { insumoSKU: data.sku });
  
      // AQUI VOCÊ VÊ TUDO QUE A API RETORNOU
      console.log('Resposta completa da API:', resposta);
  
      // Exemplos do que pode vir no retorno:
      // { success: true, pedidoId: "123", message: "Pedido criado com sucesso" }
      // { pedido: { id: "123", insumoSKU: "INS-001", status: "solicitado" } }
  
      // Se quiser mostrar algo específico na tela:
      if (resposta?.message) {
        toast.success(resposta.message);
      } else if (resposta?.pedido?.id) {
        toast.success(`Pedido #${resposta.pedido.id} criado com sucesso!`);
      } else {
        toast.success('Solicitação enviada com sucesso!');
      }
  
      return true;
    } catch (err) {
      // AQUI VOCÊ VÊ O ERRO EXATO QUE A API DEU
      console.error('Erro completo da API:', err);
      console.error('Mensagem do erro:', err.message);
  
      // Mostra a mensagem real do back-end (se tiver)
      toast.error(err.message || 'Erro ao enviar solicitação');
      return false;
    }
  };

  const openModal = () => {
    document.dispatchEvent(new CustomEvent('open-create-modal'));
  };

  if (isSidebarOpen === null) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Box sx={{ flexGrow: 1 }}>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 3, lg: 4 } }}>
          <Box sx={{ mb: 6 }}>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <RiTruckLine className="w-7 h-7" />
              </span>
              Gestão de Pedidos
            </h1>
            <p className="text-gray-600 mt-2">Aprove ou conteste solicitações de insumos</p>
          </Box>

          <Box sx={{ mb: 6, maxWidth: '500px' }}>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>
          </Box>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl blur-3xl opacity-60 -z-10" />
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <PedidosSection />
            </div>
          </div>

          <button
            onClick={openModal}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-110 duration-200 z-50 border-4 border-white flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </button>

          <FloatingActions />

          <CreateButton title="Nova Solicitação de Insumo" onSubmit={handleCreatePedido}>
            {({ formData, handleChange }) => (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SKU do Insumo *
                  </label>
                  <input
                    name="sku"
                    value={formData.sku || ''}
                    onChange={handleChange}
                    placeholder="Ex: INS-2025-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>
            )}
          </CreateButton>
        </Box>
      </Box>
    </Box>
  );
}