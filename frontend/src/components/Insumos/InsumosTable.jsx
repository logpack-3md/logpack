"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import InsumoRow from "./InsumoRow";

export default function InsumosTable({ 
    insumos, 
    loading, 
    pagination, 
    onRowClick, 
    onToggleStatus,
    onPageChange,
    onLimitChange
}) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[80px] pl-6 h-10">Img</TableHead>
                            <TableHead className="h-10">Insumo / SKU</TableHead>
                            <TableHead className="h-10">Setor</TableHead>
                            <TableHead className="h-10">Estoque</TableHead>
                            <TableHead className="text-center h-10">Status</TableHead>
                            <TableHead className="text-right pr-6 h-10">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({length: Math.min(pagination.limit, 10)}).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={6} className="p-2 px-6"><Skeleton className="h-12 w-full rounded-lg" /></TableCell></TableRow>
                            ))
                        ) : insumos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[300px]">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <div className="p-6 bg-muted/30 rounded-full mb-3 border">
                                            <PackageX className="h-10 w-10 opacity-40"/>
                                        </div>
                                        <p className="font-medium">Nenhum insumo encontrado.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            insumos.map((item) => (
                                <InsumoRow 
                                    key={item.id} 
                                    item={item} 
                                    onRowClick={() => onRowClick(item)} 
                                    onToggleStatus={onToggleStatus}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Total: <b>{pagination.meta.totalItems}</b></span>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Exibir:</span>
                        <Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}>
                            <SelectTrigger className="h-8 w-[70px] bg-background"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Pagination className="w-auto mx-0">
                    <PaginationContent className="gap-1">
                        <PaginationItem>
                            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="gap-1 h-8 px-3">
                                <ChevronLeft className="h-4 w-4" /> Anterior
                            </Button>
                        </PaginationItem>
                        <PaginationItem className="flex items-center justify-center min-w-[3rem] text-sm font-medium">
                            {pagination.meta.currentPage} <span className="mx-1">/</span> {pagination.meta.totalPages}
                        </PaginationItem>
                        <PaginationItem>
                            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.meta.totalPages || loading} className="gap-1 h-8 px-3">
                                Próximo <ChevronRight className="h-4 w-4" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}