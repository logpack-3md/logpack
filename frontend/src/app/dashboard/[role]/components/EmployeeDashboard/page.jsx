"use client";

import React, { useState, useEffect } from 'react';
import { 
    Menu, Package, FileText, Clock, CheckCircle2, XCircle, 
    Warehouse, Search, Plus, LayoutDashboard, AlertCircle 
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

// Componentes do Projeto
import Sidebar from '@/components/layout/sidebar'; // Mantive seu import original
import InsumosSection from "@/components/Blocks/Insumos/InsumosSection";
import EstoqueSection from '@/components/Blocks/Estoque/SetoresSection';
import { useEmployeeOperations } from '@/hooks/useEmployeeOperations';

export default function EmployeeDashboard() {
    // 1. Hook de Lógica
    const { pedidos, loading, isSubmitting, fetchPedidos, criarSolicitacao } = useEmployeeOperations();
    
    // 2. Estados Locais de UI
    const [skuInput, setSkuInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile control

    // 3. Carregar dados ao montar
    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);

    // 4. Handler de Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const sucesso = await criarSolicitacao(skuInput);
        if (sucesso) {
            setSkuInput(''); // Limpa o input apenas se deu certo
        }
    };

    // Helper de Status Visual
    const getStatusBadge = (status) => {
        const s = (status || '').toString().toLowerCase();
        
        if (s.includes('aprovado')) 
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 gap-1"><CheckCircle2 size={12}/> Aprovado</Badge>;
        
        if (s.includes('rejeitado') || s.includes('negado')) 
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 gap-1"><XCircle size={12}/> Rejeitado</Badge>;
        
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 gap-1"><Clock size={12}/> Pendente</Badge>;
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-slate-900">
            
            {/* Sidebar Desktop (Wrapper para layout fixo) */}
            <div className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r bg-background z-30">
                <Sidebar />
            </div>

            {/* Conteúdo Principal */}
            <main className="flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
                
                {/* Header Mobile & Desktop */}
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                    
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5 text-blue-600" />
                        <h1 className="font-semibold text-lg">Painel do Funcionário</h1>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                    
                    {/* Seção 1: Boas vindas e Ação Rápida */}
                    <div className="grid gap-6 md:grid-cols-2">
                        
                        {/* Welcome */}
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Olá, Colaborador</h2>
                            <p className="text-muted-foreground">
                                Acompanhe o estoque e solicite insumos quando necessário.
                            </p>
                        </div>

                        {/* Card de Solicitação Rápida (Substitui o botão flutuante/modal antigo) */}
                        <Card className="border-blue-100 bg-blue-50/50 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                                    <Plus className="h-5 w-5" /> Solicitação Rápida
                                </CardTitle>
                                <CardDescription>Digite o SKU do item para pedir reposição.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Ex: INS-2024-001" 
                                            className="pl-9 bg-white border-blue-200 focus-visible:ring-blue-500"
                                            value={skuInput}
                                            onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {isSubmitting ? "Enviando..." : "Solicitar"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Seção 2: Meus Pedidos Recentes */}
                    <Card>
                        <CardHeader className="px-6 py-4 border-b">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-lg">Meus Pedidos Recentes</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-6 space-y-3">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : pedidos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                    <Package className="h-10 w-10 mb-2 opacity-20" />
                                    <p>Nenhuma solicitação realizada ainda.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="pl-6 w-[140px]">Data</TableHead>
                                            <TableHead>Item / SKU</TableHead>
                                            <TableHead className="text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pedidos.slice(0, 5).map((pedido) => (
                                            <TableRow key={pedido.id || pedido._id}>
                                                <TableCell className="pl-6 text-muted-foreground text-sm">
                                                    {pedido.createdAt 
                                                        ? format(new Date(pedido.createdAt), "dd MMM, HH:mm", { locale: ptBR }) 
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">
                                                            {pedido.insumo?.nome || pedido.insumoNome || 'Insumo Geral'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {pedido.insumoSKU || pedido.sku || 'SKU N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end">
                                                        {getStatusBadge(pedido.status || pedido.estado)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Seção 3: Grid de Informações (Insumos e Estoque) */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Insumos Disponíveis */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-base font-semibold">Catálogo de Insumos</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Componente Existente Importado */}
                                <InsumosSection />
                            </CardContent>
                        </Card>

                        {/* Visão de Setores/Estoque */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Warehouse className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-base font-semibold">Estoque por Setor</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Componente Existente Importado */}
                                <EstoqueSection />
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}