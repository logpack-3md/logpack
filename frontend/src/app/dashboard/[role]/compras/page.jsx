"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Filter, Package } from 'lucide-react';
import clsx from 'clsx';

// SHADCN UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

// Componentes Customizados
import ListCompras from "@/components/ListCompras";
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function ComprasPage() {
    // 1. Lógica de Dados (Hook)
    const { 
        compras, loading, meta, fetchCompras, 
        createOrcamento, renegociarOrcamento, updateDescricao, cancelarOrcamento 
    } = useBuyerOperations();

    // 2. Estados Locais
    const [statusFilter, setStatusFilter] = useState('todos');
    const [searchQuery, setSearchQuery] = useState(''); // Estado para busca visual
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Efeito de Busca Inicial
    useEffect(() => {
        const filterToSend = statusFilter === 'todos' ? '' : statusFilter;
        fetchCompras(1, 10, filterToSend);
    }, [fetchCompras, statusFilter]);

    // 4. Handlers de Modal
    const handleOpenModal = (type, item) => {
        setModalConfig({ type, item });
        const orcamentoExistente = item.orcamento;
        const valorInicial = orcamentoExistente?.valor_total 
            ? String(orcamentoExistente.valor_total) 
            : (item.amount ? String(item.amount) : "");
        const descInicial = orcamentoExistente?.description || item.description || "";
        
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
        const orcamentoId = item.orcamento?.id;

        try {
            switch (type) {
                case 'create':
                    await createOrcamento(item.id, { 
                        valor_total: parseFloat(formData.amount), 
                        description: formData.desc || "Orçamento inicial"
                    });
                    break;
                case 'renegotiate':
                    if (!orcamentoId) throw new Error("ID inválido");
                    await renegociarOrcamento(orcamentoId, { 
                        valor_total: parseFloat(formData.amount) 
                    });
                    break;
                case 'edit_desc':
                    if (!orcamentoId) throw new Error("ID inválido");
                    await updateDescricao(orcamentoId, { description: formData.desc });
                    break;
                case 'cancel':
                    if (!orcamentoId) throw new Error("ID inválido");
                    await cancelarOrcamento(orcamentoId);
                    break;
            }
            handleCloseModal();
        } catch (error) {
            console.error(error);
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
        <div className="flex flex-col gap-6 p-6 md:p-8 animate-in fade-in duration-500">
            
            {/* Cabeçalho da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Package className="h-6 w-6 text-blue-600" />
                        Gerenciar Pedidos
                    </h1>
                    <p className="text-sm text-slate-500">
                        Histórico completo de solicitações enviadas pelo gerente.
                    </p>
                </div>
            </div>

            <Separator />

            {/* Barra de Ferramentas (Filtros e Busca) */}
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                
                {/* Busca Visual */}
                <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Buscar por descrição..." 
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filtros de Status */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium text-slate-600 hidden md:inline-block">Filtrar por:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-slate-50 border-slate-200">
                            <Filter className="mr-2 h-4 w-4 text-slate-500"/>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="fase_de_orcamento">Em Análise</SelectItem>
                            <SelectItem value="renegociacao">Renegociação</SelectItem>
                            <SelectItem value="concluido">Aprovados</SelectItem>
                            <SelectItem value="negado">Negados</SelectItem>
                            <SelectItem value="cancelado">Cancelados</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fetchCompras(1, 10, statusFilter === 'todos' ? '' : statusFilter)}
                        title="Atualizar Lista"
                    >
                        <Loader2 className={clsx("h-4 w-4 text-slate-500", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Tabela de Listagem */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden min-h-[400px]">
                <ListCompras 
                    compras={compras} 
                    loading={loading} 
                    onAction={handleOpenModal} 
                />
            </div>

            {/* Paginação */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center mt-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    className={clsx("cursor-pointer", meta.currentPage <= 1 && "pointer-events-none opacity-50")}
                                    onClick={() => fetchCompras(meta.currentPage - 1, 10, statusFilter === 'todos' ? '' : statusFilter)} 
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink isActive className="bg-slate-900 text-white hover:bg-slate-800">
                                    {meta.currentPage}
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext 
                                    className={clsx("cursor-pointer", meta.currentPage >= meta.totalPages && "pointer-events-none opacity-50")}
                                    onClick={() => fetchCompras(meta.currentPage + 1, 10, statusFilter === 'todos' ? '' : statusFilter)} 
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* --- MODAIS DE AÇÃO --- */}
            
            <Dialog open={modalConfig.type !== null && modalConfig.type !== 'cancel'} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{getModalTitle()}</DialogTitle>
                        <DialogDescription>Preencha os detalhes necessários.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {['create', 'renegotiate'].includes(modalConfig.type) && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Valor (R$)</Label>
                                <div className="col-span-3 relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>
                                    <Input id="amount" type="number" className="pl-9" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                                </div>
                            </div>
                        )}
                        {['create', 'edit_desc'].includes(modalConfig.type) && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="desc" className="text-right">Descrição</Label>
                                <Textarea id="desc" className="col-span-3" placeholder="Detalhes..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
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
                        <DialogTitle className="text-destructive">Cancelar Pedido</DialogTitle>
                        <DialogDescription>Esta ação é irreversível.</DialogDescription>
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