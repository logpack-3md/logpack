"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Menu, Truck, Calendar, 
    MoreHorizontal, CheckCircle2, XCircle, 
    Filter, RefreshCw, PackageX, Inbox, 
    ShoppingBag, Box, User, Clock, Package, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster } from 'sonner';

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Logic
import SidebarManager from "@/components/layout/sidebar-manager";
import { useManagerOrders } from "@/hooks/useManagerOrders";

export default function PedidosManagerPage() {
    const router = useRouter();
    const isFirstRun = useRef(true);
    
    const { 
        pedidos, loading, isSubmitting, pagination, 
        fetchPedidos, updateStatus, createCompra, getPedidoDetails
    } = useManagerOrders();
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [actionDialog, setActionDialog] = useState({ open: false, type: null, item: null });
    const [buyDialog, setBuyDialog] = useState({ open: false, item: null });
    const [buyForm, setBuyForm] = useState({ amount: '', description: '' });
    const [detailDialog, setDetailDialog] = useState({ open: false, isLoading: false, data: null });

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
            return;
        }
        const timer = setTimeout(() => {
            fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter, pagination.page, pagination.limit, fetchPedidos]);

    const handleRefresh = () => fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
    const handleLimitChange = (val) => fetchPedidos(1, parseInt(val), search, statusFilter);
    const handlePageChange = (newPage) => fetchPedidos(newPage, pagination.limit, search, statusFilter);

    // Handlers
    const handleOpenDetails = async (pedidoSimples) => {
        setDetailDialog({ open: true, isLoading: true, data: pedidoSimples });
        const completeData = await getPedidoDetails(pedidoSimples.id, pedidoSimples.sku);
        setDetailDialog({
            open: true,
            isLoading: false,
            data: completeData || pedidoSimples 
        });
    };

    const openActionDialog = (e, type, item) => {
        if(e) e.stopPropagation();
        setDetailDialog(prev => ({...prev, open: false})); 
        setActionDialog({ open: true, type, item });
    };

    const confirmStatusUpdate = async () => {
        if (!actionDialog.item) return;
        const newStatus = actionDialog.type === 'approve' ? 'aprovado' : 'negado';
        const success = await updateStatus(actionDialog.item.id, newStatus);
        if (success) {
            setActionDialog({ open: false, type: null, item: null });
            fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
        }
    };

    const openBuyDialog = (e, item) => {
        if(e) e.stopPropagation();
        setDetailDialog(prev => ({...prev, open: false})); 
        setBuyDialog({ open: true, item });
        setBuyForm({ amount: '', description: '' }); 
    };

    const handleSubmitCompra = async () => {
        if(!buyDialog.item) return;
        const success = await createCompra(buyDialog.item.id, buyForm);
        if (success) {
            setBuyDialog({ open: false, item: null });
            setBuyForm({ amount: '', description: '' });
            fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
        }
    };

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            <SidebarManager />

            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button></SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64"><SidebarManager /></SheetContent>
                        </Sheet>
                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground"><Truck className="h-5 w-5 text-primary" /><span>Pedidos</span></div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} /><span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                <main className="flex flex-1 flex-col p-6 md:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                        <div className="space-y-1"><h1 className="text-2xl font-bold tracking-tight">Solicitações de Insumo</h1><p className="text-sm text-muted-foreground">Gerencie o fluxo de reposição do estoque.</p></div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
                        <div className="relative w-full md:w-1/3"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar SKU..." className="pl-9 bg-background border-input" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); fetchPedidos(1, pagination.limit, search, val); }}>
                                <SelectTrigger className="w-full md:w-[180px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="solicitado">Solicitado</SelectItem>
                                    <SelectItem value="aprovado">Aprovado</SelectItem>
                                    <SelectItem value="compra_iniciada">Em Compra</SelectItem>
                                    <SelectItem value="compra_efetuada">Concluído</SelectItem>
                                    <SelectItem value="negado">Negados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="flex-1 overflow-auto scrollbar-thin">
                            <Table>
                                <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                                    <TableRow className="border-b border-border/60 hover:bg-transparent">
                                        <TableHead className="w-[120px] pl-6 h-12">ID</TableHead>
                                        <TableHead>Insumo (SKU)</TableHead>
                                        <TableHead>Data da Solicitação</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({length: Math.min(pagination.limit, 8)}).map((_, i) => (<TableRow key={i}><TableCell colSpan={5} className="p-4 px-6"><Skeleton className="h-10 w-full rounded-lg" /></TableCell></TableRow>))
                                    ) : pedidos.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-[400px]"><div className="flex flex-col items-center justify-center text-muted-foreground"><div className="p-6 bg-muted/30 rounded-full mb-3 border border-border/50"><Inbox className="h-10 w-10 opacity-30"/></div><p className="font-medium text-foreground">Sem pedidos.</p></div></TableCell></TableRow>
                                    ) : (
                                        pedidos.map((pedido) => (
                                            <PedidoRow 
                                                key={pedido.id} 
                                                pedido={pedido} 
                                                onRowClick={() => handleOpenDetails(pedido)}
                                                onOpenActionDialog={openActionDialog} 
                                                onOpenBuyDialog={openBuyDialog}
                                            />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                            <div className="flex items-center gap-6 text-sm text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                                <span>Total: <span className="font-semibold text-foreground">{pagination.meta.totalItems}</span></span>
                                <div className="flex items-center gap-2"><span className="hidden sm:inline">Exibir:</span><Select value={String(pagination.limit)} onValueChange={handleLimitChange} disabled={loading}><SelectTrigger className="h-8 w-[70px] bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
                            </div>
                            <Pagination className="w-auto mx-0"><PaginationContent className="gap-1"><PaginationItem><Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="gap-1 h-8 px-3"><ChevronLeft className="h-4 w-4" /> Anterior</Button></PaginationItem><PaginationItem className="flex items-center justify-center min-w-[3rem] text-sm font-medium">{pagination.meta.currentPage} <span className="text-muted-foreground mx-1">/</span> {pagination.meta.totalPages}</PaginationItem><PaginationItem><Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.meta.totalPages || loading} className="gap-1 h-8 px-3">Próximo <ChevronRight className="h-4 w-4" /></Button></PaginationItem></PaginationContent></Pagination>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL DETALHES COMPLETO --- */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({...detailDialog, open: false})}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-card border-border shadow-2xl">
                    <div className={clsx("px-6 py-4 flex items-center justify-between border-b border-border", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Pedido #{detailDialog.data?.id.slice(0,8)}</span>
                            <DialogTitle className="font-semibold text-lg leading-none">Detalhes da Solicitação</DialogTitle>
                        </div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>

                    <div className="p-6">
                        {detailDialog.isLoading ? (
                            <div className="space-y-6">
                                <div className="flex gap-6">
                                    <Skeleton className="h-32 w-32 rounded-xl" />
                                    <div className="flex-1 space-y-2"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-full" /></div>
                                </div>
                            </div>
                        ) : detailDialog.data ? (
                            <div className="grid md:grid-cols-[200px_1fr] gap-8">
                                
                                {/* Componente de Imagem com Fallback para Ícone */}
                                <div className="space-y-4">
                                    <InsumoImage 
                                        src={detailDialog.data.fullInsumo?.image} 
                                        alt={detailDialog.data.sku}
                                        sku={detailDialog.data.fullInsumo?.SKU || detailDialog.data.sku} 
                                    />

                                    {/* Indicador de Estoque */}
                                    {detailDialog.data.fullInsumo ? (
                                        <div className="bg-muted/40 p-3 rounded-lg border border-border space-y-2">
                                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                                <span>Estoque</span>
                                                <span>{detailDialog.data.fullInsumo.current_storage} / {detailDialog.data.fullInsumo.max_storage}</span>
                                            </div>
                                            <Progress 
                                                value={(detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) * 100} 
                                                className="h-1.5"
                                                indicatorClassName={
                                                    (detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) < 0.35 
                                                    ? "bg-red-500" : "bg-emerald-500"
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-lg border border-dashed text-xs text-center text-muted-foreground">
                                            Sem dados de estoque.
                                        </div>
                                    )}
                                </div>

                                {/* Coluna 2: Dados */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                                            {detailDialog.data.fullInsumo?.name || detailDialog.data.insumoName || "Nome do Insumo"}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="font-mono">{detailDialog.data.sku}</Badge>
                                            {detailDialog.data.fullInsumo && <Badge variant="secondary">{detailDialog.data.fullInsumo.setorName || "N/A"}</Badge>}
                                        </div>
                                    </div>

                                    <div className="bg-muted/10 p-4 rounded-xl border border-border/60">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Descrição</span>
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            {detailDialog.data.fullInsumo?.description || "Descrição indisponível."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-xs text-muted-foreground uppercase font-bold">Solicitante ID</span><div className="flex items-center gap-2 mt-1 font-medium"><User className="w-4 h-4 text-primary" /> {detailDialog.data.requesterId || '---'}</div></div>
                                        <div><span className="text-xs text-muted-foreground uppercase font-bold">Data Solicitação</span><div className="flex items-center gap-2 mt-1 font-medium"><Clock className="w-4 h-4 text-primary" /> {formatDate(detailDialog.data.createdAt)}</div></div>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="text-center py-10">Erro.</div>}
                    </div>

                    {!detailDialog.isLoading && detailDialog.data && (
                        <DialogFooter className="px-6 py-4 bg-muted/20 border-t border-border flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDetailDialog({...detailDialog, open: false})}>Fechar</Button>
                            {(['solicitado', 'pendente'].includes(detailDialog.data.status.toLowerCase())) && (
                                <><Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={(e) => openActionDialog(e, 'deny', detailDialog.data)}><XCircle className="w-4 h-4 mr-2"/> Negar</Button><Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={(e) => openActionDialog(e, 'approve', detailDialog.data)}><CheckCircle2 className="w-4 h-4 mr-2"/> Aprovar</Button></>
                            )}
                            {detailDialog.data.status.toLowerCase() === 'aprovado' && <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={(e) => openBuyDialog(e, detailDialog.data)}><ShoppingBag className="w-4 h-4 mr-2"/> Iniciar Compra</Button>}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Confirmar</DialogTitle></DialogHeader>
                    <div className="py-4">Você deseja {actionDialog.type === 'approve' ? 'Aprovar' : 'Negar'} este pedido?</div>
                    <DialogFooter><Button variant="ghost" onClick={()=>setActionDialog({...actionDialog, open: false})}>Cancelar</Button><Button onClick={confirmStatusUpdate} disabled={isSubmitting}>Confirmar</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={buyDialog.open} onOpenChange={(open) => !open && setBuyDialog({ ...buyDialog, open: false })}>
                <DialogContent><DialogHeader><DialogTitle>Nova Compra</DialogTitle></DialogHeader>
                    <div className="py-2 space-y-4">
                        <Label>Quantidade (Múltiplo de 200)</Label><Input value={buyForm.amount} onChange={e=>setBuyForm({...buyForm, amount:e.target.value})} type="number" />
                        <Label>Descrição</Label><Textarea value={buyForm.description} onChange={e=>setBuyForm({...buyForm, description:e.target.value})} />
                    </div>
                    <DialogFooter><Button variant="ghost" onClick={()=>setBuyDialog({...buyDialog, open: false})}>Cancelar</Button><Button onClick={handleSubmitCompra} disabled={isSubmitting}>Enviar</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ---------------------------
// Componente de Imagem com Fallback
// ---------------------------
const InsumoImage = ({ src, alt, sku }) => {
    const [hasError, setHasError] = useState(false);

    // Se a string da URL for inválida ou o load falhar, mostramos o ícone
    if (!src || hasError) {
        return (
            <div className="aspect-square rounded-xl bg-muted/30 border border-border flex items-center justify-center relative overflow-hidden group">
                <Box className="w-16 h-16 text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors" />
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-mono border border-border">
                    {sku}
                </div>
            </div>
        );
    }

    return (
        <div className="aspect-square rounded-xl bg-white border border-border flex items-center justify-center relative overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
                src={src} 
                alt={alt || "Insumo"} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={() => setHasError(true)} // Captura o erro 404 e troca para o ícone
            />
            <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-mono border border-border shadow-sm">
                {sku}
            </div>
        </div>
    );
};

// ---------------------------
// Sub-components
// ---------------------------
const PedidoRow = ({ pedido, onRowClick, onOpenActionDialog, onOpenBuyDialog }) => {
    const s = pedido.status?.toLowerCase();
    const isPending = ['solicitado', 'pendente'].includes(s);
    const isApproved = s === 'aprovado';
    return (
        <TableRow className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60" onClick={onRowClick}>
            <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{pedido.id.slice(0, 8)}</TableCell>
            <TableCell><div className="flex items-center gap-2"><Package className="w-4 h-4 text-muted-foreground"/><span className="font-medium text-sm">{pedido.sku}</span></div></TableCell>
            <TableCell className="text-sm text-muted-foreground"><div className="flex items-center gap-1.5"><Calendar size={13}/>{formatDate(pedido.createdAt)}</div></TableCell>
            <TableCell className="text-center"><StatusBadge status={pedido.status}/></TableCell>
            <TableCell className="text-right pr-6"><div className="flex justify-end gap-1" onClick={e=>e.stopPropagation()}>{isApproved && <Button size="sm" onClick={(e)=>onOpenBuyDialog(e, pedido)} className="h-7 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"><ShoppingBag size={12}/> Comprar</Button>}{isPending && <><Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-100" onClick={e=>onOpenActionDialog(e,'approve',pedido)}><CheckCircle2 size={18}/></Button><Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-100" onClick={e=>onOpenActionDialog(e,'deny',pedido)}><XCircle size={18}/></Button></>}{!isPending && !isApproved && <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={onRowClick}><MoreHorizontal size={16}/></Button>}</div></TableCell>
        </TableRow>
    );
};

const formatDate = (d) => { try { return format(new Date(d), "dd MMM HH:mm", {locale:ptBR}); } catch { return '-'; } };
const formatLabel = (s) => {
    if(!s) return 'N/A';
    if(s.includes('compra_iniciada')) return 'Em Compra';
    if(s.includes('compra_efetuada')) return 'Concluído';
    return s;
}
const StatusBadge = ({ status, inverse }) => {
    const s = String(status || '').toLowerCase();
    let color = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    if (s.includes('aprovado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    else if (s.includes('negado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-red-500/10 text-red-700 border-red-500/20";
    else if (s.includes('compra')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-blue-500/10 text-blue-700 border-blue-500/20";
    else if (s.includes('pendente') || s.includes('solicitado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-amber-500/10 text-amber-700 border-amber-500/20";
    return <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium", color)}>{formatLabel(s)}</Badge>;
};
const getStatusColorBg = (status) => {
    const s = String(status || '').toLowerCase();
    if(s.includes('aprovado')) return "bg-emerald-50 dark:bg-emerald-950/30";
    if(s.includes('negado')) return "bg-red-50 dark:bg-red-950/30";
    if(s.includes('compra')) return "bg-blue-50 dark:bg-blue-950/30";
    if(s.includes('pendente') || s.includes('solicitado')) return "bg-amber-50 dark:bg-amber-950/30";
    return "bg-muted/50";
}