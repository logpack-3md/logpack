"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Use o Link real do Next.js
import { usePathname } from 'next/navigation'; // Hook essencial para saber onde estamos
import {
  Package, FileText, Settings, ChevronLeft, ChevronDown, ChevronUp, User, LogOut
} from 'lucide-react';
import clsx from 'clsx';

// LogoSite Component (mantive como estava)
const LogoSite = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const menuItems = [
  { id: 'pedidos', label: 'Meus Pedidos', icon: Package, href: '/dashboard/buyer/pedidos' },
  { id: 'orcamentos', label: 'Orçamentos', icon: FileText, href: '/dashboard/buyer/orcamentos' },
  {
    id: 'perfil-usuario',
    label: 'Minha Conta',
    icon: User,
    subItems: [
      { id: 'profile', label: 'Meu Perfil', icon: User, href: '/dashboard/buyer/profile' },
      { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '/dashboard/buyer/configuracoes' },
      { id: 'sair', label: 'Sair', icon: LogOut, href: '/' },
    ],
  },
];

export default function SidebarBuyer({ isOpen = true, onToggle = () => {} }) {
  const pathname = usePathname(); // Obtém a URL atual
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus((prev) => ({ ...prev, [submenuId]: !prev[submenuId] }));
  };

  // Função para verificar se o item está ativo baseado na URL
  const isActive = (href) => pathname === href || pathname.startsWith(href);

  return (
    <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col',
        'bg-white text-slate-900 border-r border-slate-200 shadow-md',
        'transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
      
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 shrink-0">
        <Link href="/dashboard/buyer" className="flex items-center gap-3 group outline-none">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <LogoSite />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">LogPack</h1>
        </Link>
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-slate-100 lg:hidden">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-5 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subItems ? (
                <div className="space-y-1 mt-4 border-t border-slate-200 pt-4">
                  <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Área do Cliente
                  </div>
                  <button
                    onClick={() => handleSubmenuToggle(item.id)}
                    className={clsx(
                      'flex items-center justify-between w-full px-3 py-2 text-md font-medium rounded-md transition-colors outline-none group',
                      'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-600">
                      {openSubmenus[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {/* Submenu */}
                  {openSubmenus[item.id] && (
                    <div className="relative pl-4 ml-4 border-l border-slate-200">
                      <ul className="space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.href}
                              className={clsx(
                                'flex items-center px-3 py-2 text-md font-medium rounded-md transition-all',
                                isActive(subItem.href)
                                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm translate-x-1'
                                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1'
                              )}
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
                    'flex items-center px-3 py-2 text-md font-medium rounded-md transition-all',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <item.icon size={18} className={clsx("mr-3 shrink-0", isActive(item.href) ? "text-blue-600" : "")} />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}