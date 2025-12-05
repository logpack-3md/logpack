"use client";
import { useState } from "react";
import { Menu, LayoutDashboard, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { Toaster } from "sonner"; 

import SidebarAdmin from "@/components/layout/sidebar-admin";
import { ListUsers } from "@/components/ListUsers";
import { Button } from "@/components/ui/button";

// IMPORTANTE: Trazemos o Hook para cá
import { useUsers } from '@/hooks/useUsers';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- LOGICA MOVIDA PARA CIMA ---
  // O hook é instanciado aqui para termos acesso ao 'refresh'
  // e passarmos os dados como props para a tabela.
  const usersHook = useUsers(); 
  const { loading, refresh } = usersHook; 

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Toaster position="top-right" richColors closeButton />

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <SidebarAdmin isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex flex-col min-h-screen transition-all duration-300 lg:ml-64">

        {/* HEADER ALTERADO APENAS PARA INCLUIR O BOTÃO */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
                aria-label="Abrir menu"
            >
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 font-semibold text-lg">
                <LayoutDashboard className="h-5 w-5 text-primary" /> Visão Geral
            </div>
          </div>

          {/* NOVO BOTÃO DE REFRESH */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh} 
            disabled={loading} 
            className="gap-2 h-9 px-3 shadow-sm bg-background text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={clsx("h-3.5 w-3.5", loading && "animate-spin")} />
            <span className="hidden sm:inline text-xs">Atualizar</span>
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Usuários
              </h2>
              <p className="text-sm text-muted-foreground">
                Gerencie o acesso, funções e status dos usuários do sistema.
              </p>
            </div>
          </div>

          <div className="w-full">
            {/* Componente Tabela recebendo tudo via Props */}
            <ListUsers {...usersHook} />
          </div>

        </div>
      </main>
    </div>
  );
}