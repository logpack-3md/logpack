"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Search, Package, AlertTriangle, CheckCircle2, 
    Droplets, Box as BoxIcon, FileText, Shield, 
    Clock, Scale, Boxes, ArrowUpRight, Loader2, Info
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast, Toaster } from 'sonner';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// API REAL
import { api } from '@/lib/api';

// --- HOOK INTERNO DO GRID ---
const useEmployeeInsumos = (onRequestSuccess) => {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestingId, setRequestingId] = useState(null);

    // Estados de UI Locais
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 12;

    const fetchInsumos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('insumos?limit=2000');
            let rawData = [];
            if (res) {
                if (Array.isArray(res)) rawData = res;
                else if (Array.isArray(res.data)) rawData = res.data;
                else if (Array.isArray(res.insumos)) rawData = res.insumos;
            }

            const normalized = rawData.map(item => ({
                ...item,
                id: item.id || item._id,
                name: String(item.name || item.nome || '').trim(),
                sku: String(item.sku || item.SKU || '').trim().toUpperCase(),
                current_storage: Number(item.current_storage || 0),
                max_storage: Number(item.max_storage || 1),
                // Regra: Crítico se <= 35%
                isLowStock: (Number(item.current_storage || 0) / Number(item.max_storage || 1)) <= 0.35
            }));

            // Ordenação: Críticos primeiro
            normalized.sort((a, b) => {
                if (a.isLowStock && !b.isLowStock) return -1;
                if (!a.isLowStock && b.isLowStock) return 1;
                return a.name.localeCompare(b.name);
            });

            setAllItems(normalized);

        } catch (error) {
            console.error("Erro fetchInsumos:", error);
            toast.error("Erro ao carregar catálogo.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInsumos();
    }, [fetchInsumos]);

    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return allItems;
        return allItems.filter(i => 
            i.name.toLowerCase().includes(term) || 
            i.sku.toLowerCase().includes(term)
        );
    }, [allItems, search]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    
    const paginatedItems = useMemo(() => {
        const safePage = page > totalPages ? 1 : page;
        if (page > totalPages && page !== 1) setPage(1);
        const start = (safePage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, page, totalPages]);

    const handleRequest = async (item) => {
        if (requestingId) return;
        setRequestingId(item.id);
        
        const toastId = toast.loading("Enviando solicitação...");

        try {
            const res = await api.post('employee/request', { insumoSKU: item.sku });

            if (res && res.success === false) {
                toast.dismiss(toastId);
                const msg = res.error || res.message || "";
                const status = res.status;

                if (status === 409 || msg.toLowerCase().includes("já existe")) {
                    toast.info(`Já existe pedido para ${item.sku}.`);
                } else if (status === 400 || msg.toLowerCase().includes("estoque")) {
                    toast.warning("Estoque seguro. Não é possível solicitar.");
                } else {
                    toast.error("Erro ao solicitar.");
                }
                return false;
            }

            toast.dismiss(toastId);
            toast.success("Solicitação Enviada!");
            if (onRequestSuccess) onRequestSuccess();
            return true;

        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error("Falha na conexão.");
            return false;
        } finally {
            setRequestingId(null);
        }
    };

    return {
        insumos: paginatedItems,
        loading,
        pagination: { page, setPage, totalPages, totalItems: filteredItems.length },
        searchProps: { value: search, onChange: (e) => setSearch(e.target.value) },
        requestingId,
        handleRequest
    };
};

// Ícones e Cores
const getIcon = (index) => {
    const icons = [Droplets, BoxIcon, FileText, Package, Shield];
    const Icon = icons[index % icons.length];
    return <Icon className="h-5 w-5" />;
};

const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
];

export default function EmployeeInsumosGrid({ activeRequests = [], onRequestSuccess }) {
    
    const { 
        insumos, loading, pagination, searchProps, requestingId, 
        handleRequest 
    } = useEmployeeInsumos(onRequestSuccess);

    const [selectedItem, setSelectedItem] = useState(null);

    // Normaliza lista de bloqueio
    const blockedSkus = useMemo(() => {
        return activeRequests.map(s => String(s).trim().toUpperCase());
    }, [activeRequests]);

    return (
        <div className="space-y-6">
            {/* Se já houver Toaster no layout principal, pode remover este aqui */}
            <Toaster position="top-right" richColors />

            {/* Barra de Busca */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por Nome ou SKU..." 
                        className="pl-9 bg-background"
                        {...searchProps}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[160px] w-full rounded-xl" />)}
                </div>
            ) : insumos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl">
                    <Package className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
                    <p className="text-muted-foreground font-medium">Nenhum insumo encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {insumos.map((item, index) => {
                        const isLow = item.isLowStock;
                        // Verifica se já foi solicitado
                        const isPending = blockedSkus.includes(item.sku);
                        
                        return (
                            <Card 
                                key={item.id} 
                                className={clsx(
                                    "flex flex-col transition-all duration-200 border-border bg-card cursor-pointer hover:shadow-md hover:border-primary/50 group relative overflow-hidden",
                                    // Se já solicitado: Borda Azul + Opacidade leve
                                    isPending && "border-l-4 border-l-blue-400 bg-blue-50/10 opacity-90",
                                    // Se crítico e não solicitado: Borda Vermelha
                                    !isPending && isLow && "border-l-4 border-l-red-500 shadow-sm"
                                )}
                                onClick={() => setSelectedItem(item)}
                            >
                                <CardHeader className="p-4 flex flex-row items-start gap-3 space-y-0">
                                    <div className={clsx("p-2.5 rounded-lg shrink-0", colors[index % colors.length])}>{getIcon(index)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight pr-4">{item.name}</h3>
                                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                                        </div>
                                        <Badge variant="outline" className="mt-2 font-mono text-[10px] text-muted-foreground bg-muted/50 border-border px-1.5 py-0">{item.sku}</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 pt-0 mt-auto">
                                    <div className="flex items-center justify-between text-xs mt-2">
                                        <span className="text-muted-foreground">Estoque:</span>
                                        <span className={clsx("font-medium", isLow ? "text-red-600" : "text-emerald-600")}>
                                            {isLow ? "BAIXO" : "OK"}
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-muted mt-2 rounded-full overflow-hidden">
                                        <div 
                                            className={clsx("h-full", isLow ? "bg-red-500" : "bg-emerald-500")} 
                                            style={{ width: `${Math.min((item.current_storage/item.max_storage)*100, 100)}%` }}
                                        />
                                    </div>
                                    
                                    {/* BADGE DE FEEDBACK VISUAL NO CARD */}
                                    {isPending && (
                                        <div className="mt-3 pt-2 border-t border-dashed flex justify-center">
                                            <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-200 w-full justify-center">
                                                <Info className="w-3 h-3 mr-1" /> Já Solicitado
                                            </Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Paginação */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-end pt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem><PaginationPrevious onClick={() => pagination.setPage(p => Math.max(1, p - 1))} className="cursor-pointer" aria-disabled={pagination.page <= 1} /></PaginationItem>
                            <PaginationItem><PaginationLink isActive>{pagination.page}</PaginationLink></PaginationItem>
                            {pagination.totalPages > pagination.page && <PaginationItem><span className="text-sm text-muted-foreground px-2">de {pagination.totalPages}</span></PaginationItem>}
                            <PaginationItem><PaginationNext onClick={() => pagination.setPage(p => Math.min(pagination.totalPages, p + 1))} className="cursor-pointer" aria-disabled={pagination.page >= pagination.totalPages} /></PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Modal Detalhes */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    {selectedItem && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedItem.name}</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {/* Infos técnicas (igual) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Estoque</span>
                                        <div className="flex items-end gap-1 mt-1"><span className="text-3xl font-bold text-foreground">{selectedItem.current_storage}</span><span className="text-xs text-muted-foreground mb-1">/ {selectedItem.max_storage}</span></div>
                                        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden"><div className={clsx("h-full transition-all", selectedItem.isLowStock ? "bg-red-500" : "bg-emerald-500")} style={{ width: `${Math.min((selectedItem.current_storage/selectedItem.max_storage)*100, 100)}%` }} /></div>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">Dados</span>
                                        <div className="mt-2 space-y-1 text-sm"><p><span className="text-muted-foreground">SKU:</span> {selectedItem.sku}</p><p><span className="text-muted-foreground">Medida:</span> {selectedItem.measure || 'UN'}</p></div>
                                    </div>
                                </div>
                                <div className="space-y-1"><span className="text-sm font-semibold text-muted-foreground">Descrição</span><p className="text-sm bg-muted/20 p-3 rounded-lg text-foreground">{selectedItem.description || "Sem descrição."}</p></div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedItem(null)}>Fechar</Button>
                                
                                {/* LÓGICA DO BOTÃO: TRAVADO SE JÁ SOLICITADO */}
                                {(() => {
                                    const isPending = blockedSkus.includes(String(selectedItem.sku).trim().toUpperCase());

                                    return (
                                        <Button 
                                            className={clsx(
                                                isPending 
                                                    ? "bg-muted text-muted-foreground cursor-not-allowed" // Cinza travado
                                                    : selectedItem.isLowStock 
                                                        ? "bg-red-600 hover:bg-red-700" // Vermelho Ação
                                                        : "bg-slate-900" // Preto Seguro
                                            )}
                                            disabled={requestingId === selectedItem.id || !selectedItem.isLowStock || isPending}
                                            onClick={() => handleRequest(selectedItem)}
                                        >
                                            {requestingId === selectedItem.id ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                                            ) : isPending ? (
                                                <><Info className="mr-2 h-4 w-4" /> Já Solicitado</>
                                            ) : selectedItem.isLowStock ? (
                                                <><AlertTriangle className="mr-2 h-4 w-4" /> Solicitar Reposição</>
                                            ) : (
                                                <><CheckCircle2 className="mr-2 h-4 w-4" /> Estoque Seguro</>
                                            )}
                                        </Button>
                                    );
                                })()}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}