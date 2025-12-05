"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Layers, Power, Edit2, AlertOctagon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/Insumos/InsumoHelpers"; 

export default function SetoresTable({ 
    setores, 
    loading, 
    pagination,
    onEdit, 
    onToggleStatus,
    onPageChange,
    onLimitChange
}) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[300px]">
            {/* Wrapper da tabela com scroll interno */}
            <div className="flex-1 overflow-auto scrollbar-thin">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[60px] pl-6 h-10">Ícone</TableHead>
                            <TableHead className="h-10">Nome do Setor</TableHead>
                            <TableHead className="h-10">ID do Sistema</TableHead>
                            <TableHead className="text-center h-10">Status</TableHead>
                            <TableHead className="text-right pr-6 h-10">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: Math.min(pagination.limit, 10) }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5} className="p-2 px-6">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : setores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-[300px] text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="p-4 bg-muted/30 rounded-full mb-1 border">
                                            <AlertOctagon className="w-8 h-8 opacity-30"/>
                                        </div>
                                        <span>Nenhum setor encontrado.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            setores.map((setor) => (
                                <TableRow key={setor.id} className="hover:bg-muted/40 border-b border-border/60 transition-colors group">
                                    <TableCell className="pl-6 py-2 w-[60px]">
                                        <div className="w-8 h-8 bg-indigo-500/10 text-indigo-600 rounded-md flex items-center justify-center border border-indigo-500/20">
                                            <Layers size={16} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 font-medium text-sm text-foreground/90">{setor.name}</TableCell>
                                    <TableCell className="py-2 font-mono text-xs text-muted-foreground">#{setor.id.slice(0,8)}</TableCell>
                                    <TableCell className="text-center py-2">
                                        <StatusBadge status={setor.status} />
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-2">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => onEdit(setor)}>
                                                    <Edit2 size={14} />
                                                </Button>
                                            </TooltipTrigger><TooltipContent>Renomear</TooltipContent></Tooltip></TooltipProvider>
                                            
                                            <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                <Button size="icon" variant="ghost" className={setor.status==='ativo'?"h-7 w-7 text-green-600 hover:bg-green-50":"h-7 w-7 text-red-600 hover:bg-red-50"} onClick={(e) => onToggleStatus(e, setor)}>
                                                    <Power size={14} />
                                                </Button>
                                            </TooltipTrigger><TooltipContent>{setor.status === 'ativo' ? 'Desativar' : 'Ativar'}</TooltipContent></Tooltip></TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* Footer Fixo */}
            <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Total: <b>{pagination?.meta?.totalItems || 0}</b></span>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline">Exibir:</span>
                        <Select value={String(pagination?.limit || 10)} onValueChange={onLimitChange} disabled={loading}>
                            <SelectTrigger className="h-8 w-[70px] bg-background border-border"><SelectValue /></SelectTrigger>
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
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => onPageChange((pagination?.page || 1) - 1)} 
                                disabled={(pagination?.page || 1) <= 1 || loading} 
                                className="gap-1 h-8 px-3"
                            >
                                <ChevronLeft className="h-4 w-4" /> Anterior
                            </Button>
                        </PaginationItem>
                        <PaginationItem className="flex items-center justify-center min-w-[3rem] text-sm font-medium">
                            {pagination?.meta?.currentPage || 1} <span className="mx-1 text-muted-foreground">/</span> {pagination?.meta?.totalPages || 1}
                        </PaginationItem>
                        <PaginationItem>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => onPageChange((pagination?.page || 1) + 1)} 
                                disabled={(pagination?.page || 1) >= (pagination?.meta?.totalPages || 1) || loading} 
                                className="gap-1 h-8 px-3"
                            >
                                Próximo <ChevronRight className="h-4 w-4" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}