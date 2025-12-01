"use client";

import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Plus, Search, Package, 
    FileText, CheckCircle2, Clock, XCircle, Loader2, Menu, RefreshCw
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast, Toaster } from 'sonner';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Componentes
import SidebarEmployee from '@/components/layout/sidebar-employee';
import EmployeeInsumosGrid from '@/components/Blocks/Insumos/EmployeeInsumosGrid';
import { useEmployeeOperations } from '@/hooks/useEmployeeOperations';

export default function EmployeeDashboard() {
    // Extraindo fetchActiveSkus e allActiveSkus do hook atualizado
    const { pedidos, allActiveSkus, meta, loading, isSubmitting, fetchPedidos, fetchActiveSkus, criarSolicitacao } = useEmployeeOperations();
    
    const [skuInput, setSkuInput] = useState('');
    const [activeTab, setActiveTab] = useState('pedidos');
    const [rowsPerPage, setRowsPerPage] = useState("5"); 

    // Carregamento Inicial
    useEffect(() => {
        fetchPedidos(1, Number(rowsPerPage));
        fetchActiveSkus(); // Carrega a lista completa de bloqueios em background
    }, [fetchPedidos, fetchActiveSkus, rowsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= meta.totalPages) {
            fetchPedidos(newPage, Number(rowsPerPage));
        }
    };

    // Atualização manual (botão refresh)
    const handleRefresh = () => {
        fetchPedidos(meta.currentPage, Number(rowsPerPage));
        fetchActiveSkus();
    };

    const handleQuickRequest = async (e) => {
        e.preventDefault();
        const skuClean = skuInput.trim().toUpperCase();

        if (!skuClean) {
            toast.warning("Digite o SKU.");
            return;
        }

        // Verifica na lista COMPLETA de bloqueios
        if (allActiveSkus.includes(skuClean)) {
            toast.info(`Já existe um pedido aberto para ${skuClean}.`);
            return;
        }

        const success = await criarSolicitacao(skuClean);
        if (success) setSkuInput('');
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <Toaster position="top-right" richColors />
            <SidebarEmployee />

            <div className="flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden shrink-0"><Menu className="h-5 w-5" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64"><SidebarEmployee /></SheetContent>
                    </Sheet>
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <LayoutDashboard className="h-5 w-5 text-primary" /> Visão Geral
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                    
                    {/* Solicitação Rápida */}
                    <Card className="border-l-4 border-l-primary shadow-sm bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Plus className="h-5 w-5 text-primary" /> Solicitação Direta
                            </CardTitle>
                            <CardDescription className="text-muted-foreground/80">
                                Digite o SKU para pedir reposição.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleQuickRequest} className="flex gap-3 items-center max-w-2xl">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Ex: PAP-A4" 
                                        className="pl-9 bg-background h-11 text-base uppercase"
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 px-6 shadow-sm min-w-[120px]">
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Enviar"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="pedidos" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
                            <TabsList className="bg-muted/50 p-1">
                                <TabsTrigger value="pedidos" className="px-4 py-2"><FileText className="mr-2 h-4 w-4" /> Pedidos Recentes</TabsTrigger>
                                <TabsTrigger value="insumos" className="px-4 py-2"><Package className="mr-2 h-4 w-4" /> Catálogo Completo</TabsTrigger>
                            </TabsList>
                            
                            {activeTab === 'pedidos' && (
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Mostrar</span>
                                        <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                                            <SelectTrigger className="h-9 w-[70px] bg-background"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className="hidden sm:inline">por página</span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 gap-2">
                                        <RefreshCw className={clsx("h-3.5 w-3.5", loading && "animate-spin")} />
                                        Atualizar
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* TAB PEDIDOS */}
                        <TabsContent value="pedidos" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow className="hover:bg-transparent border-b border-border">
                                            <TableHead className="w-[120px] pl-6 font-medium text-muted-foreground">ID</TableHead>
                                            <TableHead className="w-[180px] font-medium text-muted-foreground">Data</TableHead>
                                            <TableHead className="font-medium text-muted-foreground">SKU do Insumo</TableHead>
                                            <TableHead className="text-right pr-6 font-medium text-muted-foreground">Status Atual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({length: Number(rowsPerPage)}).map((_, i) => (
                                                <TableRow key={i}><TableCell colSpan={4} className="pl-6 py-4"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                                            ))
                                        ) : pedidos.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="h-48 text-center text-muted-foreground"><div className="flex flex-col items-center justify-center gap-3"><FileText className="h-8 w-8 opacity-40" /><p className="text-sm font-medium">Nenhuma solicitação encontrada.</p></div></TableCell></TableRow>
                                        ) : (
                                            pedidos.map((pedido) => (
                                                <TableRow key={pedido.id || pedido._id} className="hover:bg-muted/40 transition-colors border-b border-border last:border-0">
                                                    <TableCell className="pl-6 py-4"><span className="font-mono text-xs text-muted-foreground">#{pedido.id ? pedido.id.slice(0,8) : '...'}</span></TableCell>
                                                    <TableCell className="text-muted-foreground font-medium text-sm py-4">{pedido.createdAt ? format(new Date(pedido.createdAt), "dd/MM/yyyy HH:mm", {locale: ptBR}) : '-'}</TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <Badge variant="outline" className="font-mono text-xs text-foreground border-border bg-muted/50 px-2 py-1">{pedido.displaySku}</Badge>
                                                            {pedido.displayInsumoName && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{pedido.displayInsumoName}</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4"><StatusBadge status={pedido.status} /></TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {meta.totalPages > 1 && (
                                <div className="flex justify-end pt-2">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(meta.currentPage - 1); }} className={clsx(meta.currentPage <= 1 && "pointer-events-none opacity-50")} /></PaginationItem>
                                            <PaginationItem><PaginationLink isActive className="bg-primary text-primary-foreground">{meta.currentPage}</PaginationLink></PaginationItem>
                                            <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(meta.currentPage + 1); }} className={clsx(meta.currentPage >= meta.totalPages && "pointer-events-none opacity-50")} /></PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </TabsContent>

                        {/* TAB CATÁLOGO */}
                        <TabsContent value="insumos" className="animate-in fade-in-50 slide-in-from-bottom-2">
                            <Card className="border shadow-sm overflow-hidden">
                                <CardHeader className="bg-muted/50 py-4 border-b">
                                    <CardTitle className="text-base font-medium">Catálogo Disponível</CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    {/* AQUI ESTÁ A CORREÇÃO: Passamos allActiveSkus (lista completa) */}
                                    <EmployeeInsumosGrid 
                                        activeRequests={allActiveSkus} 
                                        onRequestSuccess={handleRefresh} 
                                    /> 
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const s = (status || '').toLowerCase();
    let style = "bg-muted text-muted-foreground border-border";
    let Icon = Clock;
    let label = status || "Desconhecido";

    if (s.includes('aprovado')) { style = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"; Icon = CheckCircle2; label = "Aprovado"; }
    else if (s.includes('negado')) { style = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"; Icon = XCircle; label = "Negado"; }
    else if (s.includes('compra_efetuada')) { style = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"; Icon = CheckCircle2; label = "Comprado"; }
    else if (s.includes('compra_iniciada')) { style = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"; Icon = RefreshCw; label = "Em Compra"; }
    else { style = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"; Icon = Clock; label = "Solicitado"; }

    return <Badge variant="outline" className={clsx("gap-1 py-0.5 px-2 shadow-none border", style)}><Icon size={12}/> <span className="capitalize">{label}</span></Badge>;
};