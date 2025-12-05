"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ChevronLeft, ChevronRight, Calendar, Hash, User } from 'lucide-react';
import { ActionBadge, formatDateLog } from "./LogHelpers"; // Reutiliza helpers existentes

export default function ManagerLogTable({ 
    logs, loading, pagination, 
    onPageChange, onLimitChange 
}) {
    return (
        <div className="flex flex-1 flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden h-full">
            
            <div className="flex-1 w-full overflow-auto">
                <Table className="w-full min-w-[1000px]">
                    <TableHeader className="bg-muted/40 sticky top-0 z-10 backdrop-blur-sm">
                        <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="w-[180px] pl-6 h-11 text-xs uppercase font-bold text-muted-foreground whitespace-nowrap">Data / Hora</TableHead>
                            <TableHead className="w-[120px] text-center h-11 text-xs uppercase font-bold text-muted-foreground whitespace-nowrap">Ação</TableHead>
                            <TableHead className="h-11 text-xs uppercase font-bold text-muted-foreground min-w-[300px]">Detalhes</TableHead>
                            <TableHead className="w-[160px] text-right pr-6 h-11 text-xs uppercase font-bold text-muted-foreground whitespace-nowrap">ID Responsável</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={`skel-${i}`}>
                                    <TableCell colSpan={4} className="p-3 px-6">
                                        <Skeleton className="h-10 w-full rounded-lg bg-muted/60"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-[300px] text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                                        <div className="p-4 rounded-full bg-muted/50 border border-border/50">
                                            <FileSearch className="w-8 h-8 text-muted-foreground"/>
                                        </div>
                                        <p className="font-medium text-sm">Nenhum registro encontrado nesta aba.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => {
                                // Identifica qual ID mostrar dependendo do tipo de log retornado
                                const responsiveId = log.gerenteId || log.userId || log.buyerId || 'Sistema';

                                return (
                                    <TableRow key={log.id} className="hover:bg-muted/30 transition-colors border-b border-border/40 group">
                                        <TableCell className="pl-6 py-3 align-top whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-mono text-xs text-foreground font-medium">
                                                <Calendar size={13} className="shrink-0 text-muted-foreground/70" />
                                                {formatDateLog(log.timestamps || log.createdAt)}
                                            </div>
                                            {log.id && (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 pl-5 font-mono opacity-50">
                                                    #{log.id.slice(0,8)}
                                                </div>
                                            )}
                                        </TableCell>
                                        
                                        <TableCell className="text-center py-3 align-top">
                                            <div className="flex justify-center">
                                                <ActionBadge action={log.actionType} />
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell className="py-3 align-top">
                                            <p className="text-sm text-foreground/90 leading-relaxed break-words max-w-[450px]">
                                                {log.contextDetails || "Registro de operação."}
                                            </p>
                                        </TableCell>

                                        <TableCell className="text-right pr-6 py-3 align-top whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <User size={12} className="text-muted-foreground" />
                                                <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1.5 py-0.5 rounded">
                                                    {responsiveId !== 'Sistema' ? `...${responsiveId.slice(-6)}` : responsiveId}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="border-t border-border bg-background p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0 z-20">
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Total: <b>{pagination?.meta?.totalItems || 0}</b>
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground hidden sm:inline">Exibir:</span>
                        <Select value={String(pagination.limit)} onValueChange={onLimitChange} disabled={loading}>
                            <SelectTrigger className="h-7 w-[60px] bg-background border-border text-xs shadow-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Pagination className="w-full sm:w-auto mx-0 justify-center sm:justify-end">
                    <PaginationContent className="gap-1">
                        <PaginationItem><Button variant="outline" size="sm" disabled={pagination.page <= 1 || loading} onClick={() => onPageChange(pagination.page - 1)} className="gap-1 h-8 px-3 text-xs shadow-sm"><ChevronLeft className="h-3 w-3" /> Ant.</Button></PaginationItem>
                        <PaginationItem className="flex items-center justify-center min-w-[2rem] text-xs font-medium text-muted-foreground">{pagination.page} / {pagination.meta.totalPages}</PaginationItem>
                        <PaginationItem><Button variant="outline" size="sm" disabled={pagination.page >= pagination.meta.totalPages || loading} onClick={() => onPageChange(pagination.page + 1)} className="gap-1 h-8 px-3 text-xs shadow-sm">Prox. <ChevronRight className="h-3 w-3" /></Button></PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}