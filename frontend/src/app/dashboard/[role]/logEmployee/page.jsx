"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Menu, RefreshCw } from 'lucide-react';
import { Toaster } from 'sonner';
import clsx from 'clsx';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SidebarEmployee from "@/components/layout/sidebar-employee";
import UsersLogTable from "@/components/Logs/UsersLogTable";
import { useEmployeeLogs } from "@/hooks/useEmployeeLogs.js";

export default function LogEmployeePage() {
    const { logs, loading, pagination, fetchLogs } = useEmployeeLogs();
    const [actionFilter, setActionFilter] = useState('todos');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchLogs(1, pagination.limit, actionFilter);
    }, [fetchLogs, actionFilter]);

    const handlePageChange = (newPage) => fetchLogs(newPage, pagination.limit, actionFilter);
    const handleLimitChange = (newLimit) => fetchLogs(1, parseInt(newLimit), actionFilter);
    const handleRefresh = () => fetchLogs(pagination.page, pagination.limit, actionFilter);

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground overflow-hidden">
            <Toaster position="top-right" richColors />

            <SidebarEmployee isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 flex-col lg:ml-64 transition-all duration-300 w-full min-w-0">
                <header className="sticky top-0 z-30 flex items-center px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        <span className="truncate">Logs de Atividades</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2 shadow-sm ml-auto">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-4 overflow-hidden h-[calc(100vh-4rem)]">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Histórico de Pedidos</h1>
                            <p className="text-sm text-muted-foreground">
                                Acompanhe as atividades registradas no sistema na seção de pedidos.
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