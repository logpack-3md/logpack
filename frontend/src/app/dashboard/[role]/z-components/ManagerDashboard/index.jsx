"use client";

import React, { useState } from 'react';
import { 
    LayoutDashboard, RefreshCw, Menu, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// UI
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { ShoppingCart, FileText, Package, Layers, Inbox, PackageX, ChevronLeft, ChevronRight } from 'lucide-react';

// Custom
import SidebarManager from '@/components/layout/sidebar-manager';
import ManagerStats from '@/components/Dashboard/ManagerStats';
import ManagerTable from '@/components/Manager/ManagerTable';
import { useManagerDashboard, TABS } from '@/hooks/useManagerDashboard';

export default function ManagerDashboard() {
    const { 
        stats, loadingStats, activeTab, tableData, tableLoading,
        pagination, changeTab, changePage, changeLimit, refresh 
    } = useManagerDashboard();

    // CONTROLE DE ESTADO DA SIDEBAR
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />

            {/* Sidebar Desktop (Visível apenas em telas grandes via CSS lg:block interno do componente) */}
            <div className="hidden lg:block">
                <SidebarManager />
            </div>

            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">
                
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        
                        {/* Menu Mobile Controlado */}
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            
                            {/* Configurado para ocupar largura total no mobile */}
                            <SheetContent side="left" className="p-0 w-full max-w-full border-none focus-visible:outline-none">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Menu Principal</SheetTitle>
                                    <SheetDescription>Navegação</SheetDescription>
                                </SheetHeader>
                                
                                {/* Passando o handler para fechar ao clicar */}
                                <SidebarManager isOpen={true} onToggle={() => setIsSidebarOpen(false)} />
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
                            <LayoutDashboard className="h-5 w-5 text-primary hidden sm:block" />
                            <span className="truncate">Visão Geral</span>
                        </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={refresh} disabled={tableLoading} className="gap-2 shadow-sm">
                        <RefreshCw className={clsx("h-4 w-4", (tableLoading || loadingStats) && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* ... Resto do componente igual (Main, Tabs, Table...) ... */}
                <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    
                    <div className="shrink-0">
                        <ManagerStats stats={stats} loading={loadingStats} />
                    </div>

                    <Tabs defaultValue={TABS.PEDIDOS} value={activeTab} onValueChange={changeTab} className="flex flex-1 flex-col gap-4 overflow-hidden">
                        <div className="flex shrink-0 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <TabsList className="bg-background border border-border shadow-sm p-1 w-full sm:w-auto overflow-x-auto justify-start scrollbar-hide">
                                <TabsTrigger value={TABS.PEDIDOS} className="gap-2"><ShoppingCart size={14}/> Pedidos</TabsTrigger>
                                <TabsTrigger value={TABS.ORCAMENTOS} className="gap-2"><FileText size={14}/> Orçamentos</TabsTrigger>
                                <TabsTrigger value={TABS.INSUMOS} className="gap-2"><Package size={14}/> Insumos</TabsTrigger>
                                <TabsTrigger value={TABS.SETORES} className="gap-2"><Layers size={14}/> Setores</TabsTrigger>
                            </TabsList>

                            <Button variant="link" asChild className="text-muted-foreground hover:text-primary px-0 hidden sm:flex text-xs font-medium">
                                <Link href={TABS.SETORES == activeTab ? '/dashboard/manager/insumos' : `/dashboard/manager/${activeTab}`} className="flex items-center gap-1">
                                    Ir para Gestão Completa <ArrowRight size={12} />
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            <div className="flex-1 overflow-auto scrollbar-thin relative w-full">
                                {tableLoading ? (
                                    <div className="p-6 space-y-4">
                                        {Array.from({ length: Math.min(pagination.limit, 6) }).map((_, i) => (<Skeleton key={i} className="h-12 w-full rounded-lg bg-muted/40" />))}
                                    </div>
                                ) : tableData.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px] p-4">
                                        <div className="p-4 bg-muted/30 rounded-full mb-3 border border-border/50">
                                            {activeTab === TABS.PEDIDOS ? <Inbox className="h-8 w-8 opacity-30" /> : <PackageX className="h-8 w-8 opacity-30" />}
                                        </div>
                                        <p className="font-medium text-sm">Nada para mostrar agora.</p>
                                    </div>
                                ) : (
                                    <div className="min-w-full inline-block align-middle">
                                        <ManagerTable type={activeTab} data={tableData} />
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-border bg-background p-3 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 z-10">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                                    <span>Total: <b>{pagination.meta.totalItems}</b></span>
                                    <div className="flex items-center gap-2"><span className="hidden sm:inline">Exibir:</span><Select value={String(pagination.limit)} onValueChange={changeLimit} disabled={tableLoading}><SelectTrigger className="h-7 w-[60px] bg-background border-border text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="6">6</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
                                </div>
                                <Pagination className="w-auto mx-0"><PaginationContent className="gap-1"><PaginationItem><Button variant="ghost" size="sm" disabled={!pagination.hasPrevious || tableLoading} onClick={() => changePage(pagination.page - 1)} className="gap-1 h-7 px-2 text-xs text-muted-foreground hover:text-primary"><ChevronLeft size={12}/> Anterior</Button></PaginationItem><PaginationItem className="flex items-center justify-center min-w-[3rem] text-xs font-medium">{pagination.meta.currentPage} <span className="text-muted-foreground mx-1">/</span> {pagination.meta.totalPages}</PaginationItem><PaginationItem><Button variant="ghost" size="sm" disabled={!pagination.hasNext || tableLoading} onClick={() => changePage(pagination.page + 1)} className="gap-1 h-7 px-2 text-xs text-muted-foreground hover:text-primary">Próximo <ChevronRight size={12}/></Button></PaginationItem></PaginationContent></Pagination>
                            </div>
                        </div>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}