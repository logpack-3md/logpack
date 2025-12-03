"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
    FileText, Calendar, ChevronLeft, ChevronRight, MoreHorizontal, 
    CheckCircle2, XCircle, RefreshCcw 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBadge } from "./OrcamentoComponents";

export default function OrcamentosTable({ 
    loading, orcamentos, pagination, 
    onPageChange, onLimitChange, 
    onRowClick, onDecision 
}) {
    const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[300px]">
            <div className="flex-1 overflow-auto scrollbar-thin">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[100px] pl-6 h-12">Ref</TableHead>
                            <TableHead className="min-w-[200px]">Descrição / Insumo</TableHead>
                            <TableHead className="text-center">Qtd.</TableHead>
                            <TableHead className="text-right">Valor Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right pr-6">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={6} className="p-4 px-6"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                            ))
                        ) : orcamentos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[300px] text-center text-muted-foreground">
                                    Nenhum orçamento encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orcamentos.map((item) => {
                                // Verifica se o item é "agível" (pendente ou renegociacao solicitada pelo comprador se houvesse esse status, aqui usamos pendente)
                                const isActionable = item.status === 'pendente';

                                return (
                                    <TableRow 
                                        key={item.id} 
                                        className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60 group"
                                        onClick={() => onRowClick(item)}
                                    >
                                        <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                                            #{item.id.slice(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm line-clamp-1 text-foreground" title={item.description}>{item.description || "Sem descrição"}</span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Calendar size={10}/> {format(new Date(item.createdAt), "dd/MM/yyyy", {locale: ptBR})}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-mono text-sm">
                                            {item.originalAmount || "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(item.valor_total)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100" onClick={(e)=>e.stopPropagation()}>
                                                {isActionable ? (
                                                    <>
                                                        {/* RENEGOCIAR */}
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700" 
                                                                onClick={(e) => { e.stopPropagation(); onDecision('renegociacao', item) }}>
                                                                <RefreshCcw size={16} />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>Renegociar</TooltipContent></Tooltip></TooltipProvider>

                                                        {/* NEGAR */}
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700" 
                                                                onClick={(e) => { e.stopPropagation(); onDecision('negado', item) }}>
                                                                <XCircle size={18} />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>Negar</TooltipContent></Tooltip></TooltipProvider>

                                                        {/* APROVAR */}
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" 
                                                                onClick={(e) => { e.stopPropagation(); onDecision('aprovado', item) }}>
                                                                <CheckCircle2 size={18} />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>Aprovar</TooltipContent></Tooltip></TooltipProvider>
                                                    </>
                                                ) : (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => onRowClick(item)}>
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
            <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Total: <b>{pagination.meta.totalItems}</b></span>
                    <div className="flex items-center gap-2"><span className="hidden sm:inline">Exibir:</span><Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}><SelectTrigger className="h-8 w-[70px] bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
                </div>
                <Pagination className="w-auto mx-0"><PaginationContent className="gap-1"><PaginationItem><Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="gap-1 h-8 px-3"><ChevronLeft className="h-4 w-4" /> Anterior</Button></PaginationItem><PaginationItem className="flex items-center justify-center min-w-[3rem] text-sm font-medium">{pagination.meta.currentPage} / {pagination.meta.totalPages}</PaginationItem><PaginationItem><Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.meta.totalPages || loading} className="gap-1 h-8 px-3">Próximo <ChevronRight className="h-4 w-4" /></Button></PaginationItem></PaginationContent></Pagination>
            </div>
        </div>
    );
}