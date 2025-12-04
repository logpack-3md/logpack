"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Menu, RefreshCw, Layers, Boxes } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// NOTA: SidebarManager mantido intacto conforme solicitado, apenas gerenciado pelo estado local.
import SidebarManager from "@/components/layout/sidebar-manager";

// Hooks
import { useInsumosOperations } from "@/hooks/useInsumosOperations";
import { useSetoresOperations } from "@/hooks/useSetoresOperations";

// Components
import InsumoFilters from "@/components/Insumos/InsumoFilters";
import InsumosTable from "@/components/Insumos/InsumosTable";
import SetoresTable from "@/components/Setores/SetoresTable";
import SetoresFilters from "@/components/Setores/SetoresFilters";
import CreateEditInsumoDialog from "@/components/Insumos/Modals/CreateEditInsumoDialog";
import InsumoDetailsDialog from "@/components/Insumos/Modals/InsumoDetailsDialog";
import StatusConfirmationDialog from "@/components/Insumos/Modals/StatusConfirmationDialog";
import CreateEditSetorDialog from "@/components/Setores/Modals/CreateEditSetorDialog";

const TABS = { INSUMOS: 'insumos', SETORES: 'setores' };

export default function GestaoMateriaisPage() {
    const isFirstRun = useRef(true);
    const [activeTab, setActiveTab] = useState(TABS.INSUMOS);

    // ------------------ HOOK INSUMOS ------------------
    const insumoOps = useInsumosOperations();
    const [searchIns, setSearchIns] = useState('');
    const [setorFilter, setSetorFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');

    // ------------------ HOOK SETORES ------------------
    const setorOps = useSetoresOperations();
    const [searchSetor, setSearchSetor] = useState('');
    const [statusFilterSetor, setStatusFilterSetor] = useState('todos');

    // Estados Dialogs
    const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', editId: null });
    const [detailDialog, setDetailDialog] = useState({ open: false, data: null });
    const [statusDialog, setStatusDialog] = useState({ open: false, item: null });
    const [insumoForm, setInsumoForm] = useState({ name: '', sku: '', setor: '', description: '', measure: '', max_storage: '', status: 'ativo', file: null });

    const [setorFormDialog, setSetorFormDialog] = useState({ open: false, mode: 'create', id: null });
    const [setorStatusDialog, setSetorStatusDialog] = useState({ open: false, item: null });
    const [setorName, setSetorName] = useState('');

    // --- INIT ---
    useEffect(() => {
        const init = async () => {
            insumoOps.fetchDependencies();
            insumoOps.fetchData(1, 10);
            setorOps.fetchSetores(1, 10, searchSetor, statusFilterSetor);
        };
        if (isFirstRun.current) {
            isFirstRun.current = false;
            init();
        }
    }, []);

    // --- EFFECT FILTROS INSUMOS ---
    useEffect(() => {
        if (!isFirstRun.current) {
            insumoOps.fetchData(insumoOps.pagination.page, insumoOps.pagination.limit, '', setorFilter, statusFilter);
        }
    }, [setorFilter, statusFilter, insumoOps.pagination.page, insumoOps.pagination.limit]);

    // --- EFFECT FILTROS SETORES (Com Debounce para Search) ---
    useEffect(() => {
        if (!isFirstRun.current) {
            const timer = setTimeout(() => {
                setorOps.fetchSetores(setorOps.pagination.page, setorOps.pagination.limit, searchSetor, statusFilterSetor);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchSetor, statusFilterSetor, setorOps.pagination.page, setorOps.pagination.limit]);

    // --- REFRESH GLOBAL ---
    const handleRefresh = () => {
        if (activeTab === TABS.INSUMOS) {
            insumoOps.fetchData(insumoOps.pagination.page, insumoOps.pagination.limit, '', setorFilter, statusFilter);
            insumoOps.fetchDependencies();
        } else {
            setorOps.fetchSetores(setorOps.pagination.page, setorOps.pagination.limit, searchSetor, statusFilterSetor);
        }
    };

    // --- HANDLERS UI (Sem alteração lógica) ---
    const handleFileChange = (e) => { if (e.target.files?.[0]) setInsumoForm(prev => ({ ...prev, file: e.target.files[0] })); };
    const openCreateInsumo = () => { setInsumoForm({ name: '', sku: '', setor: '', description: '', measure: 'UN', max_storage: '', status: 'ativo', file: null }); setFormDialog({ open: true, mode: 'create', editId: null }); };
    const openEditInsumo = (item) => { setInsumoForm({ name: item.name, sku: item.sku, setor: item.setorName === 'N/A' ? '' : item.setorName, description: item.description || '', measure: item.measure || 'UN', max_storage: item.max_storage, status: item.status, file: null }); setDetailDialog(prev => ({ ...prev, open: false })); setFormDialog({ open: true, mode: 'edit', editId: item.id }); };
    const handleSubmitInsumo = async (e) => { e.preventDefault(); let success = false; if (formDialog.mode === 'create') success = await insumoOps.createInsumo(insumoForm); else success = await insumoOps.updateInsumo(formDialog.editId, insumoForm); if (success) { setFormDialog({ ...formDialog, open: false }); insumoOps.fetchData(insumoOps.pagination.page, insumoOps.pagination.limit, '', setorFilter, statusFilter); insumoOps.fetchDependencies(); } };
    const confirmInsumoStatus = async () => { if (!statusDialog.item) return; const success = await insumoOps.toggleStatus(statusDialog.item.id, statusDialog.item.status); if (success) { if (detailDialog.open && detailDialog.data?.id === statusDialog.item.id) { setDetailDialog(prev => ({ ...prev, data: { ...prev.data, status: statusDialog.item.status === 'ativo' ? 'inativo' : 'ativo' } })); } setStatusDialog({ open: false, item: null }); } };
    const handleVerifyInsumo = async (item) => { if (!item) return; const newDate = await insumoOps.verifyInsumo(item.id); if (newDate) setDetailDialog(prev => ({ ...prev, data: { ...prev.data, last_check: newDate } })); };
    const openCreateSetor = () => { setSetorName(''); setSetorFormDialog({ open: true, mode: 'create', id: null }); };
    const openEditSetor = (item) => { setSetorName(item.name); setSetorFormDialog({ open: true, mode: 'edit', id: item.id }); };
    const handleSubmitSetor = async (e) => { e.preventDefault(); let success = false; if (setorFormDialog.mode === 'create') success = await setorOps.createSetor({ name: setorName }); else success = await setorOps.updateSetorName(setorFormDialog.id, setorName); if (success) { setSetorFormDialog({ ...setorFormDialog, open: false }); setorOps.fetchSetores(); insumoOps.fetchDependencies(); } };
    const confirmSetorStatus = async () => { if (!setorStatusDialog.item) return; const success = await setorOps.toggleSetorStatus(setorStatusDialog.item.id, setorStatusDialog.item.status); if (success) { setSetorStatusDialog({ open: false, item: null }); setorOps.fetchSetores(setorOps.pagination.page, setorOps.pagination.limit, searchSetor, statusFilterSetor); insumoOps.fetchDependencies(); } };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />

            {/* Overlay para Mobile */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden transition-opacity duration-300",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Manager */}
            <SidebarManager isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300 w-full">

                {/* Header Responsivo */}
                <header className="sticky top-0 z-30 flex items-center px-4 h-14 lg:h-16 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 mr-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 font-semibold text-lg truncate">
                        <Boxes className="h-5 w-5 text-primary shrink-0" />
                        <span className="truncate">Gestão de Materiais</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={insumoOps.loading || setorOps.loading}
                        className="gap-2 ml-auto shrink-0"
                    >
                        <RefreshCw className={clsx("h-4 w-4", (insumoOps.loading || setorOps.loading) && "animate-spin")} />
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                </header>

                {/* Conteúdo Principal com Scroll Responsivo */}
                <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6 overflow-hidden h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]">

                    <Tabs defaultValue={TABS.INSUMOS} value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden gap-4 sm:gap-6">

                        {/* Header das Tabs e Botão Principal */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                            <div className="space-y-4 w-full sm:w-auto">


                                <div className="space-y-1">
                                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                        {activeTab === TABS.INSUMOS ? "Catálogo de Insumos" : "Configuração de Setores"}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {activeTab === TABS.INSUMOS ? "Monitore o estoque." : "Organize as áreas físicas."}
                                    </p>
                                </div>


                                {/* TabsList com largura total no mobile para facilitar o toque */}
                                <TabsList className="bg-background border border-border p-0 shadow-sm w-full sm:w-fit grid grid-cols-2 sm:flex">
                                    <TabsTrigger value={TABS.INSUMOS} className="gap-2 w-full sm:w-32 justify-center">
                                        <Package size={14} /> Insumos
                                    </TabsTrigger>
                                    <TabsTrigger value={TABS.SETORES} className="gap-2 w-full sm:w-32 justify-center">
                                        <Layers size={14} /> Setores
                                    </TabsTrigger>
                                </TabsList>

                                
                            </div>

                            {/* Botão de Criação - Largura total no mobile */}
                            <Button
                                onClick={activeTab === TABS.INSUMOS ? openCreateInsumo : openCreateSetor}
                                className="bg-primary hover:bg-primary/90 shadow-sm w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {activeTab === TABS.INSUMOS ? "Novo Insumo" : "Novo Setor"}
                            </Button>
                        </div>

                        {/* Conteúdo Insumos */}
                        <TabsContent value={TABS.INSUMOS} className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden gap-4 min-h-0">
                            <div className="flex-none">
                                <InsumoFilters
                                    setorFilter={setorFilter}
                                    setSetorFilter={setSetorFilter}
                                    statusFilter={statusFilter}
                                    setStatusFilter={setStatusFilter}
                                    setores={insumoOps.setores}
                                    onFilterChange={() => { }}
                                />
                            </div>

                            {/* Container da Tabela com Scroll Horizontal e Vertical */}
                            <div className="flex-1 overflow-auto border rounded-md bg-background">
                                <div className="min-w-[800px] md:min-w-0"> {/* Garante largura mínima para tabela não quebrar layout */}
                                    <InsumosTable
                                        insumos={insumoOps.insumos}
                                        loading={insumoOps.loading}
                                        pagination={insumoOps.pagination}
                                        onRowClick={(item) => setDetailDialog({ open: true, data: item })}
                                        onToggleStatus={(e, item) => { e.stopPropagation(); setStatusDialog({ open: true, item }); }}
                                        onPageChange={(p) => insumoOps.fetchData(p, insumoOps.pagination.limit, '', setorFilter, statusFilter)}
                                        onLimitChange={(val) => insumoOps.fetchData(1, parseInt(val), '', setorFilter, statusFilter)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Conteúdo Setores */}
                        <TabsContent value={TABS.SETORES} className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden gap-4 min-h-0">
                            <div className="flex-none">
                                <SetoresFilters
                                    search={searchSetor} setSearch={setSearchSetor}
                                    statusFilter={statusFilterSetor} setStatusFilter={setStatusFilterSetor}
                                    onFilterChange={() => { }}
                                />
                            </div>

                            {/* Container da Tabela com Scroll Horizontal e Vertical */}
                            <div className="flex-1 overflow-auto border rounded-md bg-background">
                                <div className="min-w-[600px] md:min-w-0">
                                    <SetoresTable
                                        setores={setorOps.setores}
                                        loading={setorOps.loading}
                                        pagination={setorOps.pagination}
                                        onEdit={openEditSetor}
                                        onToggleStatus={(e, item) => { e.stopPropagation(); setSetorStatusDialog({ open: true, item }); }}
                                        onPageChange={(p) => setorOps.fetchSetores(p, setorOps.pagination.limit, searchSetor, statusFilterSetor)}
                                        onLimitChange={(val) => setorOps.fetchSetores(1, parseInt(val), searchSetor, statusFilterSetor)}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* DIALOGS INSUMOS */}
            <CreateEditInsumoDialog open={formDialog.open} onOpenChange={(v) => setFormDialog({ ...formDialog, open: v })} mode={formDialog.mode} formData={insumoForm} setFormData={setInsumoForm} handleFileChange={handleFileChange} onSubmit={handleSubmitInsumo} setores={insumoOps.setores} occupiedSectors={insumoOps.occupiedSectors} isSubmitting={insumoOps.isSubmitting} />
            <InsumoDetailsDialog open={detailDialog.open} onOpenChange={(v) => setDetailDialog({ ...detailDialog, open: v })} data={detailDialog.data} onStatusClick={(e, item) => { e.stopPropagation(); setStatusDialog({ open: true, item }); }} onEditClick={openEditInsumo} onVerifyClick={handleVerifyInsumo} />
            <StatusConfirmationDialog open={statusDialog.open} onOpenChange={(v) => setStatusDialog({ ...statusDialog, open: v })} item={statusDialog.item} onConfirm={confirmInsumoStatus} isSubmitting={insumoOps.isSubmitting} />

            {/* DIALOGS SETORES */}
            <CreateEditSetorDialog open={setorFormDialog.open} onOpenChange={(v) => setSetorFormDialog({ ...setorFormDialog, open: v })} mode={setorFormDialog.mode} name={setorName} setName={setSetorName} onSubmit={handleSubmitSetor} isSubmitting={setorOps.isSubmitting} />
            <StatusConfirmationDialog open={setorStatusDialog.open} onOpenChange={(v) => setSetorStatusDialog({ ...setorStatusDialog, open: v })} item={setorStatusDialog.item} onConfirm={confirmSetorStatus} isSubmitting={setorOps.isSubmitting} />
        </div>
    );
}