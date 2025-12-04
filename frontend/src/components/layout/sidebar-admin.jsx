"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ShieldAlert,
  ClipboardClock,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoSite } from "@/components/ui/icons-geral"; // Certifique-se que existe ou remova
import { SwitchTheme } from "@/components/SwitchThemes"; // Certifique-se que existe
import { api } from "@/lib/api";

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { 
    id: 'log', 
    label: 'Audotoria', 
    icon: ShieldAlert, 
    subItems: [
      { id: 'Histocrico', label: 'Historico', icon: ClipboardClock, href: '/dashboard/admin/logAdmin' },
    ],
  },
  { id: 'meu-perfil', label: 'Meu Perfil', icon: User, href: '/dashboard/admin/profile' },
];

export default function SidebarAdmin({ isOpen, onToggle }) {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Administrador', image: null });
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('users/profile');
        if (res) {
          setUser({
            name: res.name || res.user?.name || 'Administrador',
            image: res.image || res.user?.image || null
          });
        }
      } catch (error) {
        console.error("Erro ao carregar usuário na sidebar:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);


  const handleLogout = (e) => {
    e.preventDefault();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const isLinkActive = (href) => pathname === href;

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";
  };

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-50 w-full lg:w-64 h-full flex flex-col',
        'bg-background text-foreground border-r border-border shadow-xl lg:shadow-none',
        'transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border shrink-0">
        <Link href="/dashboard/admin" className="flex items-center gap-3 group outline-none">
          <div className="text-primary transition-transform duration-300 group-hover:scale-110">
            {LogoSite ? <LogoSite className="h-8 w-8" /> : <LayoutDashboard className="h-8 w-8" />}
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            LogPack
          </span>
        </Link>

        <button
          onClick={onToggle}
          className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Fechar menu"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* --- NAVEGAÇÃO --- */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={clsx(
              'flex items-center px-3 py-2.5 text-md font-medium rounded-md transition-all outline-none mb-1',
              isLinkActive(item.href)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon size={18} className={clsx("mr-3 shrink-0", isLinkActive(item.href) ? "text-primary" : "")} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-border bg-muted/30">

        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Tema</span>
            <SwitchTheme />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-md transition-colors"
            title="Sair do Sistema"
          >
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>

        {/* CARD DO USUÁRIO */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-background border border-border shadow-sm">

          {/* AVATAR COM FALLBACK */}
          <Avatar className="h-10 w-10 border border-border">
            {loadingUser ? (
              <AvatarFallback className="bg-muted"><Loader2 className="h-4 w-4 animate-spin" /></AvatarFallback>
            ) : (
              <>
                <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-foreground truncate" title={user.name}>
              {user.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
              Administrador
            </span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-center text-muted-foreground/60">
          © 2025 LogPack Inc.
        </div>
      </div>

    </aside>
  );
}