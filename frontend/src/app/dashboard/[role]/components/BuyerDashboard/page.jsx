"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Menu, CircleUser, Bell, Filter } from 'lucide-react';
import clsx from 'clsx';

// SHADCN UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Imports Locais
import SidebarBuyer, { SidebarContent } from "@/components/layout/sidebar-buyer";
import ListCompras from "@/components/ListCompras";
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function BuyerDashboard() {
    const { 
        compras, loading, meta, fetchCompras, 
        createOrcamento, renegociarOrcamento, updateDescricao, cancelarOrcamento 
    } = useBuyerOperations();

    const [statusFilter, setStatusFilter] = useState('todos');
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const filterToSend = statusFilter === 'todos' ? '' : statusFilter;
        fetchCompras(1, 10, filterToSend);
    }, [fetchCompras, statusFilter]);

    // --- Handlers ---
    const handleOpenModal = (type, item) => {
        setModalConfig({ type, item });
        
        // Extração segura do orçamento (igual à lista)
        const orcamentoObj = Array.isArray(item.orcamento) ? item.orcamento[0] : item.orcamento;
        
        const valorInicial = orcamentoObj?.valor_total 
            ? String(orcamentoObj.valor_total) 
            : (item.amount ? String(item.amount) : ""); // item.amount é quantidade, mas usamos como placeholder se necessário
            
        const descInicial = orcamentoObj?.description || item.description || "";
        
        setFormData({ amount: valorInicial, desc: descInicial });
    };

    const handleCloseModal = () => {
        setModalConfig({ type: null, item: null });
        setFormData({ amount: "", desc: "" });
        setIsSubmitting(false);
    };

    const handleSubmit = async () => {
        const { type, item } = modalConfig;
        if (!item) return;
        setIsSubmitting(true);
        
        // --- CORREÇÃO PRINCIPAL: Extração do ID do Orçamento ---
        const orcamentoObj = Array.isArray(item.orcamento) ? item.orcamento[0] : item.orcamento;
        const orcamentoId = orcamentoObj?.id;

        try {
            switch (type) {
                case 'create':
                    await createOrcamento(item.id, { 
                        valor_total: parseFloat(formData.amount), 
                        description: formData.desc || "Orçamento inicial"
                    });
                    break;

                case 'renegotiate':
                    if (!orcamentoId) throw new Error("ID do orçamento não encontrado.");
                    await renegociarOrcamento(orcamentoId, { 
                        valor_total: parseFloat(formData.amount) 
                    });
                    break;

                case 'edit_desc':
                    if (!orcamentoId) throw new Error("ID do orçamento não encontrado.");
                    // Validação de Frontend Básica para evitar erro do Zod
                    if (formData.desc.length < 10) {
                        throw new Error("A descrição deve ter no mínimo 10 caracteres.");
                    }
                    await updateDescricao(orcamentoId, { description: formData.desc });
                    break;

                case 'cancel':
                    if (!orcamentoId) throw new Error("ID do orçamento não encontrado.");
                    await cancelarOrcamento(orcamentoId);
                    break;
            }
            handleCloseModal();
        } catch (error) {
            console.error("Erro na operação:", error);
            // Exibe o erro real (ex: "Mínimo 10 caracteres")
            alert(error.message || "Erro ao processar solicitação.");
            setIsSubmitting(false);
        }
    };

    const getModalTitle = () => {
        switch(modalConfig.type) {
            case 'create': return 'Novo Orçamento';
            case 'renegotiate': return 'Renegociar Valor';
            case 'edit_desc': return 'Editar Detalhes';
            case 'cancel': return 'Cancelar Pedido';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen w-full bg-muted/40">
            <SidebarBuyer />
            <div className="flex flex-col md:pl-[240px] lg:pl-[260px]">
                
                {/* Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0 w-[260px]">
                           <SidebarContent />
                        </SheetContent>
                    </Sheet>

                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Buscar pedidos..." className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3" />
                            </div>
                        </form>
                    </div>

                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Sair</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col gap-6 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Painel de Compras</h1>
                            <p className="text-sm text-muted-foreground">Visualize e responda às solicitações de orçamento.</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[200px] bg-background">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground"/>
                                    <SelectValue placeholder="Filtrar por Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Pedidos</SelectItem>
                                    <SelectItem value="pendente">Novos (Pendente)</SelectItem>
                                    <SelectItem value="fase_de_orcamento">Em Análise</SelectItem>
                                    <SelectItem value="renegociacao">Renegociação</SelectItem>
                                    <SelectItem value="concluido">Concluídos</SelectItem>
                                    <SelectItem value="negado">Negados</SelectItem>
                                    <SelectItem value="cancelado">Cancelados</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                         <ListCompras compras={compras} loading={loading} onAction={handleOpenModal} />
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className="mt-auto py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); if(meta.currentPage > 1) fetchCompras(meta.currentPage - 1, 10, statusFilter === 'todos' ? '' : statusFilter); }}
                                            className={clsx(meta.currentPage <= 1 && "pointer-events-none opacity-50")}
                                        />
                                    </PaginationItem>
                                    <PaginationItem><PaginationLink isActive>{meta.currentPage}</PaginationLink></PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext 
                                             href="#"
                                             onClick={(e) => { e.preventDefault(); if(meta.currentPage < meta.totalPages) fetchCompras(meta.currentPage + 1, 10, statusFilter === 'todos' ? '' : statusFilter); }}
                                             className={clsx(meta.currentPage >= meta.totalPages && "pointer-events-none opacity-50")}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </main>
            </div>

            {/* --- Modais --- */}
            <Dialog open={modalConfig.type !== null && modalConfig.type !== 'cancel'} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{getModalTitle()}</DialogTitle>
                        <DialogDescription>Preencha os dados necessários.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {['create', 'renegotiate'].includes(modalConfig.type) && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Valor</Label>
                                <div className="col-span-3 relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>
                                    <Input id="amount" type="number" className="pl-9" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                                </div>
                            </div>
                        )}
                        {['create', 'edit_desc'].includes(modalConfig.type) && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="desc" className="text-right">Descrição</Label>
                                <Textarea id="desc" className="col-span-3" placeholder="Detalhes do orçamento..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={modalConfig.type === 'cancel'} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Cancelar Solicitação</DialogTitle>
                        <DialogDescription>Tem certeza? O status será revertido e o orçamento cancelado.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>Voltar</Button>
                        <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}