"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActionBadge, formatDateLog } from "./LogHelpers";
import clsx from "clsx";

export default function UsersLogTable({ 
    logs, loading, pagination, 
    onPageChange, onLimitChange 
}) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin relative w-full">
                <Table>
                    <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[180px] pl-6 h-11">Data / Hora</TableHead>
                            <TableHead className="h-11 w-[120px] text-center">Tipo</TableHead>
                            <TableHead className="h-11">Detalhes da Atividade</TableHead>
                            <TableHead className="h-11 w-[150px] text-right pr-6">ID Responsável</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4} className="p-3 px-6">
                                        <Skeleton className="h-10 w-full rounded-lg bg-muted/60"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-[300px] text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                                        <div className="p-4 rounded-full bg-muted">
                                            <FileSearch className="w-8 h-8"/>
                                        </div>
                                        <p className="font-medium">Nenhum registro encontrado.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors border-b border-border/40">
                                    <TableCell className="pl-6 py-4 font-mono text-xs text-muted-foreground">
                                        {formatDateLog(log.timestamps || log.createdAt)}
                                    </TableCell>
                                    
                                    <TableCell className="text-center py-4">
                                        <div className="flex justify-center">
                                            <ActionBadge action={log.actionType} />
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="py-4">
                                        <p className="text-sm text-foreground/90 leading-snug">
                                            {log.contextDetails || "Sem detalhes adicionais"}
                                        </p>
                                        {log.id && (
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 block">
                                                Log ID: {log.id.slice(0,8)}
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right pr-6 py-4 font-mono text-xs text-primary">
                                        {log.userId ? (
                                            <span title={log.userId}>...{log.userId.slice(-6)}</span>
                                        ) : (
                                            <span className="text-muted-foreground italic">Sistema</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* RODAPÉ PAGINAÇÃO */}
            {pagination && pagination.meta.totalPages >= 1 && (
                <div className="border-t border-border bg-background p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
                        <span>Total: <b>{pagination.meta.totalItems}</b></span>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline">Exibir:</span>
                            <Select 
                                value={String(pagination.limit)} 
                                onValueChange={onLimitChange} 
                                disabled={loading}
                            >
                                <SelectTrigger className="h-7 w-[70px] bg-background border-border text-xs"><SelectValue /></SelectTrigger>
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
                                <Button variant="outline" size="sm" disabled={pagination.page <= 1 || loading} onClick={() => onPageChange(pagination.page - 1)} className="gap-1 h-7 px-3 text-xs">
                                    <ChevronLeft className="h-3 w-3" /> Anterior
                                </Button>
                            </PaginationItem>
                            <PaginationItem className="flex items-center justify-center min-w-[3rem] text-xs font-medium">
                                {pagination.page} / {pagination.meta.totalPages}
                            </PaginationItem>
                            <PaginationItem>
                                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.meta.totalPages || loading} onClick={() => onPageChange(pagination.page + 1)} className="gap-1 h-7 px-3 text-xs">
                                    Próximo <ChevronRight className="h-3 w-3" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}