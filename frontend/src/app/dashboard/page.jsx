// src/app/dashboard/page.jsx
"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import DataStats from '@/components/ui/datastats';
import { Menu } from 'lucide-react';
import { FloatingActions } from '@/components/ui/floating-actions';
import ChartCompose from '@/components/Blocks/Graphics/ChartCompose';
import ItensSection from "@/components/Blocks/Itens/ItensSection";
import ChartBar from '@/components/Blocks/Graphics/ChartBar';
import EstoqueSection from '@/components/Blocks/Estoque/EstoqueSection'; // ← ADICIONADO

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content - Só uma rolagem */}
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
            <h1 className="text-2xl font-bold text-gray-900">Olá, bem vindo a LogPack</h1>
          </div>

          {/* DataStats: 100% largura */}
          <div className="px-6 lg:px-0 lg:pl-6 lg:pr-6 mb-8">
            <DataStats />
          </div>

          {/* ChartCompose + ChartBar (lado a lado, mesma altura) */}
          <div className="px-6 lg:px-0 lg:pl-6 lg:pr-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ChartCompose: 2/3 */}
              <div className="lg:col-span-2">
                <ChartCompose />
              </div>

              {/* ChartBar: 1/3, mesma altura */}
              <div className="lg:col-span-1">
                <ChartBar />
              </div>
            </div>
          </div>

          {/* ItensSection: 100% largura */}
          <div className="mt-8 px-6 lg:px-0 lg:pl-6 lg:pr-6">
            <ItensSection />
          </div>

          {/* NOVA SEÇÃO: ESTOQUE POR ÁREA */}
          <div className="mt-12 px-6 lg:px-0 lg:pl-6 lg:pr-6">
            <EstoqueSection />
          </div>
        </div>
      </div>
    </div>
  );
}