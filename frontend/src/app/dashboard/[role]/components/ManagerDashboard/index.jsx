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
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { format, parseISO, isValid } from 'date-fns';
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

// COMPONENTS, HOOK E CONFIG
import SidebarManager from '@/components/layout/sidebar-manager';
import ManagerStats from '@/components/Dashboard/ManagerStats';
import { useManagerDashboard, TABS } from '@/hooks/useManagerDashboard';

// Função de formatação de data robusta
const formatDate = (dateStr) => {
    if (!dateStr) return <span className="text-muted-foreground">-</span>;
    try {
        const date = new Date(dateStr);
        if (!isValid(date)) return <span className="text-muted-foreground">-</span>;
        
        return (
            <span className="capitalize">
                {format(date, "dd MMM yyyy", { locale: ptBR })}
            </span>
        );
    } catch {
        return <span>{dateStr}</span>;
    }
};

const StatusBadge = ({ status, simple }) => {
    const s = String(status || '').toLowerCase();
    
    // Cores padronizadas com o tema Manager
    let style = "bg-slate-100 text-slate-700 border-slate-200";
    if (s.includes('aprovado') || s.includes('concluido')) style = "bg-green-100 text-green-700 border-green-200";
    else if (s.includes('negado') || s.includes('cancelado')) style = "bg-red-100 text-red-700 border-red-200";
    else if (s.includes('pendente') || s.includes('solicitado')) style = "bg-amber-100 text-amber-700 border-amber-200";
    else if (s.includes('ativo')) style = "bg-blue-100 text-blue-700 border-blue-200";
    else if (s.includes('inativo')) style = "bg-slate-200 text-slate-600 border-slate-300";

    return (
        <Badge variant="outline" className={clsx("font-normal capitalize shadow-none whitespace-nowrap", style)}>
            {status || 'Desconhecido'}
        </Badge>
    );
};

// SUB-COMPONENTE: TABELA GENÉRICA
const GenericTable = ({ type, data }) => {
    const renderContent = () => {
        switch (type) {
            case TABS.PEDIDOS:
                return (
                    <>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[120px] pl-6">ID</TableHead>
                                <TableHead>SKU do Insumo</TableHead>
                                <TableHead>Data Solicitação</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40">
                                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{item.id.slice(0, 8)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal bg-background font-mono">{item.sku}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-foreground/80">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-muted-foreground"/>
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
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[120px] pl-6">ID</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Valor Total</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40">
                                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{item.id.slice(0, 8)}</TableCell>
                                    <TableCell className="max-w-[200px] truncate text-sm text-foreground/80" title={item.description}>
                                        {item.description || "Sem descrição"}
                                    </TableCell>
                                    <TableCell className="font-medium text-emerald-600 text-sm">
                                        {item.valor_total 
                                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total) 
                                            : '-'
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
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="pl-6">Nome</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Setor</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40">
                                    <TableCell className="pl-6 font-medium text-sm text-foreground/80">{item.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{item.sku}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal text-xs bg-muted border-border">
                                            {item.setorName && item.setorName !== 'null' ? item.setorName : "N/A"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-foreground/80">
                                        {item.current_storage || 0} <span className="text-muted-foreground text-xs">/ {item.max_storage}</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <StatusBadge status={item.status} simple />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );

            case TABS.SETORES:
                return (
                    <>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="pl-6">Nome</TableHead>
                                <TableHead>ID Interno</TableHead>
                                <TableHead className="text-right pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/40">
                                    <TableCell className="pl-6 font-semibold text-foreground/80">{item.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">#{item.id}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <StatusBadge status={item.status} simple />
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

export default function ManagerDashboard() {
    // Uso do Hook refatorado
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
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            
            <SidebarManager />

            <div className="flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
                
                {/* Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
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

                <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                    
                    {/* 1. CARDS DE ESTATÍSTICAS */}
                    <ManagerStats stats={stats} loading={loadingStats} />

                    {/* 2. ÁREA DE LISTAGEM COM TABS */}
                    <Tabs 
                        defaultValue={TABS.PEDIDOS} 
                        value={activeTab} 
                        onValueChange={changeTab}
                        className="space-y-4"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <TabsList className="bg-background border border-border shadow-sm p-1">
                                <TabsTrigger value={TABS.PEDIDOS} className="gap-2"><ShoppingCart size={14}/> Pedidos</TabsTrigger>
                                <TabsTrigger value={TABS.ORCAMENTOS} className="gap-2"><FileText size={14}/> Orçamentos</TabsTrigger>
                                <TabsTrigger value={TABS.INSUMOS} className="gap-2"><Package size={14}/> Insumos</TabsTrigger>
                                <TabsTrigger value={TABS.SETORES} className="gap-2"><Layers size={14}/> Setores</TabsTrigger>
                            </TabsList>

                            {/* Link Rápido */}
                            <Button variant="link" asChild className="text-muted-foreground hover:text-primary px-0 hidden sm:flex">
                                <Link href={`/dashboard/manager/${activeTab}`} className="flex items-center gap-1">
                                    Gerenciar {activeTab} <ArrowRight size={14} />
                                </Link>
                            </Button>
                        </div>

                        {/* CONTEÚDO DAS ABAS */}
                        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[450px] flex flex-col">
                            
                            {/* Loading / Empty / Data States */}
                            {tableLoading ? (
                                <div className="p-6 space-y-4">
                                    {Array.from({ length: pagination.limit }).map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full rounded-md" />
                                    ))}
                                </div>
                            ) : tableData.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-12">
                                    <div className="p-4 bg-muted/50 rounded-full mb-2">
                                        <Package className="h-8 w-8 opacity-50" />
                                    </div>
                                    <p>Nenhum registro encontrado nesta categoria.</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-x-auto">
                                    <GenericTable 
                                        type={activeTab} 
                                        data={tableData} 
                                    />
                                </div>
                            )}

                            {/* FOOTER: Paginação e Controle de Limite */}
                            <div className="border-t border-border bg-muted/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                                    <span>
                                        Mostrando {tableData.length} de {pagination.meta.totalItems}
                                    </span>
                                    
                                    {/* SELETOR DE LIMITE */}
                                    <div className="flex items-center gap-2">
                                        <span>Exibir:</span>
                                        <Select 
                                            value={String(pagination.limit)} 
                                            onValueChange={changeLimit}
                                            disabled={tableLoading}
                                        >
                                            <SelectTrigger className="h-8 w-[70px] bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="6">6</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Pagination className="w-auto mx-0">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                disabled={!pagination.hasPrevious || tableLoading}
                                                onClick={() => changePage(pagination.page - 1)}
                                                className="gap-1 pl-2.5 h-8"
                                            >
                                                <ChevronLeft className="h-4 w-4" /> Anterior
                                            </Button>
                                        </PaginationItem>
                                        
                                        <PaginationItem className="flex items-center px-4 text-sm font-medium">
                                            {pagination.meta.currentPage} / {pagination.meta.totalPages}
                                        </PaginationItem>

                                        <PaginationItem>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                disabled={!pagination.hasNext || tableLoading}
                                                onClick={() => changePage(pagination.page + 1)}
                                                className="gap-1 pr-2.5 h-8"
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