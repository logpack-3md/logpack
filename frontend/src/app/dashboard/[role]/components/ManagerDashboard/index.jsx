"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Menu, Truck, Calendar,
    MoreHorizontal, CheckCircle2, XCircle,
    Filter, RefreshCw, PackageX, Inbox,
    ShoppingBag, Box, User, Clock, Package,
    Hash, Mail, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Layout & Logic
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

    // --- HANDLERS ---
    const handleOpenDetails = async (pedidoSimples) => {
        setDetailDialog({ open: true, isLoading: true, data: pedidoSimples });
        const completeData = await getPedidoDetails(pedidoSimples.id);

        setDetailDialog({
            open: true,
            isLoading: false,
            data: completeData ? {
                ...pedidoSimples,
                ...completeData,
                userId: completeData.userId || completeData.requesterId || pedidoSimples.requesterId || pedidoSimples.userId
            } : pedidoSimples
        });
    };

    const openActionDialog = (e, type, item) => {
        if (e) e.stopPropagation();
        setDetailDialog(prev => ({ ...prev, open: false }));
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
        if (e) e.stopPropagation();
        setDetailDialog(prev => ({ ...prev, open: false }));
        setBuyDialog({ open: true, item });
        setBuyForm({ amount: '', description: '' });
    };

    const handleSubmitCompra = async () => {
        if (!buyDialog.item) return;
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
                {/* Header */}
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

                {/* Main Content */}
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
                                        Array.from({ length: Math.min(pagination.limit, 8) }).map((_, i) => (<TableRow key={i}><TableCell colSpan={5} className="p-4 px-6"><Skeleton className="h-10 w-full rounded-lg" /></TableCell></TableRow>))
                                    ) : pedidos.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-[400px]"><div className="flex flex-col items-center justify-center text-muted-foreground"><div className="p-6 bg-muted/30 rounded-full mb-3 border border-border/50"><Inbox className="h-10 w-10 opacity-30" /></div><p className="font-medium text-foreground">Sem pedidos.</p></div></TableCell></TableRow>
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

            {/* --- MODAL DETALHES --- */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({ ...detailDialog, open: false })}>
                <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-card border-border shadow-2xl gap-0">
                    {/* Header */}
                    <div className={clsx("pl-6 pr-14 py-4 flex items-center justify-between border-b border-border/60", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-1">
                                <Hash className="w-3 h-3" /> {detailDialog.data?.id.slice(0, 8)}
                            </span>
                            <DialogTitle className="font-semibold text-lg leading-none tracking-tight">
                                Detalhes do Pedido
                            </DialogTitle>
                        </div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>

                    {/* Body */}
                    <div className="p-6 md:p-8">
                        {detailDialog.isLoading ? (
                            <div className="space-y-6">
                                <div className="flex gap-8">
                                    <Skeleton className="h-40 w-40 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-4">
                                        <Skeleton className="h-8 w-3/4" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>
                        ) : detailDialog.data ? (
                            <div className="grid grid-cols-1 md:grid-cols-[35%_1fr] gap-8">

                                {/* Lado Esquerdo (Imagem e Estoque) */}
                                <div className="space-y-5">
                                    <div className="aspect-square rounded-2xl bg-muted/10 border border-border flex items-center justify-center overflow-hidden relative group shadow-sm">
                                        <InsumoImage
                                            src={detailDialog.data.fullInsumo?.image}
                                            alt="Insumo"
                                            sku={detailDialog.data.fullInsumo?.SKU || detailDialog.data.sku}
                                        />
                                        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-mono font-semibold border border-border/50 shadow-sm z-10">
                                            {detailDialog.data.sku}
                                        </div>
                                    </div>

                                    {/* Estoque Compacto */}
                                    {detailDialog.data.fullInsumo ? (
                                        <div className="bg-muted/30 p-3 rounded-xl border border-border space-y-2.5">
                                            <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground tracking-wider">
                                                <span>Estoque</span>
                                                <span className="text-foreground">
                                                    {detailDialog.data.fullInsumo.current_storage} <span className="text-muted-foreground font-normal">/ {detailDialog.data.fullInsumo.max_storage}</span>
                                                </span>
                                            </div>
                                            <Progress
                                                value={(detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) * 100}
                                                className="h-1.5 bg-muted"
                                                indicatorClassName={
                                                    (detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) < 0.35
                                                        ? "bg-red-500" : "bg-emerald-500"
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-4 border-2 border-dashed rounded-xl text-xs text-center text-muted-foreground bg-muted/10">
                                            Estoque indisponível.
                                        </div>
                                    )}
                                </div>

                                {/* Lado Direito (Dados) */}
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 space-y-6">
                                        {/* Título + Tags */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground leading-tight mb-2">
                                                {detailDialog.data.fullInsumo?.name || detailDialog.data.insumoName || "Item Sem Nome"}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {detailDialog.data.fullInsumo && (
                                                    <>
                                                        <Badge variant="secondary" className="font-normal bg-muted hover:bg-muted">
                                                            Setor: {detailDialog.data.fullInsumo.setorName || "N/A"}
                                                        </Badge>
                                                        <span className="w-px h-4 bg-border"></span>
                                                    </>
                                                )}
                                                <span className="text-sm text-muted-foreground font-medium">
                                                    UN: {detailDialog.data.fullInsumo?.measure || "Un"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Descrição */}
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                <FileText className="w-3.5 h-3.5" /> Descrição Técnica
                                            </div>
                                            <div className="bg-muted/20 p-4 rounded-xl border border-border/50">
                                                <p className="text-sm text-foreground/80 leading-relaxed">
                                                    {detailDialog.data.fullInsumo?.description || "Nenhuma descrição técnica informada."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stack de Meta Dados (Layout alterado para Flex Column) */}
                                        <div className="flex flex-col gap-2.5 pt-2">

                                            {/* Bloco Solicitante */}
                                            <div className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg shadow-sm">
                                                <div className="flex items-center gap-2.5 overflow-hidden">
                                                    <div className="p-1.5 bg-primary/10 text-primary rounded-md shrink-0">
                                                        <User className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none mb-0.5">Solicitante</span>
                                                        {/* ID Resumido ou E-mail */}
                                                        <span className="text-sm font-medium truncate w-full" title={detailDialog.data.requesterEmail || detailDialog.data.userId}>
                                                            {detailDialog.data.requesterEmail || (
                                                                <span className="font-mono">
                                                                    {detailDialog.data.userId ? `${detailDialog.data.userId}` : "ID Oculto"}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bloco Data */}
                                            <div className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg shadow-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-1.5 bg-primary/10 text-primary rounded-md shrink-0">
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none mb-0.5">Data do Pedido</span>
                                                        <span className="text-sm font-medium">
                                                            {formatDate(detailDialog.data.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="text-center py-12 text-muted-foreground">Erro ao carregar.</div>}
                    </div>

                    {!detailDialog.isLoading && detailDialog.data && (
                        <div className="bg-muted/20 px-8 py-5 border-t border-border flex items-center justify-end gap-3">
                            <Button variant="outline" onClick={() => setDetailDialog({ ...detailDialog, open: false })}>
                                Fechar
                            </Button>

                            {(['solicitado', 'pendente'].includes(detailDialog.data.status.toLowerCase())) && (
                                <>
                                    <Button variant="destructive" className="bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-900" onClick={(e) => openActionDialog(e, 'deny', detailDialog.data)}>
                                        <XCircle className="w-4 h-4 mr-2" /> Rejeitar
                                    </Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200/20" onClick={(e) => openActionDialog(e, 'approve', detailDialog.data)}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar
                                    </Button>
                                </>
                            )}

                            {detailDialog.data.status.toLowerCase() === 'aprovado' && (
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200/50" onClick={(e) => openBuyDialog(e, detailDialog.data)}>
                                    <ShoppingBag className="w-4 h-4 mr-2" /> Iniciar Compra
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Actions */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
                <DialogContent><DialogHeader><DialogTitle>Confirmar Ação</DialogTitle></DialogHeader>
                    <div className="py-4 text-muted-foreground">Tem certeza que deseja {actionDialog.type === 'approve' ? <strong>APROVAR</strong> : <strong>REJEITAR</strong>} o pedido?</div>
                    <DialogFooter><Button variant="outline" onClick={() => setActionDialog({ ...actionDialog, open: false })}>Cancelar</Button><Button className={actionDialog.type === 'approve' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"} onClick={confirmStatusUpdate} disabled={isSubmitting}>Confirmar</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={buyDialog.open} onOpenChange={(open) => !open && setBuyDialog({ ...buyDialog, open: false })}>
                <DialogContent><DialogHeader><DialogTitle>Iniciar Ordem de Compra</DialogTitle></DialogHeader>
                    <div className="py-2 space-y-4"><div><Label>Qtd (Múlt. 200)</Label><Input type="number" value={buyForm.amount} onChange={e => setBuyForm({ ...buyForm, amount: e.target.value })} /></div><div><Label>Observações</Label><Textarea value={buyForm.description} onChange={e => setBuyForm({ ...buyForm, description: e.target.value })} /></div></div>
                    <DialogFooter><Button variant="ghost" onClick={() => setBuyDialog({ ...buyDialog, open: false })}>Cancelar</Button><Button onClick={handleSubmitCompra}>Confirmar Envio</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Helpers (Images, Formatters, etc.) - Igual ao anterior, apenas renderizado novamente se necessário.
const InsumoImage = ({ src, alt, sku }) => {
    const [err, setErr] = useState(false);
    // Fallback elegante
    if (!src || err) return (
        <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
            <Box className="w-10 h-10" />
        </div>
    );
    return <img src={src} alt={alt} className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform hover:scale-105" onError={() => setErr(true)} />;
};

const PedidoRow = ({ pedido, onRowClick, onOpenActionDialog, onOpenBuyDialog }) => {
    const s = pedido.status?.toLowerCase();
    const isPending = ['solicitado', 'pendente'].includes(s);
    const isApproved = s === 'aprovado';
    return (
        <TableRow className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60 group" onClick={onRowClick}>
            <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{pedido.id.slice(0, 8)}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2"><div className="p-1.5 rounded-md bg-muted/50 border"><Package className="w-3.5 h-3.5 text-muted-foreground" /></div>
                    <span className="font-medium text-sm">{pedido.sku}</span>
                </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(pedido.createdAt)}
                </div>
            </TableCell>
            <TableCell className="text-center">
                <StatusBadge status={pedido.status} />
            </TableCell>
            <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                    {isApproved &&
                        <Button size="sm" onClick={(e) => onOpenBuyDialog(e, pedido)} className="h-7 bg-indigo-600/70 text-indigo-50 hover:bg-indigo-500/50 border-indigo-50 border shadow-none">
                            <ShoppingBag size={12} />
                            Comprar
                        </Button>}
                    {isPending && <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" onClick={e => onOpenActionDialog(e, 'approve', pedido)}>
                            <CheckCircle2 size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={e => onOpenActionDialog(e, 'deny', pedido)}>
                            <XCircle size={16} />
                        </Button>
                    </>}
                    {!isPending && !isApproved && <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={onRowClick}><MoreHorizontal size={16} />
                    </Button>}</div>
            </TableCell>
        </TableRow>
    );
};

const formatDate = (d) => { try { return format(new Date(d), "dd MMM, HH:mm", { locale: ptBR }); } catch { return '-'; } };
const formatLabel = (s) => {
    if (!s) return 'N/A';
    if (s.includes('compra_iniciada')) return 'Em Compra';
    if (s.includes('compra_efetuada')) return 'Concluído';
    return s;
}
const StatusBadge = ({ status, inverse }) => {
    const s = String(status || '').toLowerCase();
    let color = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    if (s.includes('aprovado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    else if (s.includes('negado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-red-500/10 text-red-700 border-red-500/20";
    else if (s.includes('compra')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-blue-500/10 text-blue-700 border-blue-500/20";
    else if (s.includes('pendente') || s.includes('solicitado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-amber-500/10 text-amber-700 border-amber-500/20";
    return <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2.5", color)}>{formatLabel(s)}</Badge>;
};
const getStatusColorBg = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('aprovado')) return "bg-emerald-50/50 dark:bg-emerald-950/30";
    if (s.includes('negado')) return "bg-red-50/50 dark:bg-red-950/30";
    if (s.includes('compra')) return "bg-blue-50/50 dark:bg-blue-950/30";
    if (s.includes('pendente')) return "bg-amber-50/50 dark:bg-amber-950/30";
    return "bg-muted/50";
}