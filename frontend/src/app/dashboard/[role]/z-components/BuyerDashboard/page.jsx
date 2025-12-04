"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Activity, TrendingUp, AlertCircle, Clock, ShoppingBag, Menu, RefreshCw } from 'lucide-react';
import { Toaster } from 'sonner';
import Link from 'next/link';
import clsx from 'clsx';

// UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Layout & Components
import SidebarBuyer from "@/components/layout/sidebar-buyer";
import DashboardTable from "@/components/Buyer/DashboardTable";
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function BuyerDashboard() {
    const {
        compras, loading, meta,
        fetchCompras
    } = useBuyerOperations();
    const [currentLimit, setCurrentLimit] = useState(10);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchCompras(1, currentLimit, 'todos');
    }, [fetchCompras]);

    const handleRefresh = () => fetchCompras(meta.currentPage, currentLimit, 'todos');
    const handlePageChange = (p) => fetchCompras(p, currentLimit, 'todos');
    const handleLimitChange = (val) => {
        const newLimit = parseInt(val);
        setCurrentLimit(newLimit);
        fetchCompras(1, newLimit, 'todos');
    };

    const stats = useMemo(() => {
        if (!compras) return { pending: 0, reneg: 0, total: 0 };
        return {
            pending: compras.filter(c => c.status === 'pendente').length,
            reneg: compras.filter(c => c.status?.includes('renegociacao')).length,
            total: meta.totalItems || 0
        };
    }, [compras, meta]);

    const cardsConfig = [
        { title: "Novos Pedidos", value: stats.pending, icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
        { title: "Em Negociação", value: stats.reneg, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
        { title: "Total na Lista", value: stats.total, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" }
    ];

    return (
        <div className="flex min-h-screen bg-muted/20 font-sans text-foreground overflow-hidden">
            <Toaster position="top-right" richColors />

            <SidebarBuyer isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 flex-col md:ml-[240px] lg:ml-[260px] transition-all duration-300 w-full">

                {/* Header Mobile / Desktop */}
                <header className="sticky top-0 z-30 flex items-center px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="truncate">Visão Geral</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2 shadow-sm ml-auto">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                <main className="flex flex-1 flex-col p-4 md:p-8 gap-6 md:gap-8 overflow-y-auto h-full">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 shrink-0">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Olá, Comprador</h1>
                            <p className="text-sm text-muted-foreground">Aqui está o resumo das atividades recentes.</p>
                        </div>

                        <Link href="/dashboard/buyer/estimar" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-10 sm:h-9 text-xs font-semibold">
                                <ShoppingBag className="w-3.5 h-3.5 mr-2" /> Ir para Gestão
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 shrink-0">
                        {loading && (!compras || compras.length === 0) ?
                            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
                            :
                            cardsConfig.map((item, i) => (
                                <StatCard key={i} {...item} />
                            ))
                        }
                    </div>

                    {/* Table Section */}
                    <div className="space-y-4 flex-1 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between shrink-0">
                            <h2 className="text-lg font-semibold tracking-tight">Histórico Recente</h2>
                        </div>

                        <div className="w-full overflow-x-auto pb-4">
                            {/* REMOVIDO: <div className="min-w-[800px] md:min-w-0"> */}
                            <div className="w-full">
                                <DashboardTable
                                    loading={loading}
                                    compras={compras}
                                    pagination={{
                                        limit: currentLimit,
                                        page: meta.currentPage,
                                        meta: meta,
                                        hasNext: meta.currentPage < meta.totalPages,
                                        hasPrevious: meta.currentPage > 1
                                    }}
                                    onPageChange={handlePageChange}
                                    onLimitChange={handleLimitChange}
                                />
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <Card className="shadow-none border-border/60 bg-card">
            <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                </div>
                <div className={clsx("p-2.5 rounded-lg border bg-opacity-50", bg)}>
                    <Icon className={clsx("w-5 h-5", color)} strokeWidth={2.5} />
                </div>
            </CardContent>
        </Card>
    )
}