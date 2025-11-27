"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/sidebar';
import DataStats from '@/components/ui/datastats';
import { Menu } from 'lucide-react';
import { FloatingActions } from '@/components/ui/floating-actions';
import ChartCompose from '@/components/Blocks/Graphics/ChartCompose';
import ChartBar from '@/components/Blocks/Graphics/ChartBar';
import InsumosSection from "@/components/Blocks/Insumos/InsumosSection";
import EstoqueSection from '@/components/Blocks/Estoque/SetoresSection';
import AssetAllocationDonut from '@/components/Blocks/Graphics/DonutChart'; 
import GlobalNotification from '@/components/ui/globalNotification'; // ATIVA O SISTEMA

export default function ManagerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ASSIM QUE ENTRA NO DASHBOARD DO GERENTE → MOSTRA NOTIFICAÇÕES PENDENTES
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.mostrarNotificacoesPendentes) {
        window.mostrarNotificacoesPendentes();
      }
    }, 1200); // delay pra garantir que a página carregou
  }, []);

  return (
    <>
      <GlobalNotification />

      <div className="flex h-screen bg-gray-50">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
          <FloatingActions />

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div className="pt-4 lg:pt-2">
            <div className="px-6 lg:px-8 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Olá, bem vindo!</h1>
            </div>

            <div className="px-6 lg:px-8 mb-8">
              <DataStats />
            </div>

            <div className="px-6 lg:px-8 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChartCompose />
                </div>
                <div className="lg:col-span-1">
                  <ChartBar />
                </div>
              </div>
            </div>

            <div className="px-6 lg:px-8 mb-8">
              <AssetAllocationDonut />
            </div>

            <div className="px-6 lg:px-8 mb-12">
              <InsumosSection />
            </div>

            <div className="px-6 lg:px-8">
              <EstoqueSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}