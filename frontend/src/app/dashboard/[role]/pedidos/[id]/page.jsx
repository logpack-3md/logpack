"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Package, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Imports
// import SidebarManager, { SidebarContent } from "@/components/layout/sidebar-manager";
import { useManagerOrders } from "@/hooks/useManagerOrders";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function PedidoDetalhePage() {
    const { id } = useParams();
    const router = useRouter();
    const { pedidoAtual, fetchPedidoById, loading } = useManagerOrders();

    useEffect(() => {
        if (id) fetchPedidoById(id);
    }, [id, fetchPedidoById]);

    if (loading && !pedidoAtual) {
        return <LoadingSkeleton />;
    }

    if (!loading && !pedidoAtual) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/30">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Pedido não encontrado</h2>
                    <Button variant="link" onClick={() => router.push('/dashboard/manager/pedidos')}>Voltar</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <SidebarManager />
            
            <div className="flex flex-col lg:ml-64 min-h-screen transition-all">
                {/* Header Mobile Only */}
                <div className="lg:hidden p-4 border-b bg-background flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64"><SidebarContent /></SheetContent>
                    </Sheet>
                    <span className="font-bold">Detalhes do Pedido</span>
                </div>

                <div className="p-6 md:p-10 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Botão Voltar */}
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push('/dashboard/manager/pedidos')}
                        className="mb-6 hover:bg-transparent hover:text-indigo-600 pl-0 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Voltar à lista
                    </Button>

                    {/* Card Principal com Gradiente */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                        
                        {/* Header Gradiente (Estilo Original Preservado) */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Package className="w-64 h-64" />
                            </div>
                            
                            <div className="relative z-10">
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                    Pedido #{pedidoAtual.id.slice(0, 8)}
                                </h1>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm md:text-base font-medium">
                                    <span className="uppercase tracking-wide">{pedidoAtual.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo do Detalhe */}
                        <div className="p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-12">
                                
                                {/* Coluna Esquerda: Info */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Item Solicitado
                                        </h3>
                                        <div className="text-4xl font-black text-slate-900 break-words">
                                            {pedidoAtual.insumoSKU}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Data da Solicitação
                                        </h3>
                                        <div className="flex items-center gap-3 text-slate-700 text-lg">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Calendar className="h-6 w-6 text-slate-500" />
                                            </div>
                                            <span className="font-medium">
                                                {format(new Date(pedidoAtual.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Adicionar ID do solicitante se houver */}
                                    {pedidoAtual.userId && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-sm text-slate-500">Solicitado por ID: <span className="font-mono">{pedidoAtual.userId}</span></p>
                                        </div>
                                    )}
                                </div>

                                {/* Coluna Direita: Status Visual */}
                                <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">
                                            {pedidoAtual.status === 'aprovado' && '✅'}
                                            {pedidoAtual.status === 'negado' && '❌'}
                                            {(pedidoAtual.status === 'solicitado' || pedidoAtual.status === 'pendente') && '⏳'}
                                            {pedidoAtual.status === 'compra_iniciada' && '🚚'}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 capitalize">
                                            {pedidoAtual.status.replace('_', ' ')}
                                        </h3>
                                        <p className="text-slate-500 mt-2">Status atual do processo</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-muted/30 p-10 flex items-center justify-center">
            <div className="space-y-4 w-full max-w-3xl">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
        </div>
    );
}