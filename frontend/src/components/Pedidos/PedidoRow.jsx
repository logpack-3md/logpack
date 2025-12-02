"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, MoreHorizontal, CheckCircle2, XCircle, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { formatDate, StatusBadge } from "./PedidoHelpers";

export default function PedidoRow({ pedido, onRowClick, onOpenActionDialog, onOpenBuyDialog }) {
    const s = pedido.status?.toLowerCase();
    const isPending = ['solicitado', 'pendente'].includes(s);
    const isApproved = s === 'aprovado';

    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60 group"
            onClick={onRowClick}
        >
            <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                #{pedido.id.slice(0, 8)}
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background border shadow-sm shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-sm text-foreground">{pedido.sku}</span>
                </div>
            </TableCell>

            <TableCell className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-muted-foreground/60" />
                    {formatDate(pedido.createdAt)}
                </div>
            </TableCell>

            <TableCell className="text-center">
                <StatusBadge status={pedido.status} />
            </TableCell>

            <TableCell className="text-right pr-6">
                {/* Container sempre visível, sem opacity */}
                <div className="flex justify-end gap-2 items-center" onClick={e => e.stopPropagation()}>

                    {isApproved && (
                        <Button
                            size="sm"
                            onClick={(e) => onOpenBuyDialog(e, pedido)}
                            className="h-8 px-3 gap-2 bg-indigo-950 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200/50 dark:shadow-none border border-indigo-700 transition-all"
                        >
                            <ShoppingBag size={14} strokeWidth={2.5} />
                            <span className="font-semibold text-xs">Comprar</span>
                        </Button>
                    )}

                    {isPending && (
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-700 shadow-sm dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
                                            onClick={(e) => onOpenActionDialog(e, 'approve', pedido)}
                                        >
                                            <CheckCircle2 size={16} strokeWidth={2.5} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-emerald-600 text-white border-emerald-700">Aprovar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700 shadow-sm dark:bg-red-950/30 dark:border-red-800 dark:text-red-400"
                                            onClick={(e) => onOpenActionDialog(e, 'deny', pedido)}
                                        >
                                            <XCircle size={16} strokeWidth={2.5} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-red-600 text-white border-red-700">Negar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}

                    {!isPending && !isApproved && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        onClick={onRowClick}
                                    >
                                        <ArrowRight size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ver Detalhes</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}