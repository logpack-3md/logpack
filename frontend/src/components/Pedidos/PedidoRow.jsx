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
            className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60 group h-12" 
            onClick={onRowClick}
        >
            <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                #{pedido.id.slice(0, 8)}
            </TableCell>
            
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-background border shadow-sm shrink-0 text-muted-foreground">
                        <Package size={16} />
                    </div>
                    <span className="font-medium text-sm text-foreground">{pedido.sku}</span>
                </div>
            </TableCell>
            
            <TableCell>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar size={13} />
                    {formatDate(pedido.createdAt)}
                </div>
            </TableCell>
            
            <TableCell className="text-center">
                <StatusBadge status={pedido.status}/>
            </TableCell>
            
            <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-2 items-center" onClick={e=>e.stopPropagation()}>
                    
                    {isApproved && (
                        <Button 
                            size="sm" 
                            onClick={(e)=>onOpenBuyDialog(e, pedido)}
                            className="h-7 px-3 gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200/50 border border-indigo-700 transition-all text-[10px] uppercase font-bold tracking-wide"
                        >
                            <ShoppingBag size={12} strokeWidth={2.5} /> Comprar
                        </Button>
                    )}

                    {isPending && (
                        <>
                             <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8 bg-emerald-900 text-emerald-500 border border-emerald-400 hover:bg-emerald-100" onClick={(e)=>onOpenActionDialog(e,'approve',pedido)}><CheckCircle2 size={16}/></Button>
                            </TooltipTrigger><TooltipContent>Aprovar</TooltipContent></Tooltip></TooltipProvider>

                            <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8 bg-red-900 text-red-400 border border-red-300 hover:bg-red-100" onClick={(e)=>onOpenActionDialog(e,'deny',pedido)}><XCircle size={16}/></Button>
                            </TooltipTrigger><TooltipContent>Negar</TooltipContent></Tooltip></TooltipProvider>
                        </>
                    )}

                    {!isPending && !isApproved && (
                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                             <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onRowClick}><ArrowRight size={16}/></Button>
                        </TooltipTrigger><TooltipContent>Ver Detalhes</TooltipContent></Tooltip></TooltipProvider>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}