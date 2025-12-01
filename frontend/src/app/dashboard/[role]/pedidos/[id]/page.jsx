"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, CalendarDays, Package, AlertCircle, 
    CheckCircle2, XCircle, Clock, Truck, User, Menu,
    ThumbsUp, ThumbsDown, DollarSign, FileText, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// COMPONENTES
import SidebarManager from "@/components/layout/sidebar-manager";
import { useManagerOrders } from "@/hooks/useManagerOrders";

export default function PedidoDetalhePage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchPedidoById, pedidoAtual, loading, isSubmitting, denyPedido, createCompra } = useManagerOrders();

    // Estados de Controle dos Modais
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isDenyOpen, setIsDenyOpen] = useState(false);

    // Formulário de Compra
    const [compraForm, setCompraForm] = useState({ description: '', amount: '' });

    useEffect(() => {
        if (id) fetchPedidoById(id);
    }, [id, fetchPedidoById]);

    // Handlers
    const handleDeny = async () => {
        const success = await denyPedido(id);
        if (success) setIsDenyOpen(false);
    };

    const handleApproveSubmit = async () => {
        const success = await createCompra(id, compraForm);
        if (success) {
            setIsApproveOpen(false);
            setCompraForm({ description: '', amount: '' });
        }
    };

    // Configuração Visual do Status
    const statusConfig = useMemo(() => {
        if (!pedidoAtual) return {};
        const s = String(pedidoAtual.status || '').toLowerCase();
        
        if (s.includes('aprovado') || s.includes('concluido')) return { label: 'Aprovado', color: 'bg-emerald-500', icon: CheckCircle2 };
        if (s.includes('negado') || s.includes('cancelado')) return { label: 'Negado', color: 'bg-red-500', icon: XCircle };
        if (s.includes('compra_iniciada')) return { label: 'Em Compra', color: 'bg-blue-500', icon: Truck };
        return { label: 'Solicitado', color: 'bg-amber-500', icon: Clock };
    }, [pedidoAtual]);

    if (loading && !pedidoAtual) return <LoadingState />;
    if (!loading && !pedidoAtual) return <NotFoundState router={router} />;

    const StatusIcon = statusConfig.icon;
    // Verifica se o pedido ainda está pendente para mostrar os botões
    const isPending = ['solicitado', 'pendente'].includes(pedidoAtual.status?.toLowerCase());

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            <SidebarManager />

            <div className="flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
                
                {/* Header Mobile */}
                <div className="lg:hidden sticky top-0 z-20 p-4 border-b bg-background/95 backdrop-blur flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button></SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64"><SidebarManager /></SheetContent>
                    </Sheet>
                    <span className="font-bold text-lg">Detalhes do Pedido</span>
                </div>

                <main className="p-6 md:p-10 max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500 fade-in">
                    
                    <Button variant="ghost" onClick={() => router.push('/dashboard/manager/pedidos')} className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à gestão de pedidos
                    </Button>

                    {/* CARD PRINCIPAL */}
                    <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
                        
                        {/* HEADER GRADIENTE */}
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 md:p-12 text-white relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-12 opacity-10 rotate-12 pointer-events-none"><Package className="w-64 h-64" /></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <p className="text-blue-100 font-medium text-sm uppercase tracking-wider mb-1">Solicitação Interna</p>
                                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">#{pedidoAtual.id.slice(0, 8).toUpperCase()}</h1>
                                </div>
                                
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
                                    <StatusIcon className="w-5 h-5 text-white" />
                                    <span className="font-bold uppercase tracking-wide text-sm">{statusConfig.label}</span>
                                </div>
                            </div>
                        </div>

                        {/* CONTEÚDO */}
                        <div className="p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                
                                {/* INFO DO PEDIDO */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Item Solicitado (SKU)</h3>
                                        <div className="text-4xl font-black text-foreground break-all tracking-tight">{pedidoAtual.insumoSKU || pedidoAtual.sku}</div>
                                        {pedidoAtual.insumo?.name && <p className="text-lg text-muted-foreground mt-1 font-medium">{pedidoAtual.insumo.name}</p>}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Data da Solicitação</h3>
                                        <div className="flex items-center gap-3 text-lg">
                                            <div className="p-2 bg-muted rounded-lg"><CalendarDays className="h-6 w-6 text-muted-foreground" /></div>
                                            <span className="font-medium">{pedidoAtual.createdAt ? format(new Date(pedidoAtual.createdAt), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR }) : '--'}</span>
                                        </div>
                                    </div>
                                    
                                    {pedidoAtual.userId && (
                                        <div className="pt-6 border-t border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100"><User className="h-5 w-5" /></div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground">Solicitado por ID</span>
                                                    <span className="text-xs font-mono text-muted-foreground">{pedidoAtual.userId}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* AÇÕES DO GERENTE */}
                                <div className="flex flex-col justify-center items-center bg-muted/30 rounded-2xl p-8 border border-border">
                                    {isPending ? (
                                        <div className="w-full space-y-4 text-center">
                                            <h3 className="text-lg font-semibold text-foreground mb-4">Decisão do Gerente</h3>
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <Button 
                                                    onClick={() => setIsDenyOpen(true)}
                                                    variant="outline" 
                                                    className="h-14 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 flex flex-col gap-1"
                                                >
                                                    <ThumbsDown className="h-5 w-5" />
                                                    Negar
                                                </Button>
                                                <Button 
                                                    onClick={() => setIsApproveOpen(true)}
                                                    className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 flex flex-col gap-1"
                                                >
                                                    <ThumbsUp className="h-5 w-5" />
                                                    Aprovar
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-4">
                                                Ao aprovar, você deverá configurar a ordem de compra.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className={`w-24 h-24 rounded-full ${statusConfig.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                                                <StatusIcon className="w-12 h-12" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground capitalize">{pedidoAtual.status.replace('_', ' ')}</h3>
                                            <p className="text-muted-foreground mt-1">Este pedido já foi processado.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL 1: NEGAR PEDIDO (AlertDialog) --- */}
            <AlertDialog open={isDenyOpen} onOpenChange={setIsDenyOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Negar Solicitação?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação irá cancelar o pedido definitivamente e notificar o funcionário.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeny} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSubmitting ? "Processando..." : "Confirmar Negação"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* --- MODAL 2: APROVAR E CRIAR COMPRA (Dialog) --- */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
                            Criar Ordem de Compra
                        </DialogTitle>
                        <DialogDescription>
                            Defina os detalhes para o comprador iniciar a cotação.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        
                        {/* Input: Quantidade */}
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="flex justify-between">
                                Quantidade Solicitada
                                <span className="text-xs text-muted-foreground font-normal">Múltiplos de 200</span>
                            </Label>
                            <div className="relative">
                                <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="Ex: 200, 400, 600..." 
                                    className="pl-9"
                                    value={compraForm.amount}
                                    onChange={(e) => setCompraForm({...compraForm, amount: e.target.value})}
                                />
                            </div>
                            {compraForm.amount && (Number(compraForm.amount) % 200 !== 0 || Number(compraForm.amount) < 200) && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Valor inválido. Deve ser min. 200 e múltiplo de 200.
                                </p>
                            )}
                        </div>

                        {/* Input: Descrição */}
                        <div className="space-y-2">
                            <Label htmlFor="desc">Descrição / Instruções para o Comprador</Label>
                            <div className="relative">
                                <Textarea 
                                    id="desc"
                                    placeholder="Detalhes sobre marca, urgência ou fornecedor preferencial..." 
                                    className="min-h-[100px] resize-none pl-9"
                                    value={compraForm.description}
                                    onChange={(e) => setCompraForm({...compraForm, description: e.target.value})}
                                />
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                {compraForm.description.length}/10 caracteres min.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button 
                            onClick={handleApproveSubmit} 
                            disabled={isSubmitting} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isSubmitting ? "Enviando..." : "Confirmar Compra"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// Skeleton Loader
function LoadingState() {
    return (
        <div className="min-h-screen bg-muted/40 p-8 flex flex-col lg:ml-64 items-center justify-center">
             <Skeleton className="h-8 w-48 mb-8 self-start" />
             <Skeleton className="h-[500px] w-full max-w-5xl rounded-3xl" />
        </div>
    );
}

function NotFoundState({ router }) {
    return (
        <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-full inline-block shadow-sm">
                    <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Pedido não encontrado</h2>
                <Button variant="link" onClick={() => router.push('/dashboard/manager/pedidos')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à lista
                </Button>
            </div>
        </div>
    );
}