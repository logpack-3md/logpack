"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Menu } from 'lucide-react';
import clsx from 'clsx';

// Componentes UI (Shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// Seus Componentes
import SidebarBuyer from "@/components/layout/sidebar-buyer";
import ListCompras from "@/components/ListCompras"; // Certifique-se que o caminho está correto
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function BuyerDashboard() {
    // Hook contendo lógica e estado
    const { 
        compras, 
        loading, 
        error, 
        meta, 
        fetchCompras, 
        createOrcamento, 
        renegociarOrcamento, 
        updateDescricao, 
        cancelarOrcamento 
    } = useBuyerOperations();

    // Estados locais da Dashboard
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [modalType, setModalType] = useState(null); 
    const [selectedItem, setSelectedItem] = useState(null);
    const [amountInput, setAmountInput] = useState("");
    const [descInput, setDescInput] = useState("");

    // Busca inicial
    useEffect(() => {
        fetchCompras(1, 10, statusFilter);
    }, [fetchCompras, statusFilter]);

    // Prepara o modal com os dados do item clicado na tabela
    const handleOpenModal = (type, item) => {
        setSelectedItem(item);
        setModalType(type);
        setAmountInput(item.amount ? String(item.amount) : "");
        setDescInput(item.description || ""); 
    };

    const handleSubmit = async () => {
        if (!selectedItem) return;

        try {
            if (modalType === 'create') {
                await createOrcamento(selectedItem.id, { 
                    valor_total: parseFloat(amountInput), 
                    description: descInput 
                });
            } 
            else if (modalType === 'renegotiate') {
                // Ajuste aqui se o ID do orçamento vier com outro nome no objeto compra
                const orcId = selectedItem.orcamento?.id || selectedItem.orcamentoId || selectedItem.id;
                await renegociarOrcamento(orcId, { 
                    valor_total: parseFloat(amountInput) 
                });
            } 
            else if (modalType === 'edit_desc') {
                const orcId = selectedItem.orcamento?.id || selectedItem.orcamentoId || selectedItem.id;
                await updateDescricao(orcId, { description: descInput });
            } 
            else if (modalType === 'cancel') {
                const orcId = selectedItem.orcamento?.id || selectedItem.orcamentoId || selectedItem.id;
                await cancelarOrcamento(orcId);
            }
            
            setModalType(null);
            setSelectedItem(null);
            setAmountInput("");
            setDescInput("");
        } catch (error) {
            console.error("Erro na operação:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <SidebarBuyer isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <main className={clsx("flex-1 transition-all duration-300 flex flex-col min-h-screen", sidebarOpen ? "lg:ml-64" : "lg:ml-0")}>
                
                {/* Header Mobile */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
                    <span className="font-bold text-slate-700">LogPack</span>
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>

                <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto">
                    
                    {/* Header Desktop */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Central de Orçamentos</h1>
                            <p className="text-slate-500 mt-2">Gerencie solicitações de compra e negociações.</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <select 
                                className="h-10 rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="renegociacao">Renegociação</option>
                                <option value="fase_de_orcamento">Em Orçamento</option>
                            </select>
                            
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => fetchCompras(1, 10, statusFilter)}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>} 
                                Atualizar
                            </Button>
                        </div>
                    </div>

                    {/* Tabela Importada */}
                    <ListCompras 
                        compras={compras} 
                        loading={loading} 
                        onAction={handleOpenModal} 
                    />

                    {/* Paginação */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            className={clsx("cursor-pointer", meta.currentPage <= 1 && "pointer-events-none opacity-50")}
                                            onClick={() => fetchCompras(meta.currentPage - 1, 10, statusFilter)} 
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink isActive>{meta.currentPage}</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext 
                                            className={clsx("cursor-pointer", meta.currentPage >= meta.totalPages && "pointer-events-none opacity-50")}
                                            onClick={() => fetchCompras(meta.currentPage + 1, 10, statusFilter)} 
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODAIS DE AÇÃO --- */}

            {/* Modal: Criar Orçamento */}
            <Dialog open={modalType === 'create'} onOpenChange={() => setModalType(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Orçamento</DialogTitle>
                        <DialogDescription>Inicie o orçamento para o pedido.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Valor (R$)</Label>
                            <Input type="number" placeholder="0.00" value={amountInput} onChange={e => setAmountInput(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Descrição</Label>
                            <Textarea placeholder="Detalhes..." value={descInput} onChange={e => setDescInput(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalType(null)}>Cancelar</Button>
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Enviar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Renegociar */}
            <Dialog open={modalType === 'renegotiate'} onOpenChange={() => setModalType(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renegociar</DialogTitle>
                        <DialogDescription>Atualize o valor conforme solicitado.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Novo Valor (R$)</Label>
                            <Input type="number" value={amountInput} onChange={e => setAmountInput(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalType(null)}>Cancelar</Button>
                        <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">Atualizar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Editar Descrição */}
            <Dialog open={modalType === 'edit_desc'} onOpenChange={() => setModalType(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Descrição</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="grid gap-2">
                            <Label>Descrição</Label>
                            <Textarea value={descInput} onChange={e => setDescInput(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalType(null)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Cancelar */}
            <Dialog open={modalType === 'cancel'} onOpenChange={() => setModalType(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Cancelar?</DialogTitle>
                        <DialogDescription>O pedido voltará para o status "Solicitado".</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalType(null)}>Voltar</Button>
                        <Button variant="destructive" onClick={handleSubmit}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}