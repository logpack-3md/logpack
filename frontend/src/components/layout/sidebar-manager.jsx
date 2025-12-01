"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import clsx from 'clsx';
import { LogoSite } from "@/components/ui/icons-geral"; // Certifique-se que este componente existe ou troque por um SVG

// Menu simplificado para o Funcionário
const menuItems = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard, href: '/dashboard/employee' },
  {
    id: 'perfil-usuario',
    label: 'Minha Conta',
    icon: User,
    subItems: [
      { id: 'meu-perfil', label: 'Meu Perfil', icon: User, href: '/dashboard/employee/profile' },
      // { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '/dashboard/employee/settings' }, // Opcional
      { id: 'sair', label: 'Sair', icon: LogOut, href: '/' },
    ],
  },
];

export default function SidebarEmployee({ isOpen, onToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState({ 'perfil-usuario': true }); // Mantém menu de perfil aberto por padrão se quiser

  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenuId]: !prev[submenuId],
    }));
  };

  // Lógica de Logout (Cópia da lógica robusta que criamos antes)
  const handleLogout = (e) => {
    e.preventDefault();
    
    // 1. Limpa cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    // 2. Limpa storage
    localStorage.clear();
    sessionStorage.clear();

    // 3. Redireciona
    window.location.href = '/';
  };

  // Helper para verificar rota ativa
  const isLinkActive = (href) => pathname === href;

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col',
        'bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-md', // Classes do seu tema
        'transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Header da Sidebar */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border shrink-0">
        <Link 
          href="/dashboard/employee" 
          onClick={() => setActiveMenu('dashboard')}
          className="flex items-center gap-3 group outline-none"
        >
          <div className="transition-transform duration-300 group-hover:scale-105 text-primary">
            {/* Fallback caso LogoSite não carregue */}
            {LogoSite ? <LogoSite /> : <LayoutDashboard className="h-6 w-6" />}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground group-hover:text-primary transition-colors">
            LogPack
          </h1>
        </Link>

        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors lg:hidden"
          aria-label="Fechar menu"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subItems ? (
                <div className="space-y-1">
                  {/* Botão do Submenu (Pai) */}
                  <button
                    onClick={() => handleSubmenuToggle(item.id)}
                    className={clsx(
                      'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors outline-none group',
                      activeMenu.startsWith(item.id) 
                        ? 'text-sidebar-primary font-semibold' 
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={clsx("shrink-0", activeMenu.startsWith(item.id) ? "text-sidebar-primary" : "")} />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-muted-foreground/70 group-hover:text-foreground transition-colors">
                      {openSubmenus[item.id] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </div>
                  </button>

                  {/* Itens do Submenu */}
                  {openSubmenus[item.id] && (
                    <div className="relative pl-4 ml-4 border-l border-sidebar-border/60">
                      <ul className="space-y-1">
                        {item.subItems.map((subItem) => {
                          const isActive = isLinkActive(subItem.href);
                          
                          // Renderização especial para o botão SAIR
                          if (subItem.id === 'sair') {
                            return (
                              <li key={subItem.id}>
                                <button
                                  onClick={handleLogout}
                                  className={clsx(
                                    'flex w-full items-center px-3 py-2 text-sm font-medium rounded-md transition-all outline-none',
                                    'text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:translate-x-1'
                                  )}
                                >
                                  <subItem.icon size={16} className="mr-3 opacity-70 shrink-0" />
                                  <span>{subItem.label}</span>
                                </button>
                              </li>
                            );
                          }

                          // Renderização padrão de links
                          return (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.href}
                                className={clsx(
                                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all outline-none',
                                  isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm translate-x-1 font-semibold'
                                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                                )}
                                onClick={() => setActiveMenu(item.id)}
                              >
                                <subItem.icon size={16} className="mr-3 opacity-70 shrink-0" />
                                <span>{subItem.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                // Item sem submenu (Link Direto)
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all outline-none',
                    isLinkActive(item.href)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold' 
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <item.icon size={18} className={clsx("mr-3 shrink-0", isLinkActive(item.href) ? "text-sidebar-primary" : "")} />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer da Sidebar (Informação do Usuário) */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/10">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
              EP
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate text-sidebar-foreground">Colaborador</span>
              <span className="text-xs text-muted-foreground truncate">Funcionário</span>
            </div>
        </div>
      </div>
    </aside>
  );
}