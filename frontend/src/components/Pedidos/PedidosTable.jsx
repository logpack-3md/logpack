"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from 'lucide-react';
import PedidoRow from "./PedidoRow"; 
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PedidosTable({ loading, pedidos, pagination, onPageChange, onLimitChange, onRowClick, onOpenActionDialog, onOpenBuyDialog }) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[300px]">
            <div className="flex-1 overflow-auto scrollbar-thin">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[120px] pl-6 h-10">ID</TableHead>
                            <TableHead className="h-10">Insumo (SKU)</TableHead>
                            <TableHead className="h-10">Data</TableHead>
                            <TableHead className="text-center h-10">Status</TableHead>
                            <TableHead className="text-right pr-6 h-10">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: Math.min(pagination.limit, 10) }).map((_, i) => (<TableRow key={i}><TableCell colSpan={5} className="p-2 px-6"><Skeleton className="h-12 w-full rounded-lg" /></TableCell></TableRow>)) : 
                        pedidos.length === 0 ? (<TableRow><TableCell colSpan={5} className="h-[300px] text-center text-muted-foreground"><div className="flex flex-col items-center justify-center gap-2"><div className="p-4 bg-muted/30 rounded-full mb-1 border"><Inbox className="w-8 h-8 opacity-30"/></div><span>Nenhum pedido encontrado.</span></div></TableCell></TableRow>) : 
                        pedidos.map((pedido) => <PedidoRow key={pedido.id} pedido={pedido} onRowClick={() => onRowClick(pedido)} onOpenActionDialog={onOpenActionDialog} onOpenBuyDialog={onOpenBuyDialog} />)}
                    </TableBody>
                </Table>
            </div>
            {/* FOOTER DE PAGINAÇÃO IDENTICO AOS OUTROS */}
            <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-6 text-sm text-muted-foreground"><span>Total: <b>{pagination.meta.totalItems}</b></span><div className="flex items-center gap-2"><span className="hidden sm:inline">Exibir:</span><Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}><SelectTrigger className="h-8 w-[70px] bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div></div>
                <Pagination className="w-auto mx-0"><PaginationContent className="gap-1"><PaginationItem><Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="gap-1 h-8 px-3"><ChevronLeft className="h-4 w-4" /> Anterior</Button></PaginationItem><PaginationItem className="flex items-center justify-center min-w-[3rem] text-sm font-medium">{pagination.meta.currentPage} <span className="mx-1 text-muted-foreground">/</span> {pagination.meta.totalPages}</PaginationItem><PaginationItem><Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.meta.totalPages || loading} className="gap-1 h-8 px-3">Próximo <ChevronRight className="h-4 w-4" /></Button></PaginationItem></PaginationContent></Pagination>
            </div>
        </div>
    );
}