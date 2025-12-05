"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ClipboardClock,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoSite } from "@/components/ui/icons-geral";
import { SwitchTheme } from "@/components/SwitchThemes";
import { api } from "@/lib/api";

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/employee' },
  { 
    id: 'auditoria', 
    label: 'Auditoria', 
    icon: ShieldAlert, 
    subItems: [
      { id: 'historico', label: 'Histórico', icon: ClipboardClock, href: '/dashboard/employee/logEmployee' },
    ],
  },
  { id: 'meu-perfil', label: 'Meu Perfil', icon: User, href: '/dashboard/employee/profile' },
];

export default function SidebarEmployee({ isOpen, onToggle }) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [user, setUser] = useState({ name: 'Employee', image: null });
  const [loadingUser, setLoadingUser] = useState(true);

  // Função para alternar submenus (igual ao Admin)
  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenuId]: !prev[submenuId],
    }));
  };

  const handleLinkClick = () => {
    if (onToggle && window.innerWidth < 1024) {
      onToggle();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('users/profile');
        if (res) {
            setUser({
                name: res.name || res.user?.name || 'Employee',
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
        .slice(0, 2) || "EM";
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
        <Link href="/dashboard/employee" onClick={handleLinkClick} className="flex items-center gap-3 group outline-none">
          <div className="text-primary transition-transform duration-300 group-hover:scale-110">
            {LogoSite ? <LogoSite className="h-8 w-8" /> : <LayoutDashboard className="h-8 w-8"/>}
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
          <div key={item.id}>
            {item.subItems ? (
              <div className="space-y-1 mb-1">
                <button
                  onClick={() => handleSubmenuToggle(item.id)}
                  className={clsx(
                    'flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors outline-none group',
                    item.subItems.some(sub => isLinkActive(sub.href))
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-muted-foreground/50 group-hover:text-foreground transition-colors">
                    {openSubmenus[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {openSubmenus[item.id] && (
                  <div className="relative pl-4 ml-4 border-l border-border space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        onClick={handleLinkClick}
                        className={clsx(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all outline-none',
                          isLinkActive(subItem.href)
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <subItem.icon size={16} className={clsx("mr-3 shrink-0", isLinkActive(subItem.href) ? "text-primary" : "opacity-70")} />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className={clsx(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all outline-none mb-1',
                  isLinkActive(item.href)
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={18} className={clsx("mr-3 shrink-0", isLinkActive(item.href) ? "text-primary" : "")} />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
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
                Funcionário
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