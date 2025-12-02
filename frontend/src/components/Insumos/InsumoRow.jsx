"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit2, Power } from 'lucide-react';
import clsx from 'clsx';
import { InsumoImage, StatusBadge } from './InsumoHelpers';

export default function InsumoRow({ item, onRowClick, onToggleStatus }) {
    return (
        <TableRow className="hover:bg-muted/40 cursor-pointer border-b border-border/60 group h-12" onClick={onRowClick}>
            <TableCell className="pl-6 py-1.5 w-[80px]">
                {/* Imagem Ajustada: container menor na altura, imagem interna preenche */}
                <div className="w-9 h-9 bg-muted/30 rounded-md overflow-hidden border border-border flex items-center justify-center shadow-sm">
                    <InsumoImage src={item.image} />
                </div>
            </TableCell>
            
            <TableCell className="py-1.5 align-middle">
                <div className="flex flex-col leading-tight">
                    <span className="font-medium text-sm text-foreground">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono tracking-wide hidden sm:inline-block mt-0.5">{item.sku}</span>
                </div>
            </TableCell>
            
            <TableCell className="py-1.5 align-middle">
                <Badge variant="secondary" className="text-[10px] font-normal h-5 bg-muted border-border text-muted-foreground px-1.5 shadow-none">
                    {item.setorName}
                </Badge>
            </TableCell>
            
            <TableCell className="py-1.5 align-middle">
                <div className="text-sm font-mono flex items-center">
                    <span className={clsx("font-medium", (item.current_storage/item.max_storage)<0.35 ? "text-red-600" : "")}>
                        {item.current_storage}
                    </span> 
                    <span className="text-muted-foreground text-[10px] ml-0.5">/ {item.max_storage}</span>
                </div>
            </TableCell>
            
            <TableCell className="text-center py-1.5 align-middle">
                <StatusBadge status={item.status}/>
            </TableCell>
            
            <TableCell className="text-right pr-6 py-1.5 align-middle">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e=>e.stopPropagation()}>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e)=>{e.stopPropagation(); onRowClick();}}>
                            <Edit2 size={13}/>
                        </Button>
                    </TooltipTrigger><TooltipContent>Detalhes/Editar</TooltipContent></Tooltip></TooltipProvider>
                    
                    <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className={item.status==='ativo'?"h-7 w-7 text-green-600 hover:bg-green-50":"h-7 w-7 text-red-600 hover:bg-red-50"} onClick={(e)=>{e.stopPropagation(); onToggleStatus(e, item)}}>
                            <Power size={13}/>
                        </Button>
                    </TooltipTrigger><TooltipContent>{item.status==='ativo'?'Desativar':'Ativar'}</TooltipContent></Tooltip></TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );
}