"use client";

import React, { useEffect, useCallback } from 'react';
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
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// SHADCN UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            
            <SidebarManager />

            {/* Ajuste no Container Principal para ocupar 100% da altura */}
            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">
                
                {/* Header */}
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                                    <Layers size={20} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <SidebarManager />
                            </SheetContent>
                        </Sheet>
                        
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            <span className="hidden sm:inline">Visão Geral do</span> Gerente
                        </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={refresh} disabled={tableLoading} className="gap-2">
                        <RefreshCw className={clsx("h-4 w-4", (tableLoading || loadingStats) && "animate-spin")} />
                        Atualizar
                    </Button>
                </header>

                {/* Main: Agora usa flex-col para empurrar o footer da tabela pro final da tela */}
                <main className="flex flex-1 flex-col p-6 md:p-8 gap-8 overflow-hidden h-[calc(100vh-4rem)]">
                    
                    {/* 1. CARDS DE ESTATÍSTICAS (Tamanho Fixo) */}
                    <div className="shrink-0">
                        <ManagerStats stats={stats} loading={loadingStats} />
                    </div>

                    {/* 2. ÁREA DE LISTAGEM COM TABS (Ocupa o resto da tela) */}
                    <Tabs 
                        defaultValue={TABS.PEDIDOS} 
                        value={activeTab} 
                        onValueChange={changeTab}
                        className="flex flex-1 flex-col gap-4 overflow-hidden"
                    >
                        {/* Header das Tabs */}
                        <div className="flex shrink-0 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <TabsList className="bg-background border border-border shadow-sm p-1">
                                <TabsTrigger value={TABS.PEDIDOS} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><ShoppingCart size={14}/> Pedidos</TabsTrigger>
                                <TabsTrigger value={TABS.ORCAMENTOS} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><FileText size={14}/> Orçamentos</TabsTrigger>
                                <TabsTrigger value={TABS.INSUMOS} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Package size={14}/> Insumos</TabsTrigger>
                                <TabsTrigger value={TABS.SETORES} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Layers size={14}/> Setores</TabsTrigger>
                            </TabsList>

                            <Button variant="link" asChild className="text-muted-foreground hover:text-primary px-0 hidden sm:flex">
                                <Link href={`/dashboard/manager/${activeTab}`} className="flex items-center gap-1 font-medium">
                                    Gerenciar {activeTab} <ArrowRight size={14} />
                                </Link>
                            </Button>
                        </div>

                        {/* Card da Tabela que Cresce (flex-1) */}
                        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            
                            {/* Conteúdo com Scroll interno */}
                            <div className="flex-1 overflow-auto scrollbar-thin">
                                {tableLoading ? (
                                    <div className="p-6 space-y-4">
                                        {Array.from({ length: Math.min(pagination.limit, 8) }).map((_, i) => (
                                            <Skeleton key={i} className="h-14 w-full rounded-lg bg-muted/50" />
                                        ))}
                                    </div>
                                ) : tableData.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <div className="p-6 bg-muted/30 rounded-full mb-3 border border-border/50">
                                            <Package className="h-10 w-10 opacity-40" />
                                        </div>
                                        <p className="font-medium">Nenhum registro encontrado.</p>
                                    </div>
                                ) : (
                                    <GenericTable 
                                        type={activeTab} 
                                        data={tableData} 
                                    />
                                )}
                            </div>

                            {/* Footer Fixo no final do Card */}
                            <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                                
                                <div className="flex items-center gap-6 text-sm text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                                    <span>
                                        Total: <span className="font-semibold text-foreground">{pagination.meta.totalItems}</span>
                                    </span>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="hidden sm:inline">Por página:</span>
                                        <Select 
                                            value={String(pagination.limit)} 
                                            onValueChange={changeLimit}
                                            disabled={tableLoading}
                                        >
                                            <SelectTrigger className="h-8 w-[70px] bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="8">8</SelectItem>
                                                <SelectItem value="15">15</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Pagination className="w-auto mx-0">
                                    <PaginationContent className="gap-1">
                                        <PaginationItem>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                disabled={!pagination.hasPrevious || tableLoading}
                                                onClick={() => changePage(pagination.page - 1)}
                                                className="gap-1 h-8 px-3"
                                            >
                                                <ChevronLeft className="h-4 w-4" /> Anterior
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
                                                className="gap-1 h-8 px-3"
                                            >
                                                Próximo <ChevronRight className="h-4 w-4" />
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

// --- SUB-COMPONENTE: TABELA GENÉRICA ---
const GenericTable = ({ type, data }) => {
    
    // Configurações comuns de renderização
    const renderContent = () => {
        switch (type) {
            case TABS.PEDIDOS:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow>
                                <TableHead className="w-[120px] pl-6 h-12">ID</TableHead>
                                <TableHead>Insumo (SKU)</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                                        #{item.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="font-medium text-sm">{item.sku || '---'}</div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={13} />
                                            {formatDate(item.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
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
                            <TableRow>
                                <TableHead className="w-[120px] pl-6 h-12">ID</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Valor Total</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{item.id.slice(0, 8)}</TableCell>
                                    <TableCell className="max-w-[250px] truncate text-sm" title={item.description}>
                                        {item.description || "Sem descrição"}
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
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow>
                                <TableHead className="pl-6 h-12">Nome</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Setor</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-6 py-4">
                                        <span className="font-medium text-sm block text-foreground">{item.name || item.nome}</span>
                                    </TableCell>
                                    <TableCell>
                                        <code className="bg-muted/50 rounded px-1.5 py-0.5 text-xs font-semibold text-foreground/80 border border-border/50">
                                            {item.sku || item.SKU}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal text-xs bg-muted text-muted-foreground border-border/60">
                                            {item.setorName && item.setorName !== 'null' ? item.setorName : "N/A"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-baseline gap-1">
                                            <span className={clsx(
                                                "font-semibold",
                                                (item.current_storage < (item.max_storage * 0.35)) ? "text-red-600" : "text-foreground"
                                            )}>
                                                {item.current_storage || 0}
                                            </span> 
                                            <span className="text-muted-foreground text-xs">/ {item.max_storage}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
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
                                <TableHead className="pl-6 h-12">Nome</TableHead>
                                <TableHead>ID Interno</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60">
                                    <TableCell className="pl-6 py-4">
                                        <span className="font-semibold text-primary">{item.name}</span>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        #{item.id}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
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

    return <Table>{renderContent()}</Table>;
};

// --- UTILITÁRIOS & COMPONENTES VISUAIS ---

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (!isValid(d)) return '-';
        return format(d, "dd/MM/yyyy", { locale: ptBR });
    } catch {
        return dateStr;
    }
};

const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    
    // CORES "PRETTIER": Fundo transparente (opacity) com borda visível e texto forte.
    let colors = "bg-slate-500/10 text-slate-600 border-slate-500/20"; // Padrão / Inativo

    if (s.includes('aprovado') || s.includes('concluido') || s.includes('compra_efetuada')) {
        colors = "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-400";
    } 
    else if (s.includes('negado') || s.includes('cancelado')) {
        colors = "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-400";
    } 
    else if (s.includes('pendente') || s.includes('solicitado')) {
        colors = "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-400";
    } 
    else if (s.includes('renegociacao')) {
        colors = "bg-orange-500/10 text-orange-700 border-orange-500/25 dark:text-orange-400";
    } 
    else if (s.includes('ativo') || s.includes('compra_iniciada')) {
        colors = "bg-blue-500/10 text-blue-700 border-blue-500/25 dark:text-blue-400";
    }

    return (
        <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium", colors)}>
            {status || 'N/A'}
        </Badge>
    );
};