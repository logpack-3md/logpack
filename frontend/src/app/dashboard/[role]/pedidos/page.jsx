"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    Menu, 
    Loader2, 
    Truck, 
    CalendarDays, 
    MoreHorizontal, 
    Package,
    CheckCircle2, 
    XCircle,
    Info,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster, toast } from 'sonner';

// SHADCN UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from "@/components/ui/tooltip";

// CUSTOM COMPONENTS & HOOKS
import SidebarManager from "@/components/layout/sidebar-manager";
import { useManagerOrders } from "@/hooks/useManagerOrders";
import { api } from '@/lib/api';

export default function PedidosManagerPage() {
    const router = useRouter();
    const { pedidos, meta, loading, fetchPedidos, createPedido } = useManagerOrders();
    
    // Estados Locais
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [skuInput, setSkuInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para Modais de Ação (Aprovar/Negar)
    const [actionDialog, setActionDialog] = useState({ open: false, type: null, item: null });

    // Carregamento inicial e busca com debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPedidos(1, 10, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, fetchPedidos]);

    // Criação de nova solicitação (manual pelo gerente)
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await createPedido(skuInput);
        setIsSubmitting(false);
        if (success) {
            setIsCreateOpen(false);
            setSkuInput('');
            fetchPedidos(1, 10, search); // Atualiza lista
        }
    };

    // Ação de Aprovar/Negar
    const handleStatusUpdate = async () => {
        const { type, item } = actionDialog;
        if (!item) return;

        setIsSubmitting(true);
        try {
            // Define o status baseado no tipo de ação
            const newStatus = type === 'approve' ? 'aprovado' : 'negado';
            
            const res = await api.put(`manager/pedido/status/${item.id}`, { 
                status: newStatus 
            });

            if (res && res.success === false) {
                throw new Error(res.error || res.message);
            }

            toast.success(`Pedido ${type === 'approve' ? 'aprovado' : 'negado'} com sucesso!`);
            fetchPedidos(meta.currentPage, 10, search); // Recarrega a página atual
            setActionDialog({ open: false, type: null, item: null });

        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar status do pedido.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (p) => {
        if (p >= 1 && p <= meta.totalPages) fetchPedidos(p, 10, search);
    };

    const openActionDialog = (e, type, item) => {
        e.stopPropagation(); // Evita navegar para detalhes ao clicar no botão
        setActionDialog({ open: true, type, item });
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            
            {/* Sidebar Fixa */}
            <SidebarManager />

            <div className="flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
                
                {/* Header */}
                <header className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur px-6 flex items-center justify-between shadow-sm">
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
                        
                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
                            <Truck className="h-5 w-5 text-primary" />
                            Gestão de Pedidos
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
                    
                    {/* Cabeçalho da Página */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Pedidos de Insumos</h1>
                            <p className="text-muted-foreground mt-1">Aprove ou negue solicitações de reposição vindas do estoque.</p>
                        </div>
                        <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Solicitação Manual
                        </Button>
                    </div>

                    {/* Filtros e Busca */}
                    <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar por SKU..." 
                                className="pl-9 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tabela de Listagem */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-b border-border">
                                    <TableHead className="w-[100px] pl-6 font-medium">ID</TableHead>
                                    <TableHead className="font-medium">Insumo (SKU)</TableHead>
                                    <TableHead className="font-medium">Data da Solicitação</TableHead>
                                    <TableHead className="text-center font-medium">Status</TableHead>
                                    <TableHead className="text-right pr-6 font-medium">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({length: 5}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={5} className="py-4 px-6">
                                                <Skeleton className="h-10 w-full rounded-md" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : pedidos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-muted/50 rounded-full">
                                                    <Package className="h-8 w-8 opacity-40" />
                                                </div>
                                                <p className="text-sm font-medium">Nenhuma solicitação encontrada.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pedidos.map((pedido) => {
                                        const isPending = pedido.status === 'solicitado' || pedido.status === 'pendente';
                                        
                                        return (
                                            <TableRow 
                                                key={pedido.id} 
                                                className="hover:bg-muted/50 transition-colors cursor-pointer group border-b border-border"
                                                onClick={() => router.push(`/dashboard/manager/pedidos/${pedido.id}`)}
                                            >
                                                <TableCell className="pl-6 py-4 font-mono text-xs text-muted-foreground">
                                                    #{pedido.id.slice(0,8)}
                                                </TableCell>
                                                
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-background font-mono text-xs border-border px-2 py-1">
                                                            {pedido.displaySku || pedido.sku}
                                                        </Badge>
                                                        {pedido.displayInsumoName && (
                                                            <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                                                                {pedido.displayInsumoName}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell className="py-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        {pedido.createdAt ? format(new Date(pedido.createdAt), "dd MMM, HH:mm", {locale: ptBR}) : '-'}
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell className="py-4 text-center">
                                                    <StatusBadge status={pedido.status} />
                                                </TableCell>

                                                <TableCell className="py-4 text-right pr-6">
                                                    {isPending ? (
                                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button 
                                                                            size="icon" 
                                                                            className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-sm"
                                                                            onClick={(e) => openActionDialog(e, 'approve', pedido)}
                                                                        >
                                                                            <CheckCircle2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Aprovar Pedido</p></TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button 
                                                                            size="icon" 
                                                                            className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200 border-red-200 shadow-sm"
                                                                            onClick={(e) => openActionDialog(e, 'deny', pedido)}
                                                                        >
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Negar Pedido</p></TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    ) : (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Paginação */}
                        {meta.totalPages > 1 && (
                            <div className="p-4 border-t border-border flex justify-end">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => handlePageChange(meta.currentPage - 1)} 
                                                className={clsx("cursor-pointer", meta.currentPage <= 1 && "pointer-events-none opacity-50")} 
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink isActive>{meta.currentPage}</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => handlePageChange(meta.currentPage + 1)} 
                                                className={clsx("cursor-pointer", meta.currentPage >= meta.totalPages && "pointer-events-none opacity-50")} 
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODAL 1: CRIAR SOLICITAÇÃO MANUAL --- */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Solicitação Manual</DialogTitle>
                        <DialogDescription>
                            Crie um pedido manualmente caso o sistema automático falhe.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU do Insumo</Label>
                            <Input 
                                id="sku" 
                                placeholder="Ex: PAP-A4" 
                                value={skuInput} 
                                onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
                                className="uppercase font-mono"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Pedido"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL 2: CONFIRMAR APROVAÇÃO/NEGAÇÃO --- */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className={clsx("flex items-center gap-2", actionDialog.type === 'deny' ? "text-red-600" : "text-emerald-600")}>
                            {actionDialog.type === 'approve' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            {actionDialog.type === 'approve' ? "Aprovar Solicitação" : "Negar Solicitação"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.type === 'approve' 
                                ? "O status será alterado para 'Aprovado'. Você poderá iniciar a compra nos detalhes do pedido."
                                : "O pedido será cancelado definitivamente e o solicitante será notificado."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <p className="text-sm font-medium text-foreground">
                            Insumo: <span className="font-mono text-muted-foreground">{actionDialog.item?.displaySku || actionDialog.item?.sku}</span>
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog({ ...actionDialog, open: false })}>Cancelar</Button>
                        <Button 
                            disabled={isSubmitting} 
                            className={clsx(
                                actionDialog.type === 'approve' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700",
                                "text-white"
                            )}
                            onClick={handleStatusUpdate}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// Componente Badge de Status Padronizado
const StatusBadge = ({ status }) => {
    const s = (status || '').toLowerCase();
    
    let style = "bg-muted text-muted-foreground border-border";
    let label = status || "Desconhecido";
    let Icon = Info;

    if (s.includes('aprovado')) {
        style = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
        label = "Aprovado";
        Icon = CheckCircle2;
    } else if (s.includes('negado')) {
        style = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400";
        label = "Negado";
        Icon = XCircle;
    } else if (s.includes('compra_efetuada') || s.includes('concluido')) {
        style = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400";
        label = "Concluído";
        Icon = CheckCircle2;
    } else if (s.includes('compra_iniciada')) {
        style = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
        label = "Em Compra";
        Icon = Truck;
    } else {
        style = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
        label = "Solicitado";
        Icon = Filter;
    }

    return (
        <Badge variant="outline" className={clsx("font-normal shadow-none border px-2.5 py-0.5 gap-1.5", style)}>
            <Icon className="h-3 w-3" />
            <span className="capitalize">{label}</span>
        </Badge>
    );
};