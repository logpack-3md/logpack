"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    FileText, DollarSign, ShoppingBag, RefreshCcw, CheckCircle2, XCircle, 
    Hash, MessageSquare, Calendar, User 
} from 'lucide-react';
import { StatusBadge, getStatusColorBg } from "./OrcamentoComponents";
import clsx from "clsx";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function OrcamentoModals({
    // Estados do Modal de Detalhes
    detailDialog, setDetailDialog,
    
    // Funções de Ação vindas da Página
    onDecisionClick, 
    
    // Estados do Modal de Confirmação
    confirmDialog, setConfirmDialog, 
    onConfirmSubmit, 
    isSubmitting,

    // Estados do Texto de Renegociação
    renegText, setRenegText
}) {
    
    const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
    const formatDate = (d) => { try { return format(new Date(d), "dd 'de' MMMM, HH:mm", {locale: ptBR}); } catch { return '-'; } };

    // Configuração do Modal de Confirmação baseado no tipo de ação
    const getConfirmConfig = (type) => {
        switch(type) {
            case 'aprovado': return { 
                title: "Aprovar Orçamento", 
                desc: "Você está prestes a aprovar o valor e autorizar a compra imediata.",
                btnColor: "bg-emerald-600 hover:bg-emerald-700", 
                btnText: "Confirmar Aprovação" 
            };
            case 'negado': return { 
                title: "Negar Orçamento", 
                desc: "O orçamento será rejeitado e o processo encerrado. O comprador será notificado.",
                btnColor: "bg-red-600 hover:bg-red-700", 
                btnText: "Confirmar Negação" 
            };
            case 'renegociacao': return { 
                title: "Solicitar Renegociação", 
                desc: "O orçamento retornará ao comprador para ajuste de valor.",
                btnColor: "bg-orange-600 hover:bg-orange-700", 
                btnText: "Enviar Solicitação" 
            };
            default: return {};
        }
    };

    const confirmConfig = getConfirmConfig(confirmDialog.type);
    const isRenegotiation = confirmDialog.type === 'renegociacao';

    return (
        <>
            {/* 1. MODAL DE DETALHES */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({...detailDialog, open: false})}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card border-border shadow-xl gap-0">
                    
                    {/* HEADER */}
                    <div className={clsx("pl-6 pr-16 py-5 flex items-center justify-between border-b border-border/60", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 flex items-center gap-1 font-mono">
                                <Hash className="w-3 h-3" /> {detailDialog.data?.id.slice(0,8)}
                            </span>
                            <DialogTitle className="font-semibold text-xl">Detalhes do Orçamento</DialogTitle>
                        </div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>
                    
                    {/* BODY */}
                    <div className="p-6 space-y-6">
                        {!detailDialog.data ? <div className="py-10"><Skeleton className="h-40 w-full" /></div> : (
                            <>
                                {/* VALOR (Destaque) */}
                                <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase text-muted-foreground">Valor Proposto</span>
                                        <span className="text-[10px] text-muted-foreground">Qtd. Solicitada: {detailDialog.data.originalAmount}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-foreground flex items-center gap-1">
                                        <DollarSign className="text-emerald-600 w-6 h-6" strokeWidth={2.5} />
                                        {formatMoney(detailDialog.data.valor_total)}
                                    </div>
                                </div>

                                {/* DESCRIÇÃO */}
                                <div className="bg-muted/10 p-4 rounded-lg border border-border/60 space-y-2 min-h-[100px]">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex gap-1 items-center">
                                        <FileText size={12}/> Descrição / Itens Inclusos
                                    </span>
                                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                                        {detailDialog.data.description || "Nenhuma descrição fornecida pelo comprador."}
                                    </p>
                                </div>

                                {/* METADADOS (User e Data - Um debaixo do outro com fundo escuro) */}
                                <div className="flex flex-col gap-2">
                                    <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between border border-border/40">
                                        <span className="text-[11px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> Comprador Responsável
                                        </span>
                                        <span className="text-sm font-mono text-foreground">{detailDialog.data.buyerId || "N/A"}</span>
                                    </div>

                                    <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between border border-border/40">
                                        <span className="text-[11px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> Data de Recebimento
                                        </span>
                                        <span className="text-sm font-medium text-foreground">{formatDate(detailDialog.data.createdAt)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* FOOTER: Ações de Decisão */}
                    {(detailDialog.data?.status === 'pendente' || detailDialog.data?.status === 'renegociacao_solicitada') ? (
                        <DialogFooter className="px-6 py-5 bg-muted/20 border-t border-border flex justify-between sm:justify-between w-full">
                            <Button variant="outline" onClick={() => setDetailDialog({ ...detailDialog, open: false })}>Fechar</Button>
                            
                            <div className="flex gap-2">
                                <Button 
                                    size="icon" variant="outline" 
                                    className="border-orange-200 text-orange-600 hover:bg-orange-50 h-10 w-10" 
                                    onClick={() => { 
                                        // Fecha o modal de detalhe para focar na confirmação/texto
                                        setDetailDialog(p=>({...p, open: false})); 
                                        onDecisionClick('renegociacao', detailDialog.data); 
                                    }} 
                                    title="Renegociar"
                                >
                                    <RefreshCcw size={18}/>
                                </Button>
                                
                                <Button 
                                    size="icon" variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50 h-10 w-10" 
                                    onClick={() => { 
                                        setDetailDialog(p=>({...p, open: false})); 
                                        onDecisionClick('negado', detailDialog.data); 
                                    }} 
                                    title="Negar"
                                >
                                    <XCircle size={20}/>
                                </Button>
                                
                                <Button 
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-2 pl-4 pr-5 h-10" 
                                    onClick={() => { 
                                        setDetailDialog(p=>({...p, open: false})); 
                                        onDecisionClick('aprovado', detailDialog.data); 
                                    }}
                                >
                                    <CheckCircle2 size={18}/> Aprovar
                                </Button>
                            </div>
                        </DialogFooter>
                    ) : (
                         <DialogFooter className="px-6 py-4 bg-muted/20 border-t border-border">
                             <Button variant="outline" onClick={() => setDetailDialog({ ...detailDialog, open: false })}>Fechar</Button>
                         </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            {/* 2. MODAL DE CONFIRMAÇÃO / RENEGOCIAÇÃO */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({...confirmDialog, open: false})}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{confirmConfig.title}</DialogTitle>
                        {/* Se não for renegociação, mostra descrição simples. Se for, esconde pois mostramos alerta */}
                        {!isRenegotiation && <div className="pt-2 text-muted-foreground text-sm">{confirmConfig.desc}</div>}
                    </DialogHeader>
                    
                    {isRenegotiation ? (
                        <div className="py-2 space-y-4 animate-in slide-in-from-top-2">
                            <div className="p-3 bg-orange-50 text-orange-800 border border-orange-100 rounded-lg text-sm">
                                {confirmConfig.desc}
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-foreground font-semibold">
                                    <MessageSquare className="w-4 h-4 text-primary" /> Motivo da Renegociação / Instruções
                                </Label>
                                <Textarea 
                                    className="min-h-[120px] bg-background font-medium resize-none focus:ring-orange-500" 
                                    value={renegText} 
                                    onChange={(e) => setRenegText(e.target.value)} 
                                    placeholder="Ex: O valor unitário está acima do esperado. Solicitamos desconto de 5% ou frete grátis..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted/30 p-3 rounded-md text-sm border mt-2 mb-2 flex justify-between items-center">
                             <span className="text-foreground">Referência: <span className="font-mono font-bold">{confirmDialog.item?.id?.slice(0,8)}</span></span>
                             <span className="text-emerald-600 font-bold text-lg">{formatMoney(confirmDialog.item?.valor_total)}</span>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setConfirmDialog({...confirmDialog, open: false})}>Cancelar</Button>
                        
                        <Button 
                            className={clsx(confirmConfig.btnColor, "text-white shadow-sm")} 
                            onClick={onConfirmSubmit} // Função ligada corretamente
                            disabled={isSubmitting || (isRenegotiation && !renegText?.trim())} // Impede enviar renegociação sem texto
                        >
                            {isSubmitting ? "Processando..." : confirmConfig.btnText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}