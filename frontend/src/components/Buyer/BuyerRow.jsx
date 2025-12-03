"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Package, DollarSign, RefreshCcw, Ban, Edit3 } from 'lucide-react';
import { formatDateSafe, formatMoney, StatusBadge } from "./BuyerHelpers";

export default function BuyerRow({ item, onAction }) {
    const currentStatus = item.status;
    const hasOrcamento = !!item.orcamento;
    const isPending = currentStatus === 'pendente';
    
    // Verifica se está em estado de renegociação (qualquer variante)
    const isRenegotiation = String(currentStatus).includes('renegociacao');
    
    return (
        <TableRow className="hover:bg-muted/40 transition-colors group border-b border-border/60">
            <TableCell className="pl-6 py-4 font-mono text-xs text-muted-foreground">
                #{item.id.slice(0,6)}
            </TableCell>
            
            <TableCell>
                <div className="flex flex-col gap-1 max-w-[300px]">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {hasOrcamento ? <FileText size={14} className="text-indigo-500"/> : <Package size={14} className="text-muted-foreground"/>}
                        <span className="truncate">{item.orcamento?.description || item.description}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {formatDateSafe(item.createdAt || item.updatedAt)}
                    </span>
                </div>
            </TableCell>
            
            <TableCell className="text-center">
                <StatusBadge status={currentStatus} />
            </TableCell>
            
            <TableCell className="text-right">
                <div className="flex flex-col items-end">
                    {item.orcamento ? (
                        <span className="font-mono font-semibold text-emerald-600 text-sm">
                             {formatMoney(item.orcamento.valor_total)}
                        </span>
                    ) : (
                        <span className="font-mono text-sm text-foreground">{item.amount} un.</span>
                    )}
                </div>
            </TableCell>
            
            <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-2 items-center">
                    
                    {/* ESTADO 1: Novo Pedido (Sem orçamento ainda) */}
                    {isPending && (
                         <Button size="sm" onClick={()=>onAction('create', item)} className="bg-primary text-primary-foreground shadow-sm text-xs h-8 px-3">
                             <DollarSign className="w-3 h-3 mr-1"/> Enviar Orçamento
                         </Button>
                    )}
                    
                    {/* ESTADO 2: Renegociação (Novo valor + Cancelar) */}
                    {isRenegotiation && (
                         <>
                             {/* Botão Cancelar adicionado aqui */}
                             <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={()=>onAction('cancel', item)} 
                                className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" 
                                title="Cancelar Negociação"
                             >
                                <Ban size={14}/>
                             </Button>

                             <Button 
                                size="sm" 
                                onClick={()=>onAction('renegotiate', item)} 
                                className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-xs h-8 px-3"
                             >
                                 <RefreshCcw className="w-3 h-3 mr-1"/> Novo Valor
                             </Button>
                         </>
                    )}
                    
                    {/* ESTADO 3: Aguardando Aprovação (Editar/Cancelar) */}
                    {hasOrcamento && !['concluido', 'negado', 'cancelado'].includes(currentStatus) && !isRenegotiation && (
                        <>
                             <Button size="icon" variant="ghost" onClick={()=>onAction('edit_desc', item)} className="h-8 w-8 text-muted-foreground hover:bg-muted" title="Editar"><Edit3 size={14}/></Button>
                             <Button size="icon" variant="ghost" onClick={()=>onAction('cancel', item)} className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600" title="Cancelar"><Ban size={14}/></Button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}