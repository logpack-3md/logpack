"use client";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit2, Power, CheckCircle2, XCircle, CheckSquare, CalendarCheck, AlertTriangle } from 'lucide-react';
import { InsumoImageDetail, StatusBadge } from '../InsumoHelpers';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from "clsx";

export default function InsumoDetailsDialog({ 
    open, 
    onOpenChange, 
    data, 
    onStatusClick, 
    onEditClick,
    onVerifyClick 
}) {
    // Helper para formatar data bonitinha
    const formatDate = (dateStr) => {
        if(!dateStr) return null;
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-card border-border shadow-xl gap-0">
                
                {/* Header com Padding extra na direita (pr-16) */}
                <div className="pl-6 pr-16 py-4 flex items-center justify-between border-b border-border bg-muted/10">
                    <div className="flex flex-col gap-0.5">
                         <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-mono text-muted-foreground">SKU: {data?.sku}</span>
                         <DialogTitle className="text-xl font-semibold leading-none">Visão Geral do Insumo</DialogTitle>
                    </div>
                    {data && <StatusBadge status={data.status} />}
                </div>

                {data && (
                    <div className="p-6 grid md:grid-cols-[220px_1fr] gap-8 h-full">
                        
                        {/* Esquerda: Visual + Dados Críticos */}
                        <div className="space-y-4 flex flex-col">
                            <div className="aspect-square rounded-xl bg-muted/20 border border-border flex items-center justify-center overflow-hidden relative group shadow-inner">
                                <InsumoImageDetail src={data.image} alt={data.name} />
                            </div>

                            {/* Card de Estoque */}
                            <div className="bg-card border border-border p-3.5 rounded-xl shadow-sm space-y-2.5">
                                <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    <span>Estoque</span>
                                    <span className="text-foreground font-mono">{data.current_storage} <span className="opacity-50">/ {data.max_storage}</span></span>
                                </div>
                                <Progress 
                                    value={(data.current_storage/data.max_storage)*100} 
                                    className="h-2" 
                                    indicatorClassName={(data.current_storage/data.max_storage)<0.35?"bg-red-500":"bg-emerald-500"}
                                />
                                {(data.current_storage/data.max_storage)<0.35 && (
                                    <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium pt-1">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Nível Crítico
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Direita: Informações */}
                        <div className="space-y-5 flex flex-col h-full">
                            
                            {/* Título e Tags */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground leading-snug">{data.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-muted hover:bg-muted border-border text-muted-foreground">{data.setorName}</Badge>
                                    <span className="text-xs text-muted-foreground border-l border-border pl-2">UN: <strong>{data.measure}</strong></span>
                                </div>
                            </div>

                            {/* Descrição (Flex-1 para ocupar espaço) */}
                            <div className="flex-1 bg-muted/10 p-4 rounded-xl border border-border/50 text-sm leading-relaxed text-foreground/80 shadow-inner min-h-[100px]">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-2 tracking-wider">Descrição Técnica</span>
                                {data.description || <span className="text-muted-foreground/50 italic">Sem descrição informada.</span>}
                            </div>

                            {/* --- ÁREA DE VERIFICAÇÃO --- */}
                            {/* Este bloco tem um estilo destacado para chamar atenção para o processo manual */}
                            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-lg p-3.5 flex items-center justify-between mt-auto">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                        <CalendarCheck className="w-3 h-3" /> Última Verificação Física
                                    </span>
                                    <span className={clsx("text-sm font-medium", !data.last_check && "text-amber-600")}>
                                        {formatDate(data.last_check) || 'Nunca verificado'}
                                    </span>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="default"
                                    className="h-8 gap-2 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={() => onVerifyClick(data)}
                                >
                                    <CheckSquare size={14} /> 
                                    Verificar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer de Ações Administrativas */}
                <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between sm:justify-between">
                    {/* Botão de Fechar Secundário na Esquerda (Opcional) ou Vazio */}
                    <div className="text-xs text-muted-foreground italic">
                         {data?.updatedAt && `Editado no sistema: ${formatDate(data.updatedAt)}`}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={(e) => onStatusClick(e, data)} className={data?.status==='ativo'?"text-red-600 hover:bg-red-100 hover:text-red-700":"text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"}>
                            {data?.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="outline" onClick={() => onEditClick(data)} className="border-border shadow-sm bg-background">
                            <Edit2 className="w-3.5 h-3.5 mr-2"/> Editar Dados
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}