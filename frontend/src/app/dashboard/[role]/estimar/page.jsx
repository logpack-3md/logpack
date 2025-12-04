"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCcw, Menu } from 'lucide-react';
import clsx from 'clsx';
import { Toaster, toast } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Components Customizados
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

    // Estados de Controle do Modal
    const [modalConfig, setModalConfig] = useState({ type: null, item: null });
    const [formData, setFormData] = useState({ amount: "", desc: "" });

    // --- INICIALIZAÇÃO ---
    useEffect(() => {
        fetchCompras(1, 10, statusFilter === 'todos' ? '' : statusFilter);
    }, [fetchCompras, statusFilter]);

    // --- HANDLERS ---
    const handleRefresh = () => fetchCompras(meta.currentPage, 10, statusFilter === 'todos' ? '' : statusFilter);
    const handlePageChange = (p) => fetchCompras(p, 10, statusFilter === 'todos' ? '' : statusFilter);
    const handleLimitChange = (limit) => fetchCompras(1, parseInt(limit), statusFilter === 'todos' ? '' : statusFilter);

    const handleOpenModal = (type, item) => {
        let valor = "";
        // Preenche valor apenas se for renegociação para facilitar
        if (type === 'renegotiate' && item.orcamento) {
            valor = item.orcamento.valor_total ? String(item.orcamento.valor_total) : "";
        }
        // Descrição começa vazia para forçar o buyer a escrever algo novo
        setFormData({ amount: valor, desc: "" });
        setModalConfig({ type, item });
    };

    const handleCloseModal = () => {
        setModalConfig({ type: null, item: null });
        setFormData({ amount: "", desc: "" });
    };

    // --- SUBMIT (Criação, Renegociação e Cancelamento) ---
    const handleSubmit = async () => {
        const { type, item } = modalConfig;
        if (!item) return;

        const orcamentoId = item.orcamento?.id;
        let success = false;

        // --- PAYLOAD ---
        // Não convertemos aqui para não dar erro de NaN, passamos e deixamos o backend ou a conversão lá dentro
        // Mas é bom converter string pra number pro Zod ler corretamente
        const numericAmount = formData.amount ? parseFloat(formData.amount) : 0;
        const desc = formData.desc || ""; // Garante string, backend valida se está vazia

        const payloadData = {
            valor_total: numericAmount,
            description: desc
        };

        // Lógica de Ação
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

        // Só fecha se tiver sucesso. Se tiver erro de validação (ex: descrição curta), o hook já mostrou o toast e retornou false.
        // O modal continua aberto pro usuário corrigir.
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

                {/* Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button></SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64"><SidebarBuyer /></SheetContent>
                        </Sheet>
                        <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            <span>Estimativas e Cotações</span>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2">
                        <RefreshCcw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* Main */}
                <main className="flex flex-1 flex-col p-4 md:p-8 gap-4 md:gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
                        <div className="space-y-1"><h1 className="text-2xl font-bold tracking-tight">Painel de Orçamentos</h1><p className="text-sm text-muted-foreground">Analise pedidos, responda solicitações e gerencie custos.</p></div>
                    </div>

                    <BuyerFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} onRefresh={handleRefresh} />

                    <BuyerTable
                        loading={loading} compras={compras}
                        pagination={{ limit: 10, page: meta?.currentPage || 1, meta: meta || { totalItems: 0, totalPages: 1, currentPage: 1 }, hasNext: (meta?.currentPage || 1) < (meta?.totalPages || 1), hasPrevious: (meta?.currentPage || 1) > 1 }}
                        onAction={handleOpenModal} onPageChange={handlePageChange} onLimitChange={handleLimitChange}
                    />
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