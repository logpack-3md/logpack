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
import GlobalNotification from '@/components/ui/globalNotification';

export default function ManagerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.mostrarNotificacoesPendentes) {
        window.mostrarNotificacoesPendentes();
      }
    }, 1200);
  }, []);

  return (
    <>
      <GlobalNotification />
      <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
      
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div
          className={`
            flex-1 w-full flex flex-col transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
          `}
        >
          <FloatingActions />

          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menu"
              className={`
                lg:hidden fixed top-4 left-4 z-50 
                flex items-center justify-center p-2.5 
                rounded-md border border-border
                bg-card text-foreground shadow-sm 
                transition-colors hover:bg-accent hover:text-accent-foreground
                active:scale-95 outline-none ring-offset-background focus:ring-2 focus:ring-ring
              `}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <main className="pt-20 lg:pt-8 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto w-full">

            <header className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Olá, bem vindo!
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Visão geral do seu painel de controle.
              </p>
            </header>

            <section className="mb-8">
              <DataStats />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 shadow-sm rounded-xl overflow-hidden border border-border bg-card">
                <ChartCompose />
              </div>
              <div className="lg:col-span-1 shadow-sm rounded-xl overflow-hidden border border-border bg-card">
                <ChartBar />
              </div>
            </div>

            <div className="mb-8 shadow-sm rounded-xl overflow-hidden border border-border bg-card p-4">
              <AssetAllocationDonut />
            </div>

            <div className="space-y-12">
              <div className="bg-card rounded-xl border border-border shadow-sm p-1 sm:p-4">
                <InsumosSection />
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm p-1 sm:p-4">
                <EstoqueSection />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}