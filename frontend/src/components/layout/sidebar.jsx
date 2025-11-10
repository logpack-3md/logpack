"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Box,
  CircleDollarSign,
  BarChart2,
  FileCheck2,
  Bell,
  User,
  LogOut,
  Wallet,
  PackageOpen   
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  {
    id: 'painel-geral',
    label: 'Painel Geral',
    icon: BarChart2,
    subItems: [
      { id: 'estoque', label: 'Produtos', icon: Box, href: '/dashboard/produtos' },
      { id: 'estoque', label: 'Estoque', icon: PackageOpen, href: '/dashboard/estoque' },
      { id: 'relatorios', label: 'Relatórios', icon: FileCheck2, href: '/dashboard/relatorios' },
    ],
  },
  {
    id: 'operacoes',
    label: 'Operações',
    icon: Wallet,
    subItems: [
      { id: 'pedidos', label: 'Pedidos', icon: Package, href: '/dashboard/pedidos' },
      { id: 'orcamentos', label: 'Orçamentos', icon: FileText, href: '/dashboard/orcamentos' },
      { id: 'notificacoes', label: 'Notificações', icon: Bell, href: '/dashboard/notificacoes' },
    ],
  },
  {
    id: 'perfil-usuario',
    label: 'Perfil do Usuário',
    icon: User,
    subItems: [
      { id: 'meu-perfil', label: 'Meu Perfil', icon: User, href: '/dashboard/meu-perfil' },
      { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '/dashboard/configuracoes' },
      { id: 'sair', label: 'Sair', icon: LogOut, href: '/' },
    ],
  },
];

export default function Sidebar({ isOpen, onToggle }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenuId]: !prev[submenuId],
    }));
  };

  return (
    <div
      className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">MStore</h1>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => handleSubmenuToggle(item.id)}
                    className={clsx(
                      'flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                      activeMenu.startsWith(item.id)
                        ? 'text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon size={19} className="mr-3" />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen && (openSubmenus[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </button>
                  {openSubmenus[item.id] && isOpen && (
                    <ul className="pl-6 pt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className={clsx(
                              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all',
                              activeMenu === subItem.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                            onClick={() => setActiveMenu(subItem.id)}
                          >
                            <subItem.icon size={18} className="mr-3" />
                            <span>{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                    activeMenu === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <item.icon size={19} className="mr-3" />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}