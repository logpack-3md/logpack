"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { FileText, Package, DollarSign, RefreshCcw, Ban, Clock, Tag, AlertCircle } from 'lucide-react';
import { formatDateSafe, formatMoney, StatusBadge } from "./BuyerHelpers";

export default function BuyerRow({ item, onAction }) {
    const currentStatus = item.status;
    const hasOrcamento = !!item.orcamento;
    
    // Status
    const isPending = currentStatus === 'pendente';
    const isRenegotiation = String(currentStatus).includes('renegociacao');
    
    // Display Data
    const skuDisplay = (item.sku && item.sku !== '---') ? item.sku : "S/ Ref";
    const rawDescription = item.orcamento?.description || item.description;
    const descriptionDisplay = rawDescription ? (
        <span className="truncate font-medium text-foreground/90">{rawDescription}</span>
    ) : (
        <span className="italic text-muted-foreground/60 text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" /> Sem descrição
        </span>
    );

    return (
        <TableRow className="hover:bg-muted/40 transition-colors group border-b border-border/60 h-16">
            
            {/* ID */}
            <TableCell className="pl-6 py-4 font-mono text-xs text-muted-foreground align-middle">
                #{item.id.slice(0,6)}
            </TableCell>
            
            {/* SKU */}
            <TableCell className="align-middle">
                <div className="flex flex-col gap-1.5">
                    <Badge variant="outline" className="font-mono w-fit text-[10px] px-2 py-0.5 bg-background/80 text-foreground border-border/80">
                        <Tag className="w-3 h-3 mr-1 text-muted-foreground"/>
                        {skuDisplay}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground pl-0.5">
                        <Clock size={10} />
                        {formatDateSafe(item.displayDate || item.createdAt)}
                    </div>
                </div>
            </TableCell>
            
            {/* Descrição */}
            <TableCell className="align-middle">
                <div className="flex flex-col gap-1 max-w-[300px]">
                    <div className="flex items-center gap-2 text-sm">
                        {hasOrcamento ? <FileText size={14} className="text-indigo-500 shrink-0"/> : <Package size={14} className="text-muted-foreground shrink-0"/>}
                        {descriptionDisplay}
                    </div>
                    <span className="text-[11px] text-muted-foreground/80 pl-6 truncate">
                        {isPending ? "Aguardando proposta inicial" : isRenegotiation ? "Revisão de valores solicitada" : "Processo em andamento"}
                    </span>
                </div>
            </TableCell>
            
            {/* Status */}
            <TableCell className="text-center align-middle">
                <StatusBadge status={currentStatus} />
            </TableCell>
            
            {/* Valor */}
            <TableCell className="text-right align-middle">
                <div className="flex flex-col items-end justify-center">
                    {item.orcamento ? (
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                            <span className="font-mono font-semibold text-emerald-600 text-sm">
                                {formatMoney(item.orcamento.valor_total)}
                            </span>
                        </div>
                    ) : (
                        <Badge variant="secondary" className="font-mono text-xs text-muted-foreground bg-muted/50 border-0">
                            Qtd: {item.amount}
                        </Badge>
                    )}
                </div>
            </TableCell>
            
            {/* Ações */}
            <TableCell className="text-right pr-6 align-middle">
                <div className="flex justify-end gap-2 items-center">
                    
                    {/* NOVO PEDIDO: Apenas enviar orçamento */}
                    {isPending && (
                         <Button 
                            size="sm" 
                            onClick={()=>onAction('create', item)} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs h-8 px-3 border border-indigo-700"
                         >
                             <DollarSign className="w-3 h-3 mr-1.5"/> Enviar Proposta
                         </Button>
                    )}
                    
                    {/* RENEGOCIAÇÃO: Corrigir ou Cancelar (Botão Cancelar agora está bonito e visível aqui) */}
                    {isRenegotiation && (
                         <>
                             <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={()=>onAction('cancel', item)} 
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border border-transparent hover:border-red-200 rounded-full transition-all" 
                                title="Cancelar Negociação"
                             >
                                <Ban size={16}/>
                             </Button>

                             <Button 
                                size="sm" 
                                onClick={()=>onAction('renegotiate', item)} 
                                className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm text-xs h-8 px-3"
                             >
                                 <RefreshCcw className="w-3 h-3 mr-1.5"/> Corrigir Valor
                             </Button>
                         </>
                    )}
                    
                </div>
            </TableCell>
        </TableRow>
    )
}