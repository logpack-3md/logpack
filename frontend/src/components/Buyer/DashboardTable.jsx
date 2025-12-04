"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PackageX, ChevronLeft, ChevronRight, FileText, Package, Calendar, Hash } from 'lucide-react';
import { formatDateSafe, formatMoney, StatusBadge } from "./BuyerHelpers";

const DashboardRow = ({ item }) => {
    const hasOrcamento = !!item.orcamento;
    
    return (
        <TableRow className="hover:bg-muted/30 border-b border-border/60 transition-colors h-auto py-2 sm:h-12">
            {/* Coluna REF (ID): Escondida no Mobile */}
            <TableCell className="hidden md:table-cell pl-6 font-mono text-xs text-muted-foreground w-[80px]">
                #{item.id.slice(0,4)}
            </TableCell>

            {/* Coluna SKU: Escondida no Mobile/Tablet pequeno */}
            <TableCell className="hidden lg:table-cell w-[100px]">
                 <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 h-5 border-border/60">
                     {item.sku || '---'}
                 </Badge>
            </TableCell>

            {/* Coluna DESCRIÇÃO: Expandida e com informações extras no Mobile */}
            <TableCell className="w-full sm:max-w-[280px]">
                 <div className="flex flex-col gap-1 py-1">
                     <div className="flex items-start gap-2">
                        {hasOrcamento ? (
                            <FileText size={16} className="text-indigo-500 shrink-0 mt-0.5"/> 
                        ) : (
                            <Package size={16} className="text-muted-foreground shrink-0 mt-0.5"/>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-foreground/90 leading-tight line-clamp-2" title={item.orcamento?.description || item.description}>
                                {item.orcamento?.description || item.description}
                            </span>
                            
                            {/* --- MOBILE INFO STACK --- */}
                            {/* Aparece apenas em telas pequenas (md:hidden) para compensar colunas escondidas */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 md:hidden">
                                <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                    #{item.id.slice(0,4)}
                                </span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Calendar size={10}/> {formatDateSafe(item.createdAt)}
                                </span>
                                {item.sku && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Hash size={10}/> {item.sku}
                                    </span>
                                )}
                            </div>
                        </div>
                     </div>
                 </div>
            </TableCell>

            {/* Coluna DATA: Escondida no Mobile */}
            <TableCell className="hidden md:table-cell text-muted-foreground text-xs whitespace-nowrap w-[140px]">
                 <div className="flex items-center gap-1.5">
                    <Calendar size={12}/> {formatDateSafe(item.createdAt)}
                 </div>
            </TableCell>

            {/* Coluna VALOR: Escondida no Mobile (vai para baixo do status) */}
            <TableCell className="hidden sm:table-cell text-right w-[100px]">
                {item.orcamento ? (
                    <span className="font-mono font-medium text-xs text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                         {formatMoney(item.orcamento.valor_total)}
                    </span>
                ) : <span className="text-muted-foreground/50 text-xs font-mono">-</span>}
            </TableCell>

            {/* Coluna STATUS: Sempre visível + Valor no Mobile */}
            <TableCell className="text-right pr-4 sm:pr-6 w-[100px] sm:w-[120px] align-top sm:align-middle py-3 sm:py-0">
                <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={item.status} className="scale-90 origin-right sm:scale-100" />
                    
                    {/* Exibe o VALOR aqui apenas no celular */}
                    <div className="sm:hidden mt-0.5">
                        {item.orcamento ? (
                             <span className="font-mono font-bold text-[11px] text-emerald-600">
                                {formatMoney(item.orcamento.valor_total)}
                             </span>
                        ) : null}
                    </div>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default function DashboardTable({ loading, compras, pagination, onPageChange, onLimitChange }) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[300px]">
            <div className="flex-1 w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            {/* Classes hidden controlam a visibilidade dos headers */}
                            <TableHead className="hidden md:table-cell w-[80px] pl-6 h-10">Ref</TableHead>
                            <TableHead className="hidden lg:table-cell h-10 w-[100px]">SKU</TableHead>
                            <TableHead className="h-10 min-w-[150px] sm:min-w-[200px]">Item / Descrição</TableHead>
                            <TableHead className="hidden md:table-cell h-10 w-[140px]">Data</TableHead>
                            <TableHead className="hidden sm:table-cell text-right h-10 w-[100px]">Valor</TableHead>
                            <TableHead className="text-right pr-4 sm:pr-6 h-10 w-[100px] sm:w-[120px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: Math.min(pagination.limit, 5) }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6} className="p-3 px-4 sm:px-6">
                                        <div className="flex items-center gap-3">
                                            {/* Skeleton simplificado para mobile */}
                                            <Skeleton className="h-8 w-8 rounded-full shrink-0 md:hidden"/>
                                            <div className="w-full space-y-2">
                                                <Skeleton className="h-4 w-[60%] rounded-md"/>
                                                <Skeleton className="h-3 w-[40%] rounded-md md:hidden"/>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (!compras || compras.length === 0) ? (
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
            
            {/* Paginação Responsiva */}
            <div className="border-t border-border p-3 bg-background flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-20">
                 
                 <div className="flex items-center justify-between w-full sm:w-auto gap-4 text-xs text-muted-foreground">
                    <span>Total: <b className="text-foreground">{pagination.meta.totalItems}</b></span>
                    <div className="flex items-center gap-2">
                        <span>Exibir:</span>
                        <Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}>
                            <SelectTrigger className="h-7 w-[70px] bg-background border-border text-xs focus:ring-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>

                 <Pagination className="w-full sm:w-auto mx-0 justify-center">
                    <PaginationContent className="gap-2 w-full justify-between sm:justify-end">
                        <PaginationItem>
                            <Button variant="outline" size="sm" disabled={!pagination.hasPrevious || loading} onClick={()=>onPageChange(pagination.page - 1)} className="h-8 px-3 text-xs w-24 sm:w-auto">
                                <ChevronLeft className="h-3 w-3 mr-1" /> 
                                <span className="sm:inline">Anterior</span>
                                {/* Texto "Anterior" pode sumir em telas muito pequenas se quiser, mas o w-24 segura */}
                            </Button>
                        </PaginationItem>
                        
                        <PaginationItem className="flex items-center justify-center min-w-[3rem] text-xs font-medium text-muted-foreground">
                            {pagination.meta.currentPage} <span className="mx-1">/</span> {pagination.meta.totalPages}
                        </PaginationItem>
                        
                        <PaginationItem>
                            <Button variant="outline" size="sm" disabled={!pagination.hasNext || loading} onClick={()=>onPageChange(pagination.page + 1)} className="h-8 px-3 text-xs w-24 sm:w-auto">
                                <span className="sm:inline">Próximo</span> 
                                <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}