// src/app/dashboard/page.jsx
"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import DataStats from '@/components/ui/datastats';
import { Menu } from 'lucide-react';
import { FloatingActions } from '@/components/ui/floating-actions';
import ChartCompose from '@/components/Blocks/Graphics/ChartCompose';
import ChartBar from '@/components/Blocks/Graphics/ChartBar';
import InsumosSection from "@/components/Blocks/Insumos/InsumosSection";
import EstoqueSection from '@/components/Blocks/Estoque/EstoqueSection';
import AssetAllocationDonut from '@/components/Blocks/Graphics/DonutChart'; 

export default function ManagerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white-500">
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1">
        <FloatingActions />

        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Conteúdo principal */}
        <div className="pt-4 lg:pt-2">
          {/* Cabeçalho */}
          <div className="px-6 lg:px-0 lg:pl-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Olá, bem vindo!</h1>
          </div>

          {/* DataStats */}
          <div className="px-6 lg:px-0 lg:pl-6 lg:pr-6 mb-8">
            <DataStats />
          </div>

          {/* Gráficos: ChartCompose + ChartBar */}
          <div className="px-6 lg:px-0 lg:pl-6 lg:pr-6"> {/* Reduzido de mb-8 para mb-4 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartCompose />
              </div>
              <div className="lg:col-span-1">
                <ChartBar />
              </div>
            </div>
          </div>

          {/* DONUT CHART: ENTRE GRÁFICOS E ITENS */}
          <div className="mb-8"> {/* Reduzido de mb-8 para mb-4 */}
            <AssetAllocationDonut />
          </div>

          {/* InsumosSection */}
          <div className="px-6 lg:px-0 lg:pl-6 lg:pr-6 mb-12">
            <InsumosSection />
          </div>

          {/* Estoque por Área */}
          <div className="px-6 lg:px-0 lg:pl-6 lg:pr-6">
            <EstoqueSection />
          </div>
        </div>
      </div>
    </div>
  );
}