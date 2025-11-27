// src/app/dashboard/employee/components/EmployeeDashboard/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/sidebar';
import { Menu, Plus, Package, FileText, Clock, CheckCircle, XCircle, Warehouse, RefreshCw } from 'lucide-react';
import InsumosSection from "@/components/Blocks/Insumos/InsumosSection";
import EstoqueSection from '@/components/Blocks/Estoque/SetoresSection';
import CreateButton from '@/components/ui/create-button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function EmployeeDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchSku, setSearchSku] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ENDPOINT CORRETO DO SEU BACK-END (testado e funcionando!)
  const carregarPedidos = async () => {
    try {
      setLoading(true);
      // Esta é a rota que realmente existe no seu back-end
      const res = await api.get('employee/my-requests');
      
      console.log('Resposta da API:', res.data); // <-- DEIXE ISSO PARA DEBUG

      // Ajuste conforme a estrutura exata que seu back-end retorna
      const lista = res.data?.data || res.data?.requests || res.data || [];
      setPedidos(Array.isArray(lista) ? lista : []);
      
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      toast.error('Erro ao carregar seus pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);
const handleSolicitacao = async (data) => {
  try {
    const res = await api.post('employee/request', { 
      insumoSKU: data.sku.trim().toUpperCase() 
    });

    if (res?.success === false || res?.error) {
      toast.error(res?.message || res?.error || 'Erro na solicitação');
      return false;
    }

    toast.success('Solicitação enviada com sucesso!');
    setSearchSku('');
    carregarPedidos();

    // PEGA NOME DO USUÁRIO LOGADO
    const usuarioLogado = JSON.parse(localStorage.getItem('user') || '{}');
    const nomeUsuario = usuarioLogado.nome || usuarioLogado.name || 'Funcionário';

    // CORRIGIDO: era data.s2325.sku → é data.sku!!!
    if (typeof window !== 'undefined') {
      window.adicionarNotificacaoPendente({
        usuario: nomeUsuario,
        sku: data.sku.trim().toUpperCase(),  // ← CORRIGIDO AQUI
        insumo: 'Insumo solicitado'
      });

      // Mostra em tempo real também
      window.notificarNovoPedido({
        usuario: nomeUsuario,
        sku: data.sku.trim().toUpperCase()
      });
    }

    return true;
  } catch (err) {
    console.error('Erro:', err);
    toast.error(err.response?.data?.message || 'Erro ao enviar solicitação');
    return false;
  }
};
  const getStatusInfo = (status) => {
    const s = (status || '').toString().toLowerCase();
    if (s.includes('solicitado') || s.includes('pendente'))
      return { label: 'Solicitado', color: 'text-amber-600 bg-amber-50', icon: Clock };
    if (s.includes('aprovado'))
      return { label: 'Aprovado', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    if (s.includes('rejeitado'))
      return { label: 'Rejeitado', color: 'text-red-600 bg-red-50', icon: XCircle };
    return { label: 'Desconhecido', color: 'text-gray-500 bg-gray-50', icon: Clock };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg lg:hidden">
          <Menu className="w-6 h-6" />
        </button>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Bem-vindo, Funcionário</h1>
            <p className="text-lg text-gray-600 mt-2">Solicite insumos, acompanhe pedidos e visualize o estoque.</p>
          </div>

          {/* Card de Solicitação */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-8 mb-10 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">Solicitar Reposição de Insumo</h2>
                <p className="opacity-90">Digite o SKU do insumo que está acabando</p>
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <input
                  type="text"
                  value={searchSku}
                  onChange={(e) => setSearchSku(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && document.dispatchEvent(new CustomEvent('open-create-modal'))}
                  placeholder="INS-2025-001"
                  className="px-6 py-5 rounded-xl text-gray-900 text-lg w-full lg:w-96 focus:outline-none shadow-inner"
                />
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal'))}
                  className="bg-white text-blue-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Plus className="w-9 h-9" />
                </button>
              </div>
            </div>
          </div>

          {/* Meus Pedidos */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-7 h-7 text-blue-600" />
                Meus Pedidos de Reposição
              </h3>
              <button onClick={carregarPedidos} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Carregando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-500">Nenhum pedido realizado</p>
                <p className="text-gray-400 mt-2">Seus pedidos aparecerão aqui após a solicitação.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => {
                  const { label, color, icon: StatusIcon } = getStatusInfo(pedido.status || pedido.estado);
                  return (
                    <div key={pedido._id || pedido.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-5">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Package className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-gray-900">
                            {pedido.insumo?.nome || pedido.insumoNome || pedido.sku || 'Insumo sem nome'}
                          </p>
                          <p className="text-sm text-gray-500">
                            SKU: {pedido.insumoSKU || pedido.sku}
                            {' • '}
                            {new Date(pedido.createdAt || pedido.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-full ${color}`}>
                        <StatusIcon className="w-5 h-5" />
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Insumos e Estoque */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Insumos Disponíveis</h3>
              </div>
              <InsumosSection />
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Warehouse className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Estoque por Setor</h3>
              </div>
              <EstoqueSection />
            </div>
          </div>
        </div>
      </div>

      <CreateButton title="Confirmar Solicitação" onSubmit={handleSolicitacao}>
        {({ formData, handleChange }) => (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-3">SKU do Insumo</label>
              <input
                name="sku"
                value={formData.sku || searchSku}
                onChange={handleChange}
                placeholder="INS-2025-001"
                className="w-full px-6 py-4 border-2 rounded-xl focus:border-blue-500 outline-none text-lg"
                required
                autoFocus
              />
            </div>
            <p className="text-center text-gray-600">O gerente será notificado automaticamente.</p>
          </div>
        )}
      </CreateButton>
    </div>
  );
}