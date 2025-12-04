"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Menu, RefreshCw } from 'lucide-react';
import { Toaster } from 'sonner';
import clsx from 'clsx';

// UI Components
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// REMOVIDO: SheetTrigger (não é necessário com estado manual)
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

// Layout & Components
import SidebarAdmin from "@/components/layout/sidebar-admin";
import UsersLogTable from "@/components/Logs/UsersLogTable";
import { useAdminLogs } from "@/hooks/useAdminLogs";

export default function LogAdminPage() {
    const { logs, loading, pagination, fetchLogs } = useAdminLogs();
    const [actionFilter, setActionFilter] = useState('todos');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Carregamento inicial e filtro
    useEffect(() => {
        fetchLogs(1, pagination.limit, actionFilter);
    }, [fetchLogs, actionFilter]); 
    
    const handlePageChange = (newPage) => fetchLogs(newPage, pagination.limit, actionFilter);
    const handleLimitChange = (newLimit) => fetchLogs(1, parseInt(newLimit), actionFilter);
    const handleRefresh = () => fetchLogs(pagination.page, pagination.limit, actionFilter);

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground overflow-hidden">
            <Toaster position="top-right" richColors />

            {/* SIDEBAR DESKTOP */}
            <div className="hidden lg:block">
                <SidebarAdmin isOpen={true} />
            </div>

            {/* SIDEBAR MOBILE (Overlay controlado por State) */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64 border-none focus-visible:outline-none">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>Navegação Admin</SheetDescription>
                    </SheetHeader>
                    {/* Passando função para fechar ao clicar no link */}
                    <SidebarAdmin isOpen={true} onToggle={() => setIsSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 flex-col lg:ml-64 transition-all duration-300">
                
                {/* HEADER PADRONIZADO */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Toggle Mobile: Botão simples altera o state */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="lg:hidden -ml-2"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>

                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                            <span className="truncate">Logs de Auditoria (Usuários)</span>
                        </div>
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh} 
                        disabled={loading} 
                        className="gap-2"
                    >
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* MAIN CONTENT */}
                <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    
                    {/* Header + Filtro */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Histórico de Usuários</h1>
                            <p className="text-sm text-muted-foreground">
                                Monitore as ações de criação e edição de perfis.
                            </p>
                        </div>
                        
                        <div className="w-full sm:w-auto flex items-center gap-3 bg-card border rounded-lg p-2 shadow-sm">
                            <span className="text-xs font-semibold text-muted-foreground flex gap-2 ml-2">
                                <Filter size={14} /> Filtrar:
                            </span>
                            <Select 
                                value={actionFilter} 
                                onValueChange={(val) => { setActionFilter(val); fetchLogs(1, pagination.limit, val); }}
                            >
                                <SelectTrigger className="h-8 w-[140px] border-none shadow-none bg-transparent focus:ring-0">
                                    <SelectValue placeholder="Ação" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todas as Ações</SelectItem>
                                    <SelectItem value="INSERT">Criações (INSERT)</SelectItem>
                                    <SelectItem value="UPDATE">Edições (UPDATE)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* TABELA */}
                    <UsersLogTable 
                        logs={logs}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />

                </main>
            </div>
        </div>
    );
}