"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Filter, Package, FileText, DollarSign, ShoppingBag, RefreshCcw, Ban, Edit3, PackageX } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Components e Hooks
import SidebarBuyer from "@/components/layout/sidebar-buyer";
import { useBuyerOperations } from "@/hooks/useBuyerOperations";
// Adicionamos isValid para checar a data
import { format, isValid } from 'date-fns'; 
import { ptBR } from 'date-fns/locale';

export default function BuyerDashboard() {
    const { 
        compras, loading, meta, isSubmitting,
        fetchCompras, createOrcamento, renegociarOrcamento, updateDescricao, cancelarOrcamento 
    } = useBuyerOperations();

    const [statusFilter, setStatusFilter] = useState('todos');
    
    // Modais
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });

    useEffect(() => {
        const filterToSend = statusFilter === 'todos' ? '' : statusFilter;
        fetchCompras(1, 10, filterToSend);
    }, [fetchCompras, statusFilter]);

    const handleRefresh = () => fetchCompras(meta.currentPage, 10, statusFilter === 'todos' ? '' : statusFilter);
    const handlePageChange = (p) => fetchCompras(p, 10, statusFilter === 'todos' ? '' : statusFilter);

    // --- MODAL LOGIC ---
    const handleOpenModal = (type, item) => {
        let valor = "";
        let desc = "";

        if (item.orcamento) {
            valor = item.orcamento.valor_total ? String(item.orcamento.valor_total) : "";
            desc = item.orcamento.description || "";
        }
        
        if (type === 'edit_desc' && !item.orcamento) {
            desc = item.description;
        }

        setFormData({ amount: valor, desc: desc });
        setModalConfig({ type, item });
    };

    const handleCloseModal = () => {
        setModalConfig({ type: null, item: null });
        setFormData({ amount: "", desc: "" });
    };

    const handleSubmit = async () => {
        const { type, item } = modalConfig;
        if (!item) return;
        
        const orcamentoId = item.orcamento?.id; 

        let success = false;

        if (type === 'create') {
            success = await createOrcamento(item.id, { 
                valor_total: parseFloat(formData.amount), 
                description: formData.desc || "Orçamento enviado pelo comprador."
            });
        } 
        else if (type === 'renegotiate') {
            if (!orcamentoId) { console.error("Sem ID orçamento"); return; }
            success = await renegociarOrcamento(orcamentoId, { 
                valor_total: parseFloat(formData.amount) 
            });
        } 
        else if (type === 'edit_desc') {
            if (!orcamentoId) { console.error("Sem ID orçamento"); return; }
            success = await updateDescricao(orcamentoId, { 
                description: formData.desc 
            });
        } 
        else if (type === 'cancel') {
            if (!orcamentoId) { console.error("Sem ID orçamento"); return; }
            success = await cancelarOrcamento(orcamentoId);
        }

        if (success) {
            handleCloseModal();
        }
    };

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            <SidebarBuyer />

            <div className="flex flex-1 flex-col md:ml-[240px] lg:ml-[260px] transition-all duration-300">
                
                {/* Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
                        <ShoppingBag className="h-5 w-5 text-primary" /> <span>Portal de Compras</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2">
                        <RefreshCcw className={clsx("h-4 w-4", loading && "animate-spin")} /><span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                <main className="flex flex-1 flex-col p-6 md:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    {/* Topo e Filtros */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
                         <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Gestão de Cotações</h1>
                            <p className="text-sm text-muted-foreground">Analise pedidos, envie orçamentos e renegocie valores.</p>
                        </div>
                         <div className="flex items-center gap-2 w-full md:w-auto">
                             <span className="text-sm text-muted-foreground hidden sm:inline"><Filter className="inline w-4 h-4 mr-1"/> Filtrar:</span>
                             <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[200px] bg-background"><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="pendente">Novos Pedidos</SelectItem>
                                    <SelectItem value="renegociacao_solicitada">Renegociação</SelectItem>
                                    <SelectItem value="fase_de_orcamento">Aguardando Aprovação</SelectItem>
                                    <SelectItem value="concluido">Aprovados</SelectItem>
                                    <SelectItem value="cancelado">Cancelados</SelectItem>
                                </SelectContent>
                             </Select>
                         </div>
                    </div>

                    {/* Tabela */}
                    <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="flex-1 overflow-auto scrollbar-thin">
                            <Table>
                                <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                                    <TableRow className="border-b border-border/60 hover:bg-transparent">
                                        <TableHead className="w-[100px] pl-6 h-12">Ref</TableHead>
                                        <TableHead>Solicitação / Instruções</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Qtd / Valor</TableHead>
                                        <TableHead className="text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}><TableCell colSpan={5} className="p-4 px-6"><Skeleton className="h-10 w-full rounded-lg"/></TableCell></TableRow>
                                        ))
                                    ) : compras.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-[300px] text-center text-muted-foreground"><PackageX className="w-10 h-10 opacity-30 mx-auto mb-2"/><p>Nenhuma solicitação encontrada.</p></TableCell></TableRow>
                                    ) : (
                                        compras.map(item => (
                                            <CompraRow key={item.id} item={item} onAction={handleOpenModal} />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Footer Pagination */}
                        <div className="border-t border-border p-3 bg-background flex justify-end gap-2">
                             <div className="text-xs text-muted-foreground self-center mr-4">
                                Total: {meta.totalItems} | Página {meta.currentPage} de {meta.totalPages}
                             </div>
                             <Button variant="outline" size="sm" disabled={meta.currentPage <= 1} onClick={()=>handlePageChange(meta.currentPage - 1)}>Anterior</Button>
                             <Button variant="outline" size="sm" disabled={meta.currentPage >= meta.totalPages} onClick={()=>handlePageChange(meta.currentPage + 1)}>Próximo</Button>
                        </div>
                    </div>
                </main>
            </div>

            {/* DIALOGS (Modais) */}
            <Dialog open={!!modalConfig.type} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{getModalTitle(modalConfig.type)}</DialogTitle>
                        <DialogDescription>Preencha as informações necessárias.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-2 space-y-4">
                        {(modalConfig.type === 'create' || modalConfig.type === 'renegotiate') && (
                             <div>
                                 <Label>Valor Total Proposto (R$)</Label>
                                 <Input 
                                     type="number" 
                                     step="0.01"
                                     placeholder="0.00" 
                                     className="mt-1.5 font-mono"
                                     value={formData.amount} 
                                     onChange={e => setFormData({...formData, amount: e.target.value})} 
                                     autoFocus
                                 />
                                 {modalConfig.type === 'renegotiate' && <p className="text-[10px] text-orange-600 mt-1">* Gerente solicitou revisão de valores.</p>}
                             </div>
                        )}

                        {(modalConfig.type === 'create' || modalConfig.type === 'edit_desc') && (
                             <div>
                                 <Label>Detalhes / Itens Inclusos</Label>
                                 <Textarea 
                                     placeholder="Descreva marcas, prazos ou condições..." 
                                     className="mt-1.5 min-h-[100px]"
                                     value={formData.desc} 
                                     onChange={e => setFormData({...formData, desc: e.target.value})} 
                                 />
                                 <p className="text-[10px] text-muted-foreground mt-1">Mínimo 10 caracteres.</p>
                             </div>
                        )}

                        {modalConfig.type === 'cancel' && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
                                Tem certeza? O pedido será encerrado e a produção notificada.
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting} 
                            className={clsx("shadow-sm text-white", modalConfig.type==='cancel' ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90")}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirmar Envio"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- HELPER FUNCTIONS ---

const formatDateSafe = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (!isValid(date)) return '-';
    return format(date, "dd/MM/yy HH:mm", { locale: ptBR });
};

const CompraRow = ({ item, onAction }) => {
    const currentStatus = item.status;
    const hasOrcamento = !!item.orcamento;
    const isPending = currentStatus === 'pendente';
    const isRenegotiation = currentStatus === 'renegociacao_solicitada';
    
    return (
        <TableRow className="hover:bg-muted/40 transition-colors group border-b border-border/60">
            <TableCell className="pl-6 py-4 font-mono text-xs text-muted-foreground">#{item.id.slice(0,6)}</TableCell>
            <TableCell>
                <div className="flex flex-col gap-1 max-w-[300px]">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {hasOrcamento ? <FileText size={14} className="text-indigo-500"/> : <Package size={14} className="text-muted-foreground"/>}
                        <span className="truncate">{item.orcamento?.description || item.description}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {/* USO DA FUNÇÃO SEGURA AQUI */}
                        {formatDateSafe(item.createdAt || item.updatedAt)}
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-center">
                <StatusBadge status={currentStatus} />
            </TableCell>
            <TableCell className="text-right">
                <div className="flex flex-col items-end">
                    {item.orcamento ? (
                        <span className="font-mono font-semibold text-emerald-600 text-sm">
                             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.orcamento.valor_total)}
                        </span>
                    ) : (
                        <span className="font-mono text-sm text-foreground">{item.amount} un.</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-2">
                    {isPending && (
                         <Button size="sm" onClick={()=>onAction('create', item)} className="bg-primary text-primary-foreground shadow-sm text-xs h-8 px-3">
                             <DollarSign className="w-3 h-3 mr-1"/> Enviar Orçamento
                         </Button>
                    )}
                    {isRenegotiation && (
                         <Button size="sm" onClick={()=>onAction('renegotiate', item)} className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-xs h-8 px-3">
                             <RefreshCcw className="w-3 h-3 mr-1"/> Novo Valor
                         </Button>
                    )}
                    {hasOrcamento && !['concluido', 'negado', 'cancelado'].includes(currentStatus) && !isRenegotiation && (
                        <>
                             <Button size="icon" variant="ghost" onClick={()=>onAction('edit_desc', item)} className="h-8 w-8 text-muted-foreground hover:bg-muted"><Edit3 size={14}/></Button>
                             <Button size="icon" variant="ghost" onClick={()=>onAction('cancel', item)} className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"><Ban size={14}/></Button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}

const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    // Glass Style Badges
    let colors = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    let label = s;

    if(s === 'pendente') { label = "Novo Pedido"; colors = "bg-blue-500/10 text-blue-700 border-blue-500/20"; }
    else if(s === 'renegociacao_solicitada') { label = "Renegociação"; colors = "bg-orange-500/10 text-orange-700 border-orange-500/20"; }
    else if(s === 'fase_de_orcamento') { label = "Em Análise"; colors = "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"; }
    else if(s === 'concluido') { label = "Aprovado"; colors = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"; }
    else if(s === 'negado' || s === 'cancelado') { label = s === 'negado' ? "Negado" : "Cancelado"; colors = "bg-red-500/10 text-red-700 border-red-500/20"; }

    return <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2 py-0.5 text-[10px]", colors)}>{label}</Badge>
};

const getModalTitle = (type) => {
    if(type==='create') return 'Novo Orçamento';
    if(type==='renegotiate') return 'Renegociar Valor';
    if(type==='edit_desc') return 'Editar Detalhes';
    if(type==='cancel') return 'Cancelar Pedido';
    return '';
}