"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
    FileText, Calendar, ChevronLeft, ChevronRight, MoreHorizontal, 
    CheckCircle2, XCircle, RefreshCcw, Package, Hash 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBadge } from "./OrcamentoComponents";
import clsx from 'clsx';

export default function OrcamentosTable({ 
    loading, orcamentos, pagination, 
    onPageChange, onLimitChange, 
    onRowClick, onDecision 
}) {
    const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex-1 overflow-auto scrollbar-thin">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            {/* Cabeçalhos ajustados para clareza e espaço */}
                            <TableHead className="w-[140px] pl-6 h-11 text-xs uppercase font-semibold text-muted-foreground">Referência</TableHead>
                            <TableHead className="min-w-[300px] h-11 text-xs uppercase font-semibold text-muted-foreground">Insumo & Detalhes</TableHead>
                            <TableHead className="text-center w-[100px] h-11 text-xs uppercase font-semibold text-muted-foreground">Qtd.</TableHead>
                            <TableHead className="text-right w-[140px] h-11 text-xs uppercase font-semibold text-muted-foreground">Total Proposto</TableHead>
                            <TableHead className="text-center w-[130px] h-11 text-xs uppercase font-semibold text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right pr-6 h-11 text-xs uppercase font-semibold text-muted-foreground">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={6} className="p-3 px-6"><Skeleton className="h-10 w-full rounded-lg bg-muted/60"/></TableCell></TableRow>
                            ))
                        ) : orcamentos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[300px] text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <FileText className="w-10 h-10" strokeWidth={1}/>
                                        <p>Nenhum orçamento disponível para análise.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orcamentos.map((item) => {
                                const isActionable = item.status === 'pendente';
                                const displaySku = item.sku && item.sku !== '---' ? item.sku : "SKU N/A";

                                return (
                                    <TableRow 
                                        key={item.id} 
                                        className="cursor-pointer hover:bg-muted/30 transition-all border-b border-border/40 group"
                                        onClick={() => onRowClick(item)}
                                    >
                                        {/* COLUNA 1: REF (ID + DATA) */}
                                        <TableCell className="pl-6 py-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 font-mono text-xs text-foreground bg-muted/40 px-1.5 py-0.5 rounded w-fit border border-border/50">
                                                    <Hash size={10} className="opacity-50"/> {item.id.slice(0, 6)}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground pl-1">
                                                    <Calendar size={10}/> 
                                                    {format(new Date(item.createdAt), "dd MMM", {locale: ptBR})}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* COLUNA 2: SKU + DESCRIÇÃO */}
                                        <TableCell className="align-top py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800 font-mono text-[10px] px-2 py-0 rounded h-5 shadow-sm">
                                                        <Package className="w-3 h-3 mr-1"/>
                                                        {displaySku}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed line-clamp-2 max-w-[400px]" title={item.description}>
                                                    {item.description || <span className="italic text-muted-foreground">Sem observações.</span>}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* COLUNA 3: QTD */}
                                        <TableCell className="text-center align-top py-4">
                                            {item.originalAmount ? (
                                                <Badge variant="secondary" className="font-normal text-xs border border-border bg-muted/50">
                                                    {item.originalAmount} un
                                                </Badge>
                                            ) : "-"}
                                        </TableCell>

                                        {/* COLUNA 4: VALOR (Destaque) */}
                                        <TableCell className="text-right align-top py-4">
                                            <div className="inline-block text-right">
                                                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50/50 dark:bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-100/50">
                                                    {formatMoney(item.valor_total)}
                                                </div>
                                                {item.originalAmount && (
                                                    <div className="text-[10px] text-muted-foreground mt-1">
                                                        ~{formatMoney(item.valor_total/item.originalAmount)}/un
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* COLUNA 5: STATUS */}
                                        <TableCell className="text-center align-top py-4">
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        
                                        {/* COLUNA 6: AÇÕES */}
                                        <TableCell className="text-right pr-6 align-top py-4">
                                            <div className="flex justify-end gap-1 opacity-90" onClick={(e)=>e.stopPropagation()}>
                                                {isActionable ? (
                                                    <div className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-sm">
                                                        {/* Renegociar */}
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50" 
                                                                onClick={(e) => { e.stopPropagation(); onDecision('renegociacao', item) }}>
                                                                <RefreshCcw size={15} />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>Solicitar Renegociação</TooltipContent></Tooltip></TooltipProvider>

                                                        <div className="w-px h-4 bg-border"></div>

                                                        {/* Negar */}
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" 
                                                                onClick={(e) => { e.stopPropagation(); onDecision('negado', item) }}>
                                                                <XCircle size={16} />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>Negar Proposta</TooltipContent></Tooltip></TooltipProvider>

                                                        {/* Aprovar */}
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50" 
                                                                onClick={(e) => { e.stopPropagation(); onDecision('aprovado', item) }}>
                                                                <CheckCircle2 size={16} />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>Aprovar & Comprar</TooltipContent></Tooltip></TooltipProvider>
                                                    </div>
                                                ) : (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" onClick={() => onRowClick(item)}>
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* PAGINATION */}
            <div className="border-t border-border bg-background p-3 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Total: <b>{pagination.meta.totalItems}</b></span>
                    <div className="flex items-center gap-2"><span className="hidden sm:inline">Por página:</span><Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}><SelectTrigger className="h-7 w-[65px] bg-background border-border text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
                </div>
                <Pagination className="w-auto mx-0"><PaginationContent className="gap-1"><PaginationItem><Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="gap-1 h-7 px-2 text-xs"><ChevronLeft className="h-3 w-3" /> Anterior</Button></PaginationItem><PaginationItem className="flex items-center justify-center min-w-[2rem] text-xs font-medium">{pagination.meta.currentPage} / {pagination.meta.totalPages}</PaginationItem><PaginationItem><Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.meta.totalPages || loading} className="gap-1 h-7 px-2 text-xs">Próximo <ChevronRight className="h-3 w-3" /></Button></PaginationItem></PaginationContent></Pagination>
            </div>
        </div>
    );
}