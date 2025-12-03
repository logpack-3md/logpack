"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCcw, Menu } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Components
import SidebarBuyer from "@/components/layout/sidebar-buyer";
import BuyerTable from "@/components/Buyer/BuyerTable";
import BuyerFilters from "@/components/Buyer/BuyerFilters";
import BuyerModals from "@/components/Buyer/BuyerModals";

// Hooks
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function EstimarPage() {
    const { 
        compras, loading, meta, isSubmitting,
        fetchCompras, createOrcamento, renegociarOrcamento, cancelarOrcamento 
    } = useBuyerOperations();

    const [statusFilter, setStatusFilter] = useState('todos');
    
    // Modal States
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });

    // --- Init ---
    useEffect(() => {
        // Carrega a lista inicial
        fetchCompras(1, 10, statusFilter === 'todos' ? '' : statusFilter);
    }, [fetchCompras, statusFilter]); 

    // --- Handlers ---
    const handleRefresh = () => {
        fetchCompras(meta.currentPage, 10, statusFilter === 'todos' ? '' : statusFilter);
    };

    const handlePageChange = (newPage) => {
        fetchCompras(newPage, 10, statusFilter === 'todos' ? '' : statusFilter);
    };
    
    const handleLimitChange = (limit) => {
        fetchCompras(1, parseInt(limit), statusFilter === 'todos' ? '' : statusFilter);
    };

    const handleOpenModal = (type, item) => {
        let valor = "";
        let desc = "";

        // Pré-carrega dados se existirem
        if (item.orcamento) {
            valor = item.orcamento.valor_total ? String(item.orcamento.valor_total) : "";
            // Tenta carregar a descrição atual do orçamento, senão da compra
            desc = item.orcamento.description || "";
        } else {
            // Se for criar, deixa vazio ou puxa do pedido
            desc = item.description || ""; 
        }

        setFormData({ amount: valor, desc: desc });
        setModalConfig({ type, item });
    };

    const handleSubmit = async () => {
        const { type, item } = modalConfig;
        if (!item) return;
        
        const orcamentoId = item.orcamento?.id; 
        let success = false;

        // Validação básica de front (o Hook faz a do backend)
        const payloadData = { 
            valor_total: parseFloat(formData.amount), 
            description: formData.desc 
        };

        if (type === 'create') {
            success = await createOrcamento(item.id, payloadData);
        } 
        else if (type === 'renegotiate') {
            if (!orcamentoId) return;
            // CORREÇÃO: Agora envia a descrição junto com o novo valor
            success = await renegociarOrcamento(orcamentoId, payloadData);
        } 
        else if (type === 'cancel') {
            if (!orcamentoId) return;
            success = await cancelarOrcamento(orcamentoId);
        }

        if (success) {
            setModalConfig({ type: null, item: null });
            setFormData({ amount: "", desc: "" });
        }
    };

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground overflow-hidden">
            <Toaster position="top-right" richColors />
            <SidebarBuyer />

            <div className="flex flex-1 flex-col md:ml-[240px] lg:ml-[260px] transition-all duration-300">
                
                {/* Header Fixo */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <SidebarBuyer />
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
                            <ShoppingBag className="h-5 w-5 text-primary" /> 
                            <span>Estimativas de Compra</span>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2">
                        <RefreshCcw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* Main Full Height */}
                <main className="flex flex-1 flex-col p-4 md:p-8 gap-4 md:gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    
                    {/* Topo */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
                         <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Cotações e Orçamentos</h1>
                            <p className="text-sm text-muted-foreground">Gerencie valores e envie propostas para aprovação.</p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <BuyerFilters 
                        statusFilter={statusFilter} 
                        setStatusFilter={setStatusFilter} 
                        onRefresh={handleRefresh}
                    />

                    {/* Tabela Flexível */}
                    <BuyerTable 
                        loading={loading} 
                        compras={compras} 
                        pagination={{
                            limit: 10,
                            page: meta?.currentPage || 1,
                            meta: meta || { totalItems: 0, totalPages: 1, currentPage: 1 },
                            hasNext: (meta?.currentPage || 1) < (meta?.totalPages || 1),
                            hasPrevious: (meta?.currentPage || 1) > 1
                        }}
                        onAction={handleOpenModal} 
                        onPageChange={handlePageChange} 
                        onLimitChange={handleLimitChange}
                    />
                </main>
            </div>

            <BuyerModals 
                config={modalConfig} 
                onClose={() => setModalConfig({ type: null, item: null })}
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
            />
        </div>
    );
}