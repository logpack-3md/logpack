"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, PackageX } from 'lucide-react';
import PedidoRow from "./PedidoRow"; // Linha Separada
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PedidosTable({ 
    loading, pedidos, pagination, statusFilter, formatStatusLabel,
    onPageChange, onLimitChange, 
    // Funções de linha
    onRowClick, onOpenActionDialog, onOpenBuyDialog
}) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            
            <div className="flex-1 overflow-auto scrollbar-thin">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[120px] pl-6 h-12">ID</TableHead>
                            <TableHead>Insumo (SKU)</TableHead>
                            <TableHead>Data da Solicitação</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right pr-6">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: Math.min(pagination.limit, 8) }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={5} className="p-4 px-6"><Skeleton className="h-10 w-full rounded-lg" /></TableCell></TableRow>
                            ))
                        ) : pedidos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-[400px]">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <div className="p-6 bg-muted/30 rounded-full mb-3 border border-border/50">
                                            {statusFilter === 'todos' ? <Inbox className="h-10 w-10 opacity-30"/> : <PackageX className="h-10 w-10 opacity-30" />}
                                        </div>
                                        <p className="font-medium text-foreground">Nada por aqui</p>
                                        <p className="text-sm opacity-70">
                                            {statusFilter === 'todos' ? "Nenhuma solicitação." : `Status sem resultados.`}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pedidos.map((pedido) => (
                                <PedidoRow 
                                    key={pedido.id} 
                                    pedido={pedido} 
                                    onRowClick={() => onRowClick(pedido)}
                                    onOpenActionDialog={onOpenActionDialog} 
                                    onOpenBuyDialog={onOpenBuyDialog}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-6 text-sm text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                    <span>Total: <span className="font-semibold text-foreground">{pagination.meta.totalItems}</span></span>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Exibir:</span>
                        <Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}>
                            <SelectTrigger className="h-8 w-[70px] bg-background"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
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
                            {pagination.meta.currentPage} / {pagination.meta.totalPages}
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