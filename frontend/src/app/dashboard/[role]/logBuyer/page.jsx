"use client";

import React, { useState, useEffect } from 'react';
import { History, Filter, Menu, RefreshCw } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import clsx from 'clsx';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SidebarBuyer from "@/components/layout/sidebar-buyer";
import BuyerLogsTable from "@/components/Logs/BuyerLogsTable";

export default function BuyerHistoricoPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 15,
        totalItems: 0,
        totalPages: 1
    });
    const [actionFilter, setActionFilter] = useState('todos');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchLogs = async (page = 1, limit = 15, filter = 'todos') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (filter !== 'todos') {
                params.append('action', filter); // suas rotas usam "action", não "actionType"
            }

            // 1. Busca logs de orçamento (feitos pelo buyer)
            const orcRes = await fetch(`api/orcamentos/logs?${params}`);
            const orcData = orcRes.ok ? await orcRes.json() : { data: [], meta: { totalItems: 0 } };

            // 2. Busca logs de compra (feitos pelo gerente/buyer — se aplicável)
            const compRes = await fetch(`api/compras/logs?${params}`);
            const compData = compRes.ok ? await compRes.json() : { data: [], meta: { totalItems: 0 } };

            // Junta os dois
            const allLogs = [
                ...orcData.data.map(log => ({ ...log, entidade: 'orcamento' })),
                ...compData.data.map(log => ({ ...log, entidade: 'compra' }))
            ];

            // Ordena por data (mais recente primeiro)
            allLogs.sort((a, b) => new Date(b.timestamps) - new Date(a.timestamps));

            const totalItems = (orcData.meta?.totalItems || 0) + (compData.meta?.totalItems || 0);
            const totalPages = Math.ceil(totalItems / limit);

            setLogs(allLogs.slice(0, limit));
            setPagination({ page, limit, totalItems, totalPages });

        } catch (err) {
            toast.error("Erro ao carregar histórico");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1, pagination.limit, actionFilter);
    }, [actionFilter]);

    const handleRefresh = () => fetchLogs(pagination.page, pagination.limit, actionFilter);
    const handlePageChange = (newPage) => fetchLogs(newPage, pagination.limit, actionFilter);
    const handleLimitChange = (newLimit) => {
        const limit = parseInt(newLimit);
        setPagination(prev => ({ ...prev, limit }));
        fetchLogs(1, limit, actionFilter);
    };

    return (
        <div className="flex min-h-screen bg-muted/20 font-sans text-foreground overflow-hidden">
            <Toaster position="top-right" richColors closeButton />

            <SidebarBuyer isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 flex-col lg:ml-[260px] transition-all duration-300 w-full min-w-0">

                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <History className="h-5 w-5 text-primary" />
                        <span className="truncate">Histórico de Atividades</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="ml-auto gap-2">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* Conteúdo */}
                <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 overflow-hidden">

                    {/* Cabeçalho + Filtro */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Meu Histórico</h1>
                            <p className="text-sm text-muted-foreground">
                                Todas as criações e alterações que você fez em orçamentos e compras.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <Filter size={13} /> Filtrar:
                            </span>
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="h-8 w-[140px] border-none shadow-none focus:ring-0 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todas as ações</SelectItem>
                                    <SelectItem value="INSERT">Apenas criações</SelectItem>
                                    <SelectItem value="UPDATE">Apenas edições</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabela */}
                    <div className="flex-1 min-h-0 bg-card rounded-lg border shadow-sm overflow-hidden">
                        <BuyerLogsTable
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