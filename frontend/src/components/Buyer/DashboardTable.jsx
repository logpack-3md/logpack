"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PackageX, ChevronLeft, ChevronRight, FileText, Package, Calendar } from 'lucide-react';
import { formatDateSafe, formatMoney, StatusBadge } from "./BuyerHelpers";

const DashboardRow = ({ item }) => {
    const hasOrcamento = !!item.orcamento;
    return (
        <TableRow className="hover:bg-muted/30 border-b border-border/60 transition-colors h-12">
            <TableCell className="pl-6 font-mono text-xs text-muted-foreground w-[80px]">
                #{item.id.slice(0,4)}
            </TableCell>
            <TableCell>
                 <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 h-5 border-border/60">
                     {item.sku || '---'}
                 </Badge>
            </TableCell>
            <TableCell>
                 <div className="flex items-center gap-2 max-w-[280px]">
                    {hasOrcamento ? <FileText size={14} className="text-indigo-500 shrink-0"/> : <Package size={14} className="text-muted-foreground shrink-0"/>}
                    <span className="text-sm text-foreground/90 truncate" title={item.orcamento?.description || item.description}>
                        {item.orcamento?.description || item.description}
                    </span>
                 </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs whitespace-nowrap w-[140px]">
                 <div className="flex items-center gap-1.5">
                    <Calendar size={12}/> {formatDateSafe(item.createdAt)}
                 </div>
            </TableCell>
            <TableCell className="text-right w-[120px]">
                {item.orcamento ? (
                    <span className="font-mono font-medium text-xs text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded">
                         {formatMoney(item.orcamento.valor_total)}
                    </span>
                ) : <span className="text-muted-foreground/50 text-xs font-mono">-</span>}
            </TableCell>
            <TableCell className="text-right pr-6 w-[140px]">
                <div className="flex justify-end">
                    <StatusBadge status={item.status} />
                </div>
            </TableCell>
        </TableRow>
    )
}

export default function DashboardTable({ loading, compras, pagination, onPageChange, onLimitChange }) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[300px]">
            <div className="flex-1 overflow-auto scrollbar-thin w-full">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[80px] pl-6 h-10">Ref</TableHead>
                            <TableHead className="h-10 w-[100px]">SKU</TableHead>
                            <TableHead className="h-10 min-w-[200px]">Item / Descrição</TableHead>
                            <TableHead className="h-10 w-[140px]">Data</TableHead>
                            <TableHead className="text-right h-10 w-[100px]">Valor</TableHead>
                            <TableHead className="text-right pr-6 h-10 w-[120px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: Math.min(pagination.limit, 5) }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={6} className="p-3 px-6"><Skeleton className="h-8 w-full rounded-md"/></TableCell></TableRow>
                            ))
                        ) : compras.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[300px] text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2 opacity-60">
                                        <PackageX className="w-10 h-10 opacity-20"/>
                                        <p className="text-sm">Sem atividades recentes.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            compras.map(item => (
                                <DashboardRow key={item.id} item={item} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="border-t border-border p-3 bg-background flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 z-20">
                 <div className="flex items-center gap-6 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                    <span>Total: <b>{pagination.meta.totalItems}</b></span>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Exibir:</span>
                        <Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}>
                            <SelectTrigger className="h-7 bg-background border-border text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>

                 <Pagination className="w-auto mx-0">
                    <PaginationContent className="gap-1">
                        <PaginationItem><Button variant="outline" size="sm" disabled={!pagination.hasPrevious || loading} onClick={()=>onPageChange(pagination.page - 1)} className="gap-1 h-7 px-3 text-xs"><ChevronLeft className="h-3 w-3" /> Anterior</Button></PaginationItem>
                        <PaginationItem className="flex items-center justify-center min-w-[3rem] text-xs font-medium text-muted-foreground">{pagination.meta.currentPage} / {pagination.meta.totalPages}</PaginationItem>
                        <PaginationItem><Button variant="outline" size="sm" disabled={!pagination.hasNext || loading} onClick={()=>onPageChange(pagination.page + 1)} className="gap-1 h-7 px-3 text-xs">Próximo <ChevronRight className="h-3 w-3" /></Button></PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}