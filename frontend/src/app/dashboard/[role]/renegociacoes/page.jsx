"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, Menu, RefreshCw, CircleDollarSign, RefreshCcw
} from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarManager from "@/components/layout/sidebar-manager";
import { useManagerOrcamentos } from "@/hooks/useManagerOrcamentos";
import { OrcamentoFilters } from "@/components/Orcamentos/OrcamentoComponents";
import OrcamentosTable from "@/components/Orcamentos/OrcamentoTable";
import OrcamentoModals from "@/components/Orcamentos/OrcamentoModals";

const TABS = { PENDENTE: 'pendente', RENEGOCIACAO: 'renegociacao', TODOS: 'todos' };

export default function RenegociacoesPage() {
    const isFirstRun = useRef(true);

    const {
        orcamentos, loading, isSubmitting, pagination,
        fetchOrcamentos, contestarOrcamento
    } = useManagerOrcamentos();

    const [activeTab, setActiveTab] = useState(TABS.PENDENTE);
    const [statusFilter, setStatusFilter] = useState('todos');

    const [detailDialog, setDetailDialog] = useState({ open: false, data: null });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, item: null });
    const [renegText, setRenegText] = useState(""); // Texto da renegociação

    // --- INIT ---
    useEffect(() => {
        const apiStatus = activeTab === TABS.TODOS ? statusFilter : activeTab;
        if (isFirstRun.current) {
            isFirstRun.current = false;
            fetchOrcamentos(pagination.page, pagination.limit, apiStatus);
            return;
        }
        const timer = setTimeout(() => {
            fetchOrcamentos(pagination.page, pagination.limit, apiStatus);
        }, 300);
        return () => clearTimeout(timer);
    }, [activeTab, statusFilter, pagination.page, pagination.limit, fetchOrcamentos]);

    // Handlers Refresh
    const handleRefresh = () => fetchOrcamentos(pagination.page, pagination.limit, activeTab === TABS.TODOS ? statusFilter : activeTab);
    const handlePageChange = (n) => fetchOrcamentos(n, pagination.limit, activeTab === TABS.TODOS ? statusFilter : activeTab);
    const handleLimitChange = (n) => fetchOrcamentos(1, parseInt(n), activeTab === TABS.TODOS ? statusFilter : activeTab);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- OPEN DIALOG HANDLER (Chamado pela Tabela) ---
    const openDecisionConfirm = (decisionType, item) => {
        // Se veio do modal de detalhes, fecha ele
        setDetailDialog(prev => ({ ...prev, open: false }));

        // Preenche o texto se for renegociação para edição (opcional, ou vem vazio)
        if (decisionType === 'renegociacao') setRenegText(item.description || "");
        else setRenegText("");

        setConfirmDialog({ open: true, type: decisionType, item });
    };

    // --- SUBMIT DA DECISÃO ---
    const handleConfirmSubmit = async () => {
        // 1. Verifica dados do estado
        if (!confirmDialog.item || !confirmDialog.type) return;

        // 2. Chama hook (enviando renegText se aplicável)
        const success = await contestarOrcamento(
            confirmDialog.item.id,
            confirmDialog.type,
            confirmDialog.type === 'renegociacao' ? renegText : null
        );

        // 3. Sucesso
        if (success) {
            setConfirmDialog({ open: false, type: null, item: null });
            setRenegText("");
            handleRefresh(); // Atualiza a tabela
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
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="truncate">Gestão de Orçamentos</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2 shadow-sm ml-auto">
                        <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                <main className="flex flex-1 flex-col p-6 md:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    <Tabs defaultValue={TABS.PENDENTE} value={activeTab} onValueChange={(v) => { setActiveTab(v); setStatusFilter('todos'); }} className="flex flex-col flex-1 overflow-hidden gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                            <div className="space-y-1"><h1 className="text-2xl font-bold tracking-tight">Orçamentos Recebidos</h1><p className="text-sm text-muted-foreground">Gerencie e decida sobre os orçamentos.</p></div>
                            <TabsList className="bg-background border border-border p-1 shadow-sm"><TabsTrigger value={TABS.PENDENTE} className="gap-2 w-32"><CircleDollarSign size={14} /> Novos</TabsTrigger><TabsTrigger value={TABS.RENEGOCIACAO} className="gap-2 w-36"><RefreshCcw size={14} /> Renegociações</TabsTrigger><TabsTrigger value={TABS.TODOS} className="gap-2 w-32"><FileText size={14} /> Todos</TabsTrigger></TabsList>
                        </div>
                        <div className="flex-1 flex flex-col overflow-hidden gap-4">
                            {activeTab === TABS.TODOS && <OrcamentoFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} onRefresh={() => { }} />}

                            <OrcamentosTable
                                orcamentos={orcamentos} loading={loading} pagination={pagination}
                                onPageChange={handlePageChange} onLimitChange={handleLimitChange}
                                onRowClick={(item) => setDetailDialog({ open: true, data: item })}
                                // IMPORTANTE: Passamos a função que seta o modal aqui
                                onDecision={openDecisionConfirm}
                            />
                        </div>
                    </Tabs>
                </main>
            </div>

            {/* MODAIS - Passando estados corretamente */}
            <OrcamentoModals
                detailDialog={detailDialog} setDetailDialog={setDetailDialog}
                confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}
                onDecisionClick={openDecisionConfirm} // Para chamar decisão a partir do detalhe
                onConfirmSubmit={handleConfirmSubmit} // Ação Final
                isSubmitting={isSubmitting}
                renegText={renegText} setRenegText={setRenegText}
            />
        </div>
    );
}