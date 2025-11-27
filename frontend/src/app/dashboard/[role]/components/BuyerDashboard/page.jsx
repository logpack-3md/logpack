"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Menu } from 'lucide-react';
import clsx from 'clsx';

// UI Imports (agrupados para limpeza visual)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import SidebarBuyer from "@/components/layout/sidebar-buyer";
import ListCompras from "@/components/ListCompras"; 
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function BuyerDashboard() {
    const { 
        compras, loading, meta, fetchCompras, 
        createOrcamento, renegociarOrcamento, updateDescricao, cancelarOrcamento 
    } = useBuyerOperations();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    
    // Controle do Modal
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });

    useEffect(() => {
        fetchCompras(1, 10, statusFilter);
    }, [fetchCompras, statusFilter]);

    // Handler para abrir modais e pré-popular dados
    const handleOpenModal = (type, item) => {
        setModalConfig({ type, item });
        setFormData({
            amount: item.amount ? String(item.amount) : "",
            desc: item.description || ""
        });
    };

    const handleCloseModal = () => {
        setModalConfig({ type: null, item: null });
        setFormData({ amount: "", desc: "" });
    };

    // Helper para extrair o ID do orçamento de forma segura
    const getOrcamentoId = (item) => item?.orcamento?.id || item?.orcamentoId || item?.id;

    const handleSubmit = async () => {
        const { type, item } = modalConfig;
        if (!item) return;

        try {
            switch (type) {
                case 'create':
                    await createOrcamento(item.id, { 
                        valor_total: parseFloat(formData.amount), 
                        description: formData.desc 
                    });
                    break;
                case 'renegotiate':
                    await renegociarOrcamento(getOrcamentoId(item), { 
                        valor_total: parseFloat(formData.amount) 
                    });
                    break;
                case 'edit_desc':
                    await updateDescricao(getOrcamentoId(item), { 
                        description: formData.desc 
                    });
                    break;
                case 'cancel':
                    await cancelarOrcamento(getOrcamentoId(item));
                    break;
            }
            handleCloseModal();
        } catch (error) {
            console.error("Erro na operação:", error);
            // Aqui você pode adicionar um Toast de erro
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
                    {/* Header Desktop & Filtros */}
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

                    <ListCompras compras={compras} loading={loading} onAction={handleOpenModal} />

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

            {/* --- ÁREA DE MODAIS --- */}
            
            {/* Modal Genérico para Inputs (Criar/Renegociar/Editar) */}
            <Dialog open={modalConfig.type !== null && modalConfig.type !== 'cancel'} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {modalConfig.type === 'create' && "Novo Orçamento"}
                            {modalConfig.type === 'renegotiate' && "Renegociar Valor"}
                            {modalConfig.type === 'edit_desc' && "Editar Descrição"}
                        </DialogTitle>
                        <DialogDescription>Preencha os dados abaixo.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {['create', 'renegotiate'].includes(modalConfig.type) && (
                            <div className="grid gap-2">
                                <Label>Valor (R$)</Label>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={formData.amount} 
                                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                                />
                            </div>
                        )}
                        
                        {['create', 'edit_desc'].includes(modalConfig.type) && (
                            <div className="grid gap-2">
                                <Label>Descrição</Label>
                                <Textarea 
                                    placeholder="Detalhes..." 
                                    value={formData.desc} 
                                    onChange={e => setFormData({...formData, desc: e.target.value})} 
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Específico: Cancelar */}
            <Dialog open={modalConfig.type === 'cancel'} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Cancelar Orçamento?</DialogTitle>
                        <DialogDescription>Esta ação não pode ser desfeita. O status voltará ao anterior.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>Voltar</Button>
                        <Button variant="destructive" onClick={handleSubmit}>Sim, Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}