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
    Filter,
    RefreshCw
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    
    // --- ESTADOS DE FILTRO E PAGINAÇÃO ---
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos'); // Filtro de Status
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- ESTADOS DE AÇÃO ---
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [skuInput, setSkuInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionDialog, setActionDialog] = useState({ open: false, type: null, item: null });

    // 1. Carregamento Inicial e Debounce da Busca
    useEffect(() => {
        const timer = setTimeout(() => {
            // Nota: Se o hook fetchPedidos não aceitar status diretamente, 
            // a filtragem pode precisar ocorrer via 'search' ou atualização do hook.
            // Aqui passamos currentPage e search.
            fetchPedidos(currentPage, 10, search); 
        }, 500);
        return () => clearTimeout(timer);
    }, [search, currentPage, fetchPedidos]);

    // Filtra visualmente os dados recebidos (caso a API não suporte status no endpoint atual do hook)
    const filteredPedidos = pedidos.filter(p => {
        if (statusFilter === 'todos') return true;
        return (p.status || '').toLowerCase() === statusFilter;
    });

    // 2. Manipuladores de Filtros
    const handleRefresh = () => {
        fetchPedidos(currentPage, 10, search);
        toast.info("Lista atualizada");
    };

    const handleStatusChange = (val) => {
        setStatusFilter(val);
        setCurrentPage(1); // Volta para a primeira página ao filtrar
    };

    // 3. Ações do Sistema
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await createPedido(skuInput);
        setIsSubmitting(false);
        if (success) {
            setIsCreateOpen(false);
            setSkuInput('');
            fetchPedidos(1, 10, search);
        }
    };

    const handleStatusUpdate = async () => {
        const { type, item } = actionDialog;
        if (!item) return;

        setIsSubmitting(true);
        try {
            const newStatus = type === 'approve' ? 'aprovado' : 'negado';
            
            const res = await api.put(`manager/pedido/status/${item.id}`, { 
                status: newStatus 
            });

            if (res && res.success === false) {
                throw new Error(res.error || res.message);
            }

            toast.success(`Pedido ${type === 'approve' ? 'aprovado' : 'negado'} com sucesso!`);
            fetchPedidos(currentPage, 10, search); // Recarrega mantendo a página
            setActionDialog({ open: false, type: null, item: null });

        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar status do pedido.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (p) => {
        if (p >= 1 && p <= meta.totalPages) {
            setCurrentPage(p);
        }
    };

    const openActionDialog = (e, type, item) => {
        e.stopPropagation();
        setActionDialog({ open: true, type, item });
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            
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
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">Pedidos de Insumos</h1>
                            <p className="text-muted-foreground">Acompanhe, filtre e decida sobre as solicitações.</p>
                        </div>
                        <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
                        </Button>
                    </div>

                    {/* BARRA DE FILTROS E PESQUISA */}
                    <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between">
                        
                        {/* Busca Texto */}
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar por SKU..." 
                                className="pl-9 bg-background border-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filtros e Ações */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full md:w-[180px] bg-background">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="solicitado">Pendente</SelectItem>
                                    <SelectItem value="aprovado">Aprovado</SelectItem>
                                    <SelectItem value="negado">Negado</SelectItem>
                                    <SelectItem value="compra_iniciada">Em Compra</SelectItem>
                                    <SelectItem value="compra_efetuada">Concluído</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="icon" onClick={handleRefresh} title="Atualizar">
                                <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                            </Button>
                        </div>
                    </div>

                    {/* TABELA DE PEDIDOS */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-b border-border">
                                    <TableHead className="w-[100px] pl-6 font-medium text-muted-foreground">ID</TableHead>
                                    <TableHead className="font-medium text-muted-foreground">Insumo (SKU)</TableHead>
                                    <TableHead className="font-medium text-muted-foreground">Data da Solicitação</TableHead>
                                    <TableHead className="text-center font-medium text-muted-foreground">Status</TableHead>
                                    <TableHead className="text-right pr-6 font-medium text-muted-foreground">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({length: 5}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={5} className="py-4 px-6">
                                                <Skeleton className="h-12 w-full rounded-md" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredPedidos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-muted/50 rounded-full border border-border/50">
                                                    <Package className="h-10 w-10 opacity-30" />
                                                </div>
                                                <p className="text-sm font-medium">Nenhum pedido encontrado com este filtro.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPedidos.map((pedido) => {
                                        const isPending = pedido.status === 'solicitado' || pedido.status === 'pendente';
                                        
                                        return (
                                            <TableRow 
                                                key={pedido.id} 
                                                className="hover:bg-muted/50 transition-colors cursor-pointer group border-b border-border last:border-0"
                                                onClick={() => router.push(`/dashboard/manager/pedidos/${pedido.id}`)}
                                            >
                                                <TableCell className="pl-6 py-4 font-mono text-xs text-muted-foreground">
                                                    #{pedido.id.slice(0,8)}
                                                </TableCell>
                                                
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-background font-mono text-xs border-border px-2 py-1 shadow-sm">
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
                                                        <CalendarDays className="h-3.5 w-3.5 opacity-70" />
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
                                                                            variant="ghost"
                                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 border border-transparent hover:border-green-200"
                                                                            onClick={(e) => openActionDialog(e, 'approve', pedido)}
                                                                        >
                                                                            <CheckCircle2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Aprovar</p></TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button 
                                                                            size="icon" 
                                                                            variant="ghost"
                                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 border border-transparent hover:border-red-200"
                                                                            onClick={(e) => openActionDialog(e, 'deny', pedido)}
                                                                        >
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>Negar</p></TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    ) : (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:bg-muted cursor-default">
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

                        {/* Paginação Fixada ao Fundo da Tabela */}
                        <div className="mt-auto border-t border-border bg-muted/10 p-4 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                Total: {meta.totalItems} registro(s)
                            </span>
                            
                            {meta.totalPages > 1 && (
                                <Pagination className="mx-0 w-auto">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => handlePageChange(meta.currentPage - 1)} 
                                                className={clsx("cursor-pointer h-8 w-8 p-0", meta.currentPage <= 1 && "pointer-events-none opacity-50")} 
                                            />
                                        </PaginationItem>
                                        
                                        <PaginationItem>
                                            <PaginationLink isActive className="h-8 w-8 border-primary text-primary font-bold">
                                                {meta.currentPage}
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="text-muted-foreground text-sm px-1">
                                            / {meta.totalPages}
                                        </PaginationItem>

                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => handlePageChange(meta.currentPage + 1)} 
                                                className={clsx("cursor-pointer h-8 w-8 p-0", meta.currentPage >= meta.totalPages && "pointer-events-none opacity-50")} 
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL CRIAR SOLICITAÇÃO */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Solicitação Manual</DialogTitle>
                        <DialogDescription>
                            Gere uma ordem de pedido manualmente.
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
                                className="uppercase font-mono tracking-widest"
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

            {/* MODAL CONFIRMAÇÃO DE STATUS */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className={clsx("flex items-center gap-2", actionDialog.type === 'deny' ? "text-red-600" : "text-emerald-600")}>
                            {actionDialog.type === 'approve' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            {actionDialog.type === 'approve' ? "Aprovar Solicitação?" : "Negar Solicitação?"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.type === 'approve' 
                                ? "O pedido avançará para a etapa de cotação com o comprador."
                                : "O pedido será encerrado. Esta ação não pode ser desfeita."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-2 px-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-sm font-medium">Insumo: {actionDialog.item?.displaySku}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: #{actionDialog.item?.id.slice(0,8)}</p>
                    </div>

                    <DialogFooter className="mt-2">
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

const StatusBadge = ({ status }) => {
    const s = (status || '').toLowerCase();
    
    let style = "bg-muted text-muted-foreground border-border";
    let label = status || "N/A";
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
        label = "Pendente";
        Icon = Info;
    }

    return (
        <Badge variant="outline" className={clsx("font-normal shadow-none border px-2.5 py-0.5 gap-1.5", style)}>
            <Icon className="h-3 w-3" />
            <span className="capitalize">{label}</span>
        </Badge>
    );
};