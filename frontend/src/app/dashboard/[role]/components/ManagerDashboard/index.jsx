"use client";

import React from 'react';
import { Menu, LayoutDashboard, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Componentes
import SidebarManager from '@/components/layout/sidebar-manager';
import ManagerStats from '@/components/dashboard/ManagerStats';

// Hook
import { useManagerDashboard } from '@/hooks/useManagerDashboard';

export default function ManagerDashboard() {
    const { stats, recentPedidos, recentOrcamentos, loading, refresh } = useManagerDashboard();

    // Helper para Badge de Status
    const StatusBadge = ({ status }) => {
        const s = String(status || '').toLowerCase();
        let style = "bg-slate-100 text-slate-700 border-slate-200";
        
        if (s.includes('aprovado') || s.includes('concluido')) style = "bg-green-100 text-green-700 border-green-200";
        else if (s.includes('negado') || s.includes('cancelado')) style = "bg-red-100 text-red-700 border-red-200";
        else if (s.includes('pendente') || s.includes('solicitado')) style = "bg-amber-100 text-amber-700 border-amber-200";
        else if (s.includes('orcamento') || s.includes('renegociacao')) style = "bg-blue-100 text-blue-700 border-blue-200";

        return (
            <Badge variant="outline" className={clsx("font-normal capitalize shadow-none", style)}>
                {status}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            
            {/* Sidebar Desktop */}
            <SidebarManager />

            {/* Conteúdo Principal */}
            <div className="flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
                
                {/* Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <SidebarManager />
                            </SheetContent>
                        </Sheet>
                        
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            Painel Gerencial
                        </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="gap-2">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        Atualizar
                    </Button>
                </header>

                <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                    
                    {/* 1. Estatísticas do Sistema */}
                    <ManagerStats stats={stats} loading={loading} />

                    {/* 2. Tabelas de Movimentação Recente */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        
                        {/* --- ÚLTIMOS PEDIDOS --- */}
                        <Card className="border shadow-sm overflow-hidden flex flex-col">
                            <CardHeader className="bg-muted/30 py-4 border-b flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-medium">Pedidos Recentes</CardTitle>
                                    <CardDescription>Últimas solicitações dos funcionários.</CardDescription>
                                </div>
                                <Button variant="link" size="sm" asChild className="text-primary hover:text-primary/80 px-0">
                                    <Link href="/dashboard/manager/pedidos">Ver todos <ArrowRight className="ml-1 h-4 w-4"/></Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow>
                                            <TableHead className="pl-6">Insumo (SKU)</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead className="text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({length:3}).map((_,i) => (
                                                <TableRow key={i}><TableCell colSpan={3} className="py-3 pl-6"><Skeleton className="h-6 w-full"/></TableCell></TableRow>
                                            ))
                                        ) : recentPedidos.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Nenhum pedido recente.</TableCell></TableRow>
                                        ) : (
                                            recentPedidos.map((p) => (
                                                <TableRow key={p.id || p._id} className="hover:bg-muted/50">
                                                    <TableCell className="pl-6 py-3 font-medium">
                                                        {p.insumoSKU || p.sku || "---"}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {p.createdAt ? format(new Date(p.createdAt), "dd/MM", {locale: ptBR}) : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <StatusBadge status={p.status || p.estado} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* --- ÚLTIMOS ORÇAMENTOS --- */}
                        <Card className="border shadow-sm overflow-hidden flex flex-col">
                            <CardHeader className="bg-muted/30 py-4 border-b flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-medium">Últimos Orçamentos</CardTitle>
                                    <CardDescription>Cotações enviadas pelo comprador.</CardDescription>
                                </div>
                                <Button variant="link" size="sm" asChild className="text-primary hover:text-primary/80 px-0">
                                    <Link href="/dashboard/manager/orcamentos">Ver todos <ArrowRight className="ml-1 h-4 w-4"/></Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow>
                                            <TableHead className="pl-6">Descrição</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead className="text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({length:3}).map((_,i) => (
                                                <TableRow key={i}><TableCell colSpan={3} className="py-3 pl-6"><Skeleton className="h-6 w-full"/></TableCell></TableRow>
                                            ))
                                        ) : recentOrcamentos.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Nenhum orçamento recente.</TableCell></TableRow>
                                        ) : (
                                            recentOrcamentos.map((o) => (
                                                <TableRow key={o.id || o._id} className="hover:bg-muted/50">
                                                    <TableCell className="pl-6 py-3 font-medium max-w-[150px] truncate" title={o.description}>
                                                        {o.description || `Orçamento #${o.id.slice(0,4)}`}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {o.valor_total ? 
                                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(o.valor_total) 
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <StatusBadge status={o.status} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
}