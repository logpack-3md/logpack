"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import BuyerRow from "./BuyerRow";

export default function BuyerTable({ 
    loading, compras, pagination, 
    onAction, onPageChange, onLimitChange 
}) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[300px]">
            <div className="flex-1 overflow-auto scrollbar-thin w-full">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[100px] pl-6 h-12">ID</TableHead>
                            <TableHead className="w-[140px]">SKU / Ref</TableHead>
                            <TableHead className="min-w-[250px]">Descrição</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Proposta</TableHead>
                            <TableHead className="text-right pr-6">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={6} className="p-4 px-6"><Skeleton className="h-12 w-full rounded-lg"/></TableCell></TableRow>
                            ))
                        ) : compras.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[300px] text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PackageX className="w-10 h-10 opacity-20"/>
                                        <p>Nenhuma solicitação encontrada.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            compras.map(item => (
                                <BuyerRow key={item.id} item={item} onAction={onAction} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="border-t border-border p-3 bg-background flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 z-20">
                 <div className="flex items-center gap-6 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                    <span>Total: <b>{pagination.meta.totalItems}</b></span>
                    <div className="flex items-center gap-2"><span className="hidden sm:inline">Exibir:</span><Select value={String(pagination.limit || 10)} onValueChange={onLimitChange} disabled={loading}><SelectTrigger className="h-8 w-[70px] bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
                 </div>

                 <Pagination className="w-auto mx-0">
                    <PaginationContent className="gap-1">
                        <PaginationItem><Button variant="outline" size="sm" disabled={!pagination.hasPrevious || loading} onClick={()=>onPageChange(pagination.page - 1)} className="gap-1 h-8 px-3"><ChevronLeft className="h-4 w-4" /> Anterior</Button></PaginationItem>
                        <PaginationItem className="flex items-center justify-center min-w-[3rem] text-xs font-medium">{pagination.meta.currentPage} / {pagination.meta.totalPages}</PaginationItem>
                        <PaginationItem><Button variant="outline" size="sm" disabled={!pagination.hasNext || loading} onClick={()=>onPageChange(pagination.page + 1)} className="gap-1 h-8 px-3">Próximo <ChevronRight className="h-4 w-4" /></Button></PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}