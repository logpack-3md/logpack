"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Menu, RefreshCw } from 'lucide-react';
import { Toaster } from 'sonner';
import clsx from 'clsx';

// UI Components
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

            {/* SIDEBAR DESKTOP (Apenas visualiza quando lg) */}
            <div className="hidden lg:block">
                <SidebarAdmin isOpen={true} />
            </div>

            {/* SIDEBAR MOBILE (Gaveta) */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent 
                    side="left" 
                    // width-full no content para garantir que o menu interno ocupe espaço sem travar em 256px
                    className="p-0 w-full max-w-[300px] border-r border-border focus-visible:outline-none"
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>Navegação Admin</SheetDescription>
                    </SheetHeader>
                    {/* Componente interno w-full se adapta ao sheet */}
                    <SidebarAdmin isOpen={true} onToggle={() => setIsSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* ÁREA DE CONTEÚDO */}
            <div className="flex flex-1 flex-col lg:ml-64 transition-all duration-300 w-full min-w-0">
                
                {/* HEADER */}
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-4 shadow-sm">
                    <div className="flex items-center gap-3">
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
                            <span className="truncate hidden sm:inline">Logs de Auditoria</span>
                            <span className="truncate sm:hidden">Logs</span>
                        </div>
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh} 
                        disabled={loading} 
                        className="gap-2 h-9 px-3 shadow-sm bg-background"
                    >
                        <RefreshCw className={clsx("h-3.5 w-3.5", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* MAIN CONTENT */}
                <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-4 overflow-hidden h-[calc(100vh-4rem)]">
                    
                    {/* Section Header + Filtros */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Histórico de Usuários</h1>
                            <p className="text-sm text-muted-foreground">
                                Acompanhe alterações no sistema.
                            </p>
                        </div>
                        
                        <div className="w-full sm:w-auto flex items-center gap-3 bg-card border rounded-lg p-1.5 px-3 shadow-sm">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Filter size={12} /> Filtrar:
                            </span>
                            <Select 
                                value={actionFilter} 
                                onValueChange={(val) => { setActionFilter(val); fetchLogs(1, pagination.limit, val); }}
                            >
                                <SelectTrigger className="h-8 w-full sm:w-[140px] border-none shadow-none bg-transparent focus:ring-0 text-xs">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="todos">Todas</SelectItem>
                                    <SelectItem value="INSERT">Criações</SelectItem>
                                    <SelectItem value="UPDATE">Edições</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabela */}
                    <div className="flex-1 min-h-0 w-full">
                        <UsersLogTable 
                            logs={logs}
                            loading={loading}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    </div>

                </main>
            </div>
        </div>
    );
}