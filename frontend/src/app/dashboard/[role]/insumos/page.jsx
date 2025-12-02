"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Menu, RefreshCw, Layers, Boxes } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SidebarManager from "@/components/layout/sidebar-manager";

// Hooks
import { useInsumosOperations } from "@/hooks/useInsumosOperations";
import { useSetoresOperations } from "@/hooks/useSetoresOperations";

// Components
import InsumoFilters from "@/components/Insumos/InsumoFilters";
import InsumosTable from "@/components/Insumos/InsumosTable";
import SetoresTable from "@/components/Setores/SetoresTable";
import SetoresFilters from "@/components/Setores/SetoresFilters"; // Importe o novo filtro

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
    const [searchIns, setSearchIns] = useState(''); // O input textual foi removido visualmente do filtro insumos, mas o estado mantido para seguranca
    const [setorFilter, setSetorFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');
    
    // ------------------ HOOK SETORES ------------------
    const setorOps = useSetoresOperations();
    const [searchSetor, setSearchSetor] = useState('');
    const [statusFilterSetor, setStatusFilterSetor] = useState('todos');

    // Estados Dialogs ... (mantidos)
    const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', editId: null });
    const [detailDialog, setDetailDialog] = useState({ open: false, data: null });
    const [statusDialog, setStatusDialog] = useState({ open: false, item: null });
    const [insumoForm, setInsumoForm] = useState({ name: '', sku: '', setor: '', description: '', measure: 'UN', max_storage: '', status: 'ativo', file: null });

    const [setorFormDialog, setSetorFormDialog] = useState({ open: false, mode: 'create', id: null });
    const [setorStatusDialog, setSetorStatusDialog] = useState({ open: false, item: null });
    const [setorName, setSetorName] = useState('');

    // --- INIT ---
    useEffect(() => {
        const init = async () => {
            insumoOps.fetchDependencies(); 
            insumoOps.fetchData(1, 10);
            // Carrega setores inicialmente
            setorOps.fetchSetores(1, 10, searchSetor, statusFilterSetor); 
        };
        if (isFirstRun.current) {
            isFirstRun.current = false;
            init();
        }
    }, []); // Deps vazias para rodar 1x mount real

    // --- EFFECT FILTROS INSUMOS ---
    useEffect(() => {
        if(!isFirstRun.current) {
            insumoOps.fetchData(insumoOps.pagination.page, insumoOps.pagination.limit, '', setorFilter, statusFilter);
        }
    }, [setorFilter, statusFilter, insumoOps.pagination.page, insumoOps.pagination.limit]);

    // --- EFFECT FILTROS SETORES (Com Debounce para Search) ---
    useEffect(() => {
         if(!isFirstRun.current) {
            const timer = setTimeout(() => {
                setorOps.fetchSetores(setorOps.pagination.page, setorOps.pagination.limit, searchSetor, statusFilterSetor);
            }, 500);
            return () => clearTimeout(timer);
         }
    }, [searchSetor, statusFilterSetor, setorOps.pagination.page, setorOps.pagination.limit]);

    // --- REFRESH GLOBAL ---
    const handleRefresh = () => {
        if(activeTab === TABS.INSUMOS) {
            insumoOps.fetchData(insumoOps.pagination.page, insumoOps.pagination.limit, '', setorFilter, statusFilter);
            insumoOps.fetchDependencies();
        } else {
            setorOps.fetchSetores(setorOps.pagination.page, setorOps.pagination.limit, searchSetor, statusFilterSetor);
        }
    };

    // --- HANDLERS UI (Sem alteração) ---
    const handleFileChange = (e) => { if (e.target.files?.[0]) setInsumoForm(prev => ({ ...prev, file: e.target.files[0] })); };
    const openCreateInsumo = () => { setInsumoForm({ name: '', sku: '', setor: '', description: '', measure: 'UN', max_storage: '', status: 'ativo', file: null }); setFormDialog({ open: true, mode: 'create', editId: null }); };
    const openEditInsumo = (item) => { setInsumoForm({ name: item.name, sku: item.sku, setor: item.setorName === 'N/A' ? '' : item.setorName, description: item.description||'', measure: item.measure||'UN', max_storage: item.max_storage, status: item.status, file: null }); setDetailDialog(prev => ({ ...prev, open: false })); setFormDialog({ open: true, mode: 'edit', editId: item.id }); };
    const handleSubmitInsumo = async (e) => { e.preventDefault(); let success = false; if (formDialog.mode === 'create') success = await insumoOps.createInsumo(insumoForm); else success = await insumoOps.updateInsumo(formDialog.editId, insumoForm); if (success) { setFormDialog({ ...formDialog, open: false }); insumoOps.fetchData(insumoOps.pagination.page, insumoOps.pagination.limit, '', setorFilter, statusFilter); insumoOps.fetchDependencies(); } };
    const confirmInsumoStatus = async () => { if(!statusDialog.item) return; const success = await insumoOps.toggleStatus(statusDialog.item.id, statusDialog.item.status); if (success) { if (detailDialog.open && detailDialog.data?.id === statusDialog.item.id) { setDetailDialog(prev => ({...prev, data: { ...prev.data, status: statusDialog.item.status === 'ativo' ? 'inativo' : 'ativo' } })); } setStatusDialog({ open: false, item: null }); }};
    const handleVerifyInsumo = async (item) => { if (!item) return; const newDate = await insumoOps.verifyInsumo(item.id); if (newDate) setDetailDialog(prev => ({ ...prev, data: { ...prev.data, last_check: newDate } })); };
    const openCreateSetor = () => { setSetorName(''); setSetorFormDialog({ open: true, mode: 'create', id: null }); };
    const openEditSetor = (item) => { setSetorName(item.name); setSetorFormDialog({ open: true, mode: 'edit', id: item.id }); };
    const handleSubmitSetor = async (e) => { e.preventDefault(); let success = false; if(setorFormDialog.mode === 'create') success = await setorOps.createSetor({ name: setorName }); else success = await setorOps.updateSetorName(setorFormDialog.id, setorName); if(success) { setSetorFormDialog({ ...setorFormDialog, open: false }); setorOps.fetchSetores(); insumoOps.fetchDependencies(); }};
    const confirmSetorStatus = async () => { if(!setorStatusDialog.item) return; const success = await setorOps.toggleSetorStatus(setorStatusDialog.item.id, setorStatusDialog.item.status); if(success) { setSetorStatusDialog({ open: false, item: null }); setorOps.fetchSetores(setorOps.pagination.page, setorOps.pagination.limit, searchSetor, statusFilterSetor); insumoOps.fetchDependencies(); }};

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            <SidebarManager />
            <div className="flex flex-1 flex-col min-h-screen lg:ml-64 transition-all duration-300">
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <div className="flex items-center gap-4"><Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button></SheetTrigger><SheetContent side="left" className="p-0 w-64"><SidebarManager /></SheetContent></Sheet><div className="flex items-center gap-2 font-semibold text-lg text-foreground"><Boxes className="h-5 w-5 text-primary" /><span>Gestão de Materiais</span></div></div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={insumoOps.loading || setorOps.loading} className="gap-2"><RefreshCw className={clsx("h-4 w-4", (insumoOps.loading || setorOps.loading) && "animate-spin")} /><span className="hidden sm:inline">Atualizar</span></Button>
                </header>

                <main className="flex flex-1 flex-col p-6 md:p-8 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
                    <Tabs defaultValue={TABS.INSUMOS} value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden gap-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
                            <div className="space-y-4">
                                <div className="space-y-1"><h1 className="text-2xl font-bold tracking-tight">{activeTab === TABS.INSUMOS ? "Catálogo de Insumos" : "Configuração de Setores"}</h1><p className="text-sm text-muted-foreground">{activeTab === TABS.INSUMOS ? "Monitore o estoque." : "Organize as áreas físicas."}</p></div>
                                <TabsList className="bg-background border border-border p-1 shadow-sm w-fit"><TabsTrigger value={TABS.INSUMOS} className="gap-2 w-32"><Package size={14}/> Insumos</TabsTrigger><TabsTrigger value={TABS.SETORES} className="gap-2 w-32"><Layers size={14}/> Setores</TabsTrigger></TabsList>
                            </div>
                            <Button onClick={activeTab === TABS.INSUMOS ? openCreateInsumo : openCreateSetor} className="bg-primary hover:bg-primary/90 shadow-sm"><Plus className="mr-2 h-4 w-4" /> {activeTab === TABS.INSUMOS ? "Novo Insumo" : "Novo Setor"}</Button>
                        </div>

                        <TabsContent value={TABS.INSUMOS} className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden gap-4">
                            <InsumoFilters setorFilter={setorFilter} setSetorFilter={setSetorFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} setores={insumoOps.setores} onFilterChange={()=>{}}/>
                            <InsumosTable insumos={insumoOps.insumos} loading={insumoOps.loading} pagination={insumoOps.pagination} onRowClick={(item) => setDetailDialog({open:true, data:item})} onToggleStatus={(e, item) => { e.stopPropagation(); setStatusDialog({ open: true, item }); }} onPageChange={(p) => insumoOps.fetchData(p, insumoOps.pagination.limit, '', setorFilter, statusFilter)} onLimitChange={(val) => insumoOps.fetchData(1, parseInt(val), '', setorFilter, statusFilter)}/>
                        </TabsContent>

                        <TabsContent value={TABS.SETORES} className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden gap-4">
                             <SetoresFilters 
                                search={searchSetor} setSearch={setSearchSetor}
                                statusFilter={statusFilterSetor} setStatusFilter={setStatusFilterSetor}
                                onFilterChange={() => {}} // Effect cuida do resto
                             />
                             <SetoresTable setores={setorOps.setores} loading={setorOps.loading} pagination={setorOps.pagination} onEdit={openEditSetor} onToggleStatus={(e, item) => { e.stopPropagation(); setSetorStatusDialog({ open: true, item }); }} onPageChange={(p) => setorOps.fetchSetores(p, setorOps.pagination.limit, searchSetor, statusFilterSetor)} onLimitChange={(val) => setorOps.fetchSetores(1, parseInt(val), searchSetor, statusFilterSetor)}/>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* DIALOGS INSUMOS */}
            <CreateEditInsumoDialog open={formDialog.open} onOpenChange={(v)=>setFormDialog({...formDialog, open:v})} mode={formDialog.mode} formData={insumoForm} setFormData={setInsumoForm} handleFileChange={handleFileChange} onSubmit={handleSubmitInsumo} setores={insumoOps.setores} occupiedSectors={insumoOps.occupiedSectors} isSubmitting={insumoOps.isSubmitting}/>
            <InsumoDetailsDialog open={detailDialog.open} onOpenChange={(v)=>setDetailDialog({...detailDialog, open:v})} data={detailDialog.data} onStatusClick={(e, item) => { e.stopPropagation(); setStatusDialog({open:true, item}); }} onEditClick={openEditInsumo} onVerifyClick={handleVerifyInsumo}/>
            <StatusConfirmationDialog open={statusDialog.open} onOpenChange={(v)=>setStatusDialog({...statusDialog, open:v})} item={statusDialog.item} onConfirm={confirmInsumoStatus} isSubmitting={insumoOps.isSubmitting}/>
            
            {/* DIALOGS SETORES */}
            <CreateEditSetorDialog open={setorFormDialog.open} onOpenChange={(v)=>setSetorFormDialog({...setorFormDialog, open:v})} mode={setorFormDialog.mode} name={setorName} setName={setSetorName} onSubmit={handleSubmitSetor} isSubmitting={setorOps.isSubmitting}/>
            <StatusConfirmationDialog open={setorStatusDialog.open} onOpenChange={(v)=>setSetorStatusDialog({...setorStatusDialog, open:v})} item={setorStatusDialog.item} onConfirm={confirmSetorStatus} isSubmitting={setorOps.isSubmitting}/>
        </div>
    );
}