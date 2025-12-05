"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Menu } from 'lucide-react';
import clsx from 'clsx';
import { Toaster, toast } from 'sonner';
import { Button } from "@/components/ui/button";
import SidebarBuyer from "@/components/layout/sidebar-buyer";
import BuyerTable from "@/components/Buyer/BuyerTable";
import BuyerFilters from "@/components/Buyer/BuyerFilters";
import BuyerModals from "@/components/Buyer/BuyerModals";
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function EstimarPage() {
    const {
        compras, loading, meta, isSubmitting,
        fetchCompras, createOrcamento, renegociarOrcamento, cancelarOrcamento
    } = useBuyerOperations();

    const [statusFilter, setStatusFilter] = useState('todos');
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchCompras(1, 10, statusFilter === 'todos' ? '' : statusFilter);
    }, [fetchCompras, statusFilter]);

    const handleRefresh = () => fetchCompras(meta.currentPage, 10, statusFilter === 'todos' ? '' : statusFilter);
    const handlePageChange = (p) => fetchCompras(p, 10, statusFilter === 'todos' ? '' : statusFilter);
    const handleLimitChange = (limit) => fetchCompras(1, parseInt(limit), statusFilter === 'todos' ? '' : statusFilter);

    const handleOpenModal = (type, item) => {
        let valor = "";
        if (type === 'renegotiate' && item.orcamento) {
            valor = item.orcamento.valor_total ? String(item.orcamento.valor_total) : "";
        }
        setFormData({ amount: valor, desc: "" });
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
        const numericAmount = formData.amount ? parseFloat(formData.amount) : 0;
        const desc = formData.desc || "";

        const payloadData = {
            valor_total: numericAmount,
            description: desc
        };

        if (type === 'create') {
            success = await createOrcamento(item.id, payloadData);
        }
        else if (type === 'renegotiate') {
            if (!orcamentoId) { toast.error("Erro técnico: Orçamento não encontrado."); return; }
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

            {isSidebarOpen && ( <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
            )}
            <SidebarBuyer isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)}/>

            <div className="flex flex-1 flex-col min-w-0 w-full md:ml-[240px] lg:ml-[260px] transition-all duration-300">

                <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-border bg-background/80 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none lg:hidden"
                            aria-label="Abrir menu"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex items-center gap-2 font-semibold text-lg overflow-hidden">
                            <ShoppingBag className="h-5 w-5 text-primary shrink-0" />
                            <span className="truncate">Estimativas</span>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2 shadow-sm shrink-0">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="space-y-1">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Painel de Orçamentos</h1>
                            <p className="text-sm text-muted-foreground">Analise pedidos, responda solicitações e gerencie custos.</p>
                        </div>
                    </div>


                    <div className="w-full">
                        <BuyerFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} onRefresh={handleRefresh} />
                    </div>


                    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[800px] align-middle inline-block w-full">
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
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <BuyerModals
                config={modalConfig} onClose={handleCloseModal}
                formData={formData} setFormData={setFormData}
                onSubmit={handleSubmit} isSubmitting={isSubmitting}
            />
        </div>
    );
}