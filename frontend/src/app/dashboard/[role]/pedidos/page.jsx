"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Truck, Menu, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// Layout
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarManager from "@/components/layout/sidebar-manager";
import { useManagerOrders } from "@/hooks/useManagerOrders";

// Refactored Components
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
    
    // Estados UI Modais
    const [actionDialog, setActionDialog] = useState({ open: false, type: null, item: null });
    const [buyDialog, setBuyDialog] = useState({ open: false, item: null });
    const [buyForm, setBuyForm] = useState({ amount: '', description: '' });
    const [detailDialog, setDetailDialog] = useState({ open: false, isLoading: false, data: null });

    // --- CARREGAMENTO ---
    useEffect(() => {
        if (isFirstRun.current) { isFirstRun.current = false; fetchPedidos(pagination.page, pagination.limit, search, statusFilter); return; }
        const timer = setTimeout(() => { fetchPedidos(pagination.page, pagination.limit, search, statusFilter); }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter, pagination.page, pagination.limit]);

    // --- HANDLERS ---
    const handleRefresh = () => fetchPedidos(pagination.page, pagination.limit, search, statusFilter);
    
    const handleOpenDetails = async (pedidoSimples) => {
        setDetailDialog({ open: true, isLoading: true, data: pedidoSimples });
        const completeData = await getPedidoDetails(pedidoSimples.id);
        setDetailDialog({ open: true, isLoading: false, data: completeData ? { ...pedidoSimples, ...completeData } : pedidoSimples });
    };

    const openActionDialog = (e, type, item) => { if(e) e.stopPropagation(); setDetailDialog(p => ({...p, open: false})); setActionDialog({ open: true, type, item }); };
    const openBuyDialog = (e, item) => { if(e) e.stopPropagation(); setDetailDialog(p => ({...p, open: false})); setBuyDialog({ open: true, item }); setBuyForm({ amount: '', description: '' }); };

    const confirmStatusUpdate = async () => {
        if (!actionDialog.item) return;
        const newStatus = actionDialog.type === 'approve' ? 'aprovado' : 'negado';
        const success = await updateStatus(actionDialog.item.id, newStatus);
        if (success) { setActionDialog({ open: false, item: null }); fetchPedidos(pagination.page, pagination.limit, search, statusFilter); }
    };
    const handleSubmitCompra = async () => {
        if(!buyDialog.item) return;
        const success = await createCompra(buyDialog.item.id, buyForm);
        if (success) { setBuyDialog({ open: false, item: null }); fetchPedidos(pagination.page, pagination.limit, search, statusFilter); }
    };

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            <SidebarManager />
            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button></SheetTrigger><SheetContent side="left" className="p-0 w-64"><SidebarManager /></SheetContent></Sheet>
                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground"><Truck className="h-5 w-5 text-primary" /><span>Pedidos</span></div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2"><RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} /><span className="hidden sm:inline">Atualizar</span></Button>
                </header>

                <main className="flex flex-1 flex-col p-6 md:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0"><div className="space-y-1"><h1 className="text-2xl font-bold tracking-tight">Solicitações de Insumo</h1><p className="text-sm text-muted-foreground">Gerencie as aprovações pendentes.</p></div></div>

                    <PedidosFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>
                    <PedidosTable 
                        loading={loading} pedidos={pedidos} pagination={pagination} 
                        onRowClick={handleOpenDetails} 
                        onOpenActionDialog={openActionDialog} 
                        onOpenBuyDialog={openBuyDialog}
                        onPageChange={(p) => fetchPedidos(p, pagination.limit, search, statusFilter)}
                        onLimitChange={(val) => fetchPedidos(1, parseInt(val), search, statusFilter)}
                    />
                </main>
            </div>

            <PedidoModals 
                detailDialog={detailDialog} setDetailDialog={setDetailDialog}
                actionDialog={actionDialog} setActionDialog={setActionDialog} onConfirmStatusUpdate={confirmStatusUpdate}
                buyDialog={buyDialog} setBuyDialog={setBuyDialog} buyForm={buyForm} setBuyForm={setBuyForm} onSubmitCompra={handleSubmitCompra}
                onOpenActionDialog={openActionDialog} onOpenBuyDialog={openBuyDialog} isSubmitting={isSubmitting}
            />
        </div>
    );
}