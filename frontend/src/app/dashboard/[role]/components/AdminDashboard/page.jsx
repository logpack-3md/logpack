"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar-admin";
import { ListUsers } from "@/components/ListUsers/page";
import clsx from "clsx";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <SidebarAdmin isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)}/>

      <main className="flex flex-col min-h-screen transition-all duration-300 lg:ml-64">

        {/* Header Mobile */}
        <header className="sticky top-0 z-30 flex items-center px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Abrir menu"
            >
            
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg tracking-tight text-foreground">LogPack</span>
        </header>

        {/* Área do Conteúdo */}
        <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">

          {/* Cabeçalho da Página */}
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
            <ListUsers />
          </div>

        </div>
      </main>
    </div>
  );
}