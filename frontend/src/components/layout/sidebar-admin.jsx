"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Box,
  BarChart2,
  FileCheck2,
  Bell,
  User,
  LogOut,
  Wallet,
  PackageOpen
} from 'lucide-react';
import clsx from 'clsx';
import { LogoSite } from "@/components/ui/icons-geral";
import { SwitchTheme } from "@/components/SwitchThemes";

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  {
    id: 'perfil-usuario',
    label: 'Perfil do Usuário',
    icon: User,
    subItems: [
      { id: 'profile', label: 'Meu Perfil', icon: User, href: '/dashboard/admin/profile' },
      { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '/dashboard/configuracoes' },
      { id: 'sair', label: 'Sair', icon: LogOut, href: '/' },
    ],
  },
];

export default function SidebarAdmin({ isOpen, onToggle }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenuId]: !prev[submenuId],
    }));
  };

  const handleLogoClick = () => {
    setActiveMenu('dashboard');
  };

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col',
        'bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-md',
        'transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >

      <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border shrink-0">
        <Link href="/dashboard" onClick={handleLogoClick} className="flex items-center gap-3 group outline-none">

          <div className="transition-transform duration-300 group-hover:scale-105">
            <LogoSite />
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


      <nav className="flex-1 px-2 py-5 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subItems ? (
                <div className="space-y-1">

                  <button
                    onClick={() => handleSubmenuToggle(item.id)}
                    className={clsx(
                      'flex items-center justify-between w-full px-3 py-2 text-mg font-medium rounded-md transition-colors outline-none group',
                      activeMenu.startsWith(item.id) || Object.values(item.subItems).some(sub => sub.id === activeMenu)
                        ? 'text-sidebar-primary font-semibold'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >

                    <div className="flex items-center gap-2">
                      <item.icon size={18} className={clsx("shrink-0", activeMenu.startsWith(item.id) ? "text-sidebar-primary" : "")} />
                      <span>{item.label}</span>
                    </div>

                    <div className="text-muted-foreground/70 group-hover:text-foreground transition-colors">
                      {openSubmenus[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>

                  </button>

                  {/* Submenu Renderizado */}
                  {openSubmenus[item.id] && (
                    <div className="relative pl-4 ml-4 border-l border-sidebar-border/60">
                      <ul className="space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.href}
                              className={clsx(
                                'flex items-center px-3 py-2 text-md font-medium rounded-md transition-all outline-none group',
                                activeMenu === subItem.id
                                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm translate-x-1'
                                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                              )}
                              onClick={() => setActiveMenu(subItem.id)}
                            >
                              <subItem.icon size={16} className="mr-3 opacity-70 shrink-0" />
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 text-md font-medium rounded-md transition-all outline-none',
                    activeMenu === item.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <item.icon size={18} className={clsx("mr-3 shrink-0", activeMenu === item.id ? "text-sidebar-primary" : "")} />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
     <SwitchTheme /> 
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground text-center">
        © 2024 LogPack Inc.
      </div>

    </aside>
  );
}