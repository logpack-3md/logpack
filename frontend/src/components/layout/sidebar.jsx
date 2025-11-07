"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Package, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'user', label: 'User', icon: Users, href: '/user' },
  { id: 'product', label: 'Product', icon: Package, href: '/product' },
  { id: 'blog', label: 'Blog', icon: FileText, href: '/blog' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

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
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}