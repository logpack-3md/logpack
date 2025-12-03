"use client";

import React from 'react';
import {
    LayoutDashboard,
    RefreshCw,
    Package,
    Layers,
    FileText,
    ShoppingCart,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Inbox,
    PackageX
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { Menu } from "lucide-react";

// SHADCN UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";

// COMPONENTS E LIB
import SidebarManager from '@/components/layout/sidebar-manager';
import ManagerStats from '@/components/Dashboard/ManagerStats';
import { useManagerDashboard, TABS } from '@/hooks/useManagerDashboard';

export default function ManagerDashboard() {
    const {
        stats,
        loadingStats,
        activeTab,
        tableData,
        tableLoading,
        pagination,
        changeTab,
        changePage,
        changeLimit,
        refresh
    } = useManagerDashboard();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);



    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />

            {/* Overlay Mobile */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            <SidebarManager isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Container Principal */}
            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">

                {/* Header Mobile & Desktop */}
                <header className="sticky top-0 z-30 flex items-center px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 font-semibold text-lg truncate">
                        <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
                        <span className="truncate">Visão Geral</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={refresh} disabled={tableLoading} className="gap-2 ml-auto">
                        <RefreshCw className={clsx("h-4 w-4", (tableLoading || loadingStats) && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col p-4 md:p-8 gap-4 md:gap-8 overflow-hidden h-[calc(100vh-4rem)]">

                    {/* Stats */}
                    <div className="shrink-0">
                        <ManagerStats stats={stats} loading={loadingStats} />
                    </div>

                    {/* Table */}
                    <Tabs
                        defaultValue={TABS.PEDIDOS}
                        value={activeTab}
                        onValueChange={changeTab}
                        className="flex flex-1 flex-col gap-4 overflow-hidden"
                    >
                        {/* Header Tabs */}
                        <div className="flex shrink-0 flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <TabsList className="bg-background border border-border shadow-sm p-1 grid grid-cols-2 w-full h-auto sm:w-auto sm:flex">
                                <TabsTrigger value={TABS.PEDIDOS} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><ShoppingCart size={14} /> Pedidos</TabsTrigger>
                                <TabsTrigger value={TABS.ORCAMENTOS} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><FileText size={14} /> Orçamentos</TabsTrigger>
                                <TabsTrigger value={TABS.INSUMOS} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Package size={14} /> Insumos</TabsTrigger>
                                <TabsTrigger value={TABS.SETORES} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Layers size={14} /> Setores</TabsTrigger>
                            </TabsList>

                            <Button variant="link" asChild className="text-muted-foreground hover:text-primary px-0 hidden sm:flex">
                                <Link href={TABS.SETORES == activeTab ? '/dashboard/manager/insumos' : `/dashboard/manager/${activeTab}`} className="flex items-center gap-1 font-medium">
                                    Gerenciar {activeTab} <ArrowRight size={14} />
                                </Link>
                            </Button>
                        </div>

                        {/* Card da Tabela */}
                        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">

                            {/* Wrapper com Scroll Horizontal e Vertical */}
                            <div className="flex-1 overflow-auto scrollbar-thin relative w-full">
                                {tableLoading ? (
                                    <div className="p-4 md:p-6 space-y-4">
                                        {Array.from({ length: Math.min(pagination.limit, 8) }).map((_, i) => (
                                            <Skeleton key={i} className="h-14 w-full rounded-lg bg-muted/50" />
                                        ))}
                                    </div>
                                ) : tableData.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                                        <div className="p-6 bg-muted/30 rounded-full mb-3 border border-border/50">
                                            {activeTab === TABS.PEDIDOS ? <Inbox className="h-10 w-10 opacity-40" /> : <PackageX className="h-10 w-10 opacity-40" />}
                                        </div>
                                        <p className="font-medium">Nenhum registro encontrado.</p>
                                    </div>
                                ) : (
                                    <div className="min-w-full inline-block align-middle">
                                        <GenericTable
                                            type={activeTab}
                                            data={tableData}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer Responsivo */}
                            <div className="border-t border-border bg-background p-3 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">

                                <div className="flex items-center justify-between w-full sm:w-auto gap-4 text-sm text-muted-foreground">
                                    <span className="whitespace-nowrap">
                                        Total: <span className="font-semibold text-foreground">{pagination.meta.totalItems}</span>
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <span className="hidden sm:inline">Exibir:</span>
                                        <Select
                                            value={String(pagination.limit)}
                                            onValueChange={changeLimit}
                                            disabled={tableLoading}
                                        >
                                            <SelectTrigger className="h-8 w-[70px] bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Pagination className="w-full sm:w-auto mx-0 flex justify-center sm:justify-end">
                                    <PaginationContent className="gap-1">
                                        <PaginationItem>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!pagination.hasPrevious || tableLoading}
                                                onClick={() => changePage(pagination.page - 1)}
                                                className="gap-1 h-8 px-2 md:px-3"
                                            >
                                                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Anterior</span>
                                            </Button>
                                        </PaginationItem>

                                        <PaginationItem className="flex items-center justify-center min-w-[3rem] text-sm font-medium">
                                            {pagination.meta.currentPage} <span className="text-muted-foreground mx-1">/</span> {pagination.meta.totalPages}
                                        </PaginationItem>

                                        <PaginationItem>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!pagination.hasNext || tableLoading}
                                                onClick={() => changePage(pagination.page + 1)}
                                                className="gap-1 h-8 px-2 md:px-3"
                                            >
                                                <span className="hidden sm:inline">Próximo</span> <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </Tabs>

                </main>
            </div>
        </div>
    );
}

// --- TABELAS RESPONSIVAS ---
const GenericTable = ({ type, data }) => {
    const renderContent = () => {
        switch (type) {
            case TABS.PEDIDOS:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                {/* Ocultar ID no mobile */}
                                <TableHead className="w-[100px] pl-4 md:pl-6 h-12 hidden md:table-cell">ID</TableHead>
                                <TableHead className="min-w-[150px]">Insumo (SKU)</TableHead>
                                <TableHead className="whitespace-nowrap">Data</TableHead>
                                <TableHead className="text-right pr-4 md:pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-4 md:pl-6 font-mono text-xs text-muted-foreground hidden md:table-cell">
                                        #{item.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="min-w-[150px]">
                                        <Badge variant="outline" className="font-mono text-xs bg-background font-normal px-2 py-1 border-border whitespace-nowrap">
                                            {item.sku || item.insumoSKU || '---'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={13} />
                                            {formatDate(item.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-4 md:pr-6">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );


                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                <TableHead className="w-[100px] pl-4 md:pl-6 h-12 hidden md:table-cell">ID</TableHead>
                                <TableHead className="min-w-[200px]">Descrição</TableHead>
                                <TableHead className="whitespace-nowrap">Valor</TableHead>
                                <TableHead className="text-right pr-4 md:pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-4 md:pl-6 font-mono text-xs text-muted-foreground hidden md:table-cell">
                                        #{item.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] md:max-w-[300px] truncate text-sm" title={item.description}>
                                        {item.description || "Sem descrição"}
                                    </TableCell>
                                    <TableCell className="font-semibold text-emerald-600 text-sm whitespace-nowrap">
                                        {item.valor_total
                                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total)
                                            : <span className="text-muted-foreground font-normal">-</span>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right pr-4 md:pr-6">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );

            case TABS.ORCAMENTOS:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                <TableHead className="w-[120px] pl-6 h-12">ID</TableHead>
                                <TableHead>Item / Descrição</TableHead> {/* Atualizado Cabeçalho */}
                                <TableHead>Valor Total</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{item.id.slice(0, 8)}</TableCell>
                                    <TableCell>
                                        {/* TENTA PEGAR SKU NESTED OU DO PRÓPRIO OBJETO */}
                                        <div className="flex flex-col gap-1">
                                            {(item.compra?.pedido?.insumoSKU || item.sku) ? (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-mono bg-background">{item.compra?.pedido?.insumoSKU || item.sku}</Badge>
                                                </div>
                                            ) : (
                                                // Fallback para description cortada se não tiver SKU
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                    <Tag size={12} /> <span className="truncate max-w-[150px]">Geral</span>
                                                </div>
                                            )}
                                            <span className="text-xs text-muted-foreground truncate max-w-[250px]">{item.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-emerald-600 text-sm">
                                        {item.valor_total
                                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total)
                                            : <span className="text-muted-foreground font-normal">-</span>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );
                
            case TABS.INSUMOS:
                const formatNumber = (value) => {
                    return new Intl.NumberFormat('pt-BR').format(value || 0);
                };
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow>
                                <TableHead className="pl-4 md:pl-6 h-12 min-w-[150px]">Nome</TableHead>
                                <TableHead className="hidden sm:table-cell">SKU</TableHead>
                                <TableHead className="hidden lg:table-cell">Setor</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead className="text-right pr-4 md:pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-4 md:pl-6 py-4">
                                        <span className="truncate font-medium text-sm block text-foreground max-w-[180px] md:max-w-[300px]" title={item.name || item.nome}>
                                            {item.name || item.nome || "---"}
                                        </span>

                                        <div className="lg:hidden text-[10px] text-muted-foreground mt-1">
                                            {item.setorName}
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <code className="bg-muted/50 rounded px-1.5 py-0.5 text-xs font-semibold text-foreground/80 border border-border/50">
                                            {item.sku || item.SKU}
                                        </code>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell">
                                        <Badge variant="secondary" className="font-normal text-xs bg-muted text-muted-foreground border-border/60">
                                            {item.setorName && item.setorName !== 'null' ? item.setorName : "N/A"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1">
                                            <span className={clsx("font-semibold whitespace-nowrap", (item.current_storage < (item.max_storage * 0.35)) ? "text-red-600" : "text-foreground")}>
                                                {formatNumber(item.current_storage)}
                                            </span>
                                            <span className="text-muted-foreground text-[10px] sm:text-xs whitespace-nowrap opacity-80">
                                                <span className="sm:hidden">Max: </span>
                                                <span className="hidden sm:inline">/</span>
                                                {' ' + formatNumber(item.max_storage)}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right pr-4 md:pr-6">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );

            case TABS.SETORES:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow>
                                <TableHead className="pl-4 md:pl-6 h-12">Nome</TableHead>
                                <TableHead className="hidden sm:table-cell">ID Interno</TableHead>
                                <TableHead className="text-right pr-4 md:pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-4 md:pl-6 py-4">
                                        <span className="font-semibold text-primary">{item.name}</span>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground hidden sm:table-cell">
                                        #{item.id}
                                    </TableCell>
                                    <TableCell className="text-right pr-4 md:pr-6">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );
            default: return null;
        }
    };

    return <Table className="w-full">{renderContent()}</Table>;
};

// Utils
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const formatStatusLabel = (status) => status;

const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    let colors = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    if (s.includes('aprovado') || s.includes('concluido') || s.includes('compra_efetuada') || s === 'ativo') {
        colors = "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-400 dark:border-emerald-500/20";
    }
    else if (s.includes('negado') || s.includes('cancelado') || s === 'inativo') {
        colors = "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-400 dark:border-rose-500/20";
    }
    else if (s.includes('pendente') || s.includes('solicitado') || s.includes('renegociacao')) {
        colors = "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-400 dark:border-amber-500/20";
    }
    else if (s.includes('compra_iniciada')) {
        colors = "bg-blue-500/10 text-blue-700 border-blue-500/25 dark:text-blue-400 dark:border-blue-500/20";
    }
    return (
        <div className="flex justify-end">
            <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2.5 py-0.5 gap-1.5", colors)}>
                {formatStatusLabel(status)}
            </Badge>
        </div>
    );
};