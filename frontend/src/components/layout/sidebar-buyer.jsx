"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package, FileText, Settings, ChevronDown, ChevronUp, User, LogOut, LayoutDashboard
} from 'lucide-react';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu Definition
const menuItems = [
  { id: 'pedidos', label: 'Painel', icon: LayoutDashboard, href: '/dashboard/buyer' },
  { id: 'compras', label: 'Meus Pedidos', icon: Package, href: '/dashboard/buyer/pedidos' },
  { id: 'orcamentos', label: 'Orçamentos', icon: FileText, href: '/dashboard/buyer/orcamentos' },
  {
    id: 'conta',
    label: 'Minha Conta',
    icon: User,
    subItems: [
      { id: 'profile', label: 'Meu Perfil', icon: User, href: '/dashboard/buyer/profile' },
      { id: 'config', label: 'Configurações', icon: Settings, href: '/dashboard/buyer/configuracoes' },
      // O ID 'sair' será interceptado na renderização
      { id: 'sair', label: 'Sair', icon: LogOut, href: '/' },
    ],
  },
];

export function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSubmenuToggle = (id) => {
    setOpenSubmenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href);

  // --- LÓGICA DE LOGOUT ---
  const handleLogout = (e) => {
    // Previne a navegação padrão do Link (se houver)
    if (e) e.preventDefault();

    // 1. Mata o cookie do token definindo validade no passado
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    // 2. Limpa dados de sessão do navegador
    localStorage.clear();
    sessionStorage.clear();

    // 3. Redireciona forçando refresh para garantir limpeza de estado
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Logo */}
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link href="/dashboard/buyer" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">LogPack</span>
        </Link>
      </div>

      {/* Navegação */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(item.id)}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                      openSubmenus[item.id] && "bg-muted text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {openSubmenus[item.id] ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                  </button>
                  
                  {openSubmenus[item.id] && (
                    <div className="ml-4 mt-1 border-l pl-2 space-y-1">
                      {item.subItems.map((sub) => {
                        // VERIFICA SE É O BOTÃO DE SAIR
                        if (sub.id === 'sair') {
                          return (
                            <button
                              key={sub.id}
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10"
                            >
                              <sub.icon className="h-4 w-4" />
                              {sub.label}
                            </button>
                          );
                        }

                        // Renderização padrão para outros links
                        return (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            className={clsx(
                              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                              isActive(sub.href) ? "bg-muted text-primary font-semibold" : "text-muted-foreground"
                            )}
                          >
                            <sub.icon className="h-4 w-4" />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-muted",
                    isActive(item.href) ? "bg-muted text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Usuário */}
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">Comprador</span>
            <span className="text-xs text-muted-foreground truncate">LogPack Inc.</span>
          </div>
          
          {/* Botão de Sair do Footer */}
          <button 
            onClick={handleLogout}
            className="ml-auto text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-background"
            title="Sair do sistema"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper Desktop
export default function SidebarBuyer() {
  return (
    <div className="hidden border-r bg-background md:block fixed inset-y-0 left-0 w-[240px] lg:w-[260px] z-30">
      <SidebarContent />
    </div>
  );
}