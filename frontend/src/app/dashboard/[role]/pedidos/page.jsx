"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Truck, Menu, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Layout
import SidebarManager from "@/components/layout/sidebar-manager";

// Hook de Lógica
import { useManagerOrders } from "@/hooks/useManagerOrders";

// *** COMPONENTES MODULARIZADOS ***
import PedidosFilters from "@/components/Pedidos/PedidosFilters";
import PedidosTable from "@/components/Pedidos/PedidosTable";
import PedidoModals from "@/components/Pedidos/PedidoModals";

export default function PedidosManagerPage() {
    const isFirstRun = useRef(true);

    const {
        pedidos, loading, isSubmitting, pagination,
        fetchPedidos, updateStatus, createCompra, getPedidoDetails
    } = useManagerOrders();

    // Filtros
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');

    // Estados de Modais
    const [actionDialog, setActionDialog] = useState({ open: false, type: null, item: null });
    const [buyDialog, setBuyDialog] = useState({ open: false, item: null });
    const [buyForm, setBuyForm] = useState({ amount: '', description: '' });
    const [detailDialog, setDetailDialog] = useState({ open: false, isLoading: false, data: null });


    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    // --- INIT & LOAD ---
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
    }, [search, statusFilter, pagination.page, pagination.limit]); // Removido fetchPedidos da dependência para evitar loop se o hook recriar

    // --- HANDLERS DE ESTADO (Wrapper functions) ---
    const handleRefresh = () => fetchPedidos(pagination.page, pagination.limit, search, statusFilter);

    const handleOpenDetails = async (pedidoSimples) => {
        setDetailDialog({ open: true, isLoading: true, data: pedidoSimples });

        const completeData = await getPedidoDetails(pedidoSimples.id);

        // Mesclagem Segura para não perder o ID que já está na lista
        const mergedData = {
            ...pedidoSimples,
            ...completeData,
            requesterId: completeData?.userId || completeData?.requesterId || pedidoSimples.requesterId || pedidoSimples.userId
        };

        setDetailDialog({
            open: true,
            isLoading: false,
            data: mergedData
        });
    };

    const openActionDialog = (e, type, item) => {
        if (e) e.stopPropagation();
        // Fecha detalhes se estiver aberto para focar na ação
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
        // Pega SKU do item selecionado
        const sku = buyDialog.item.sku || buyDialog.item.insumoSKU;

        const success = await createCompra(buyDialog.item.id, buyForm, sku);

        if (success) {
            setBuyDialog({ open: false, item: null });
            fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
        }
    };

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />

            <SidebarManager isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">

                {/* Header Mobile / Desktop */}
                <header className="sticky top-0 z-30 flex items-center px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="truncate">Pedidos</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2 shadow-sm ml-auto">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>


                <main className="flex flex-1 flex-col p-6 md:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">

                    {/* Título */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                        <div className="space-y-1"><h1 className="text-2xl font-bold tracking-tight">Solicitações de Insumo</h1><p className="text-sm text-muted-foreground">Gerencie as aprovações pendentes.</p></div>
                    </div>

                    {/* FILTROS (Modularizado) */}
                    <PedidosFilters
                        search={search}
                        setSearch={setSearch}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />

                    {/* TABELA (Modularizada) */}
                    <PedidosTable
                        loading={loading}
                        pedidos={pedidos}
                        pagination={pagination}
                        statusFilter={statusFilter} // Passar para mostrar texto "sem resultados" correto
                        onRowClick={handleOpenDetails}
                        onOpenActionDialog={openActionDialog}
                        onOpenBuyDialog={openBuyDialog}
                        onPageChange={(p) => fetchPedidos(p, pagination.limit, search, statusFilter)}
                        onLimitChange={(val) => fetchPedidos(1, parseInt(val), search, statusFilter)}
                    />
                </main>
            </div>

            {/* MODAIS (Modularizado) */}
            <PedidoModals
                detailDialog={detailDialog} setDetailDialog={setDetailDialog}
                actionDialog={actionDialog} setActionDialog={setActionDialog}
                buyDialog={buyDialog} setBuyDialog={setBuyDialog}

                onOpenActionDialog={openActionDialog}
                onOpenBuyDialog={openBuyDialog}

                onConfirmStatusUpdate={confirmStatusUpdate}
                onSubmitCompra={handleSubmitCompra}

                buyForm={buyForm} setBuyForm={setBuyForm}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}