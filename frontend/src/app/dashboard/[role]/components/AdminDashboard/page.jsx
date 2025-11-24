"use client";
import { useState } from "react";
import { Menu } from "lucide-react"; // Ícone para abrir menu no mobile
import SidebarAdmin from "@/components/layout/sidebar-admin";
import { ListUsers } from "@/components/ListUsers/page";

export default function AdminDashboard() {
  // Estado controla a visibilidade APENAS no mobile.
  // No desktop, a sidebar é fixa via CSS (lg:translate-x-0 na sidebar).
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950">
      
      {/* 1. Overlay Escuro (Apenas Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Component */}
      <SidebarAdmin 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* 3. Conteúdo Principal */}
      {/* lg:ml-64 empurra o conteúdo para a direita no desktop para não ficar embaixo da sidebar */}
      <main className="flex flex-col min-h-screen transition-all duration-300 lg:ml-64">
        
        {/* Header Mobile (Só aparece em telas pequenas para abrir o menu) */}
        <header className="sticky top-0 z-30 flex items-center px-4 h-16 bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 mr-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">LogPack</span>
        </header>

        {/* Área do Conteúdo */}
        <div className="flex-1 p-4 md:p-8 space-y-6">
          
          {/* Título da Página (Opcional, mas recomendado) */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
              <p className="text-muted-foreground">Gerencie o acesso e permissões do sistema.</p>
            </div>
          </div>

          {/* Componente da Lista */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <ListUsers />
          </div>
          
        </div>
      </main>
    </div>
  );
}