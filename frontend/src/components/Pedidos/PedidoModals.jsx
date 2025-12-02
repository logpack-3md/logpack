"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, ShoppingBag, Hash, Clock, User, FileText, Copy } from 'lucide-react';
import { InsumoImage, formatDate, getStatusColorBg, StatusBadge } from "./PedidoHelpers";
import clsx from "clsx";
import { toast } from "sonner";

export default function PedidoModals({
    detailDialog, setDetailDialog, 
    onOpenActionDialog, onOpenBuyDialog, 
    actionDialog, setActionDialog, onConfirmStatusUpdate,
    buyDialog, setBuyDialog, buyForm, setBuyForm, onSubmitCompra,
    isSubmitting
}) {
    
    // Função auxiliar para copiar ID
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID copiado!");
    };

    return (
        <>
            {/* 1. MODAL DE DETALHES (Visual Novo) */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({...detailDialog, open: false})}>
                <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-card border-border shadow-2xl gap-0">
                    
                    {/* HEADER: Adicionado 'pr-16' para o botão de fechar não cobrir o badge */}
                    <div className={clsx("pl-6 pr-16 py-5 flex items-center justify-between border-b border-border/60", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                                <Hash className="w-3 h-3" /> {detailDialog.data?.id?.slice(0,8)}...
                            </span>
                            <DialogTitle className="font-semibold text-xl leading-none tracking-tight">
                                Detalhes da Solicitação
                            </DialogTitle>
                        </div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>

                    {/* BODY */}
                    <div className="p-6 md:p-8">
                        {detailDialog.isLoading ? (
                            <div className="space-y-6">
                                <div className="flex gap-6"><Skeleton className="h-40 w-40 rounded-xl"/><div className="flex-1 space-y-4"><Skeleton className="h-8 w-3/4"/><Skeleton className="h-32 w-full"/></div></div>
                            </div>
                        ) : detailDialog.data ? (
                            <div className="grid md:grid-cols-[35%_1fr] gap-8">
                                
                                {/* COLUNA ESQUERDA (IMAGEM + ESTOQUE) */}
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-2xl bg-muted/30 border border-border flex items-center justify-center overflow-hidden relative group shadow-sm">
                                        <InsumoImage src={detailDialog.data.fullInsumo?.image} alt="Insumo" />
                                        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono font-bold border shadow-sm z-10">
                                            {detailDialog.data.sku}
                                        </div>
                                    </div>
                                    
                                    {detailDialog.data.fullInsumo ? (
                                        <div className="bg-muted/30 p-3.5 rounded-xl border border-border space-y-2">
                                            <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground tracking-wider">
                                                <span>Estoque Atual</span>
                                                <span className="text-foreground">{detailDialog.data.fullInsumo.current_storage}/{detailDialog.data.fullInsumo.max_storage}</span>
                                            </div>
                                            <Progress 
                                                value={(detailDialog.data.fullInsumo.current_storage/detailDialog.data.fullInsumo.max_storage)*100} 
                                                className="h-2 bg-background/50" 
                                                indicatorClassName={(detailDialog.data.fullInsumo.current_storage/detailDialog.data.fullInsumo.max_storage)<0.35?"bg-red-500":"bg-emerald-500"} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 border-2 border-dashed rounded-xl text-xs text-muted-foreground">
                                            Estoque indisponível
                                        </div>
                                    )}
                                </div>

                                {/* COLUNA DIREITA (TEXTOS + METADADOS VERTICAIS) */}
                                <div className="flex flex-col h-full">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                                            {detailDialog.data.fullInsumo?.name || "Nome do Insumo"}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="secondary" className="font-normal">Setor: {detailDialog.data.fullInsumo?.setorName || "N/A"}</Badge>
                                            <Badge variant="outline">UN: {detailDialog.data.fullInsumo?.measure || "UN"}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex-1 mb-4">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 flex gap-1.5 items-center">
                                            <FileText size={12}/> Descrição Técnica
                                        </span>
                                        <div className="bg-muted/10 p-3 rounded-lg border text-sm text-foreground/80 min-h-[80px]">
                                            {detailDialog.data.fullInsumo?.description || "Nenhuma descrição disponível."}
                                        </div>
                                    </div>

                                    {/* DADOS UM EMBAIXO DO OUTRO (Fundo Escuro/Muted) */}
                                    <div className="flex flex-col gap-2 mt-auto">
                                        
                                        {/* CARD USER */}
                                        <div className="flex items-center justify-between bg-muted/60 border border-border/50 p-2.5 rounded-lg">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border border-border text-primary">
                                                    <User size={16}/>
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Solicitante</span>
                                                    <span className="text-sm font-medium truncate font-mono" title={detailDialog.data.requesterId || detailDialog.data.userId}>
                                                        {detailDialog.data.requesterId || detailDialog.data.userId || "---"}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => copyToClipboard(detailDialog.data.requesterId || detailDialog.data.userId)}>
                                                <Copy size={12} />
                                            </Button>
                                        </div>

                                        {/* CARD DATE */}
                                        <div className="flex items-center gap-3 bg-muted/60 border border-border/50 p-2.5 rounded-lg">
                                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border border-border text-primary">
                                                <Clock size={16}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Data Solicitação</span>
                                                <span className="text-sm font-medium">
                                                    {formatDate(detailDialog.data.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ) : <div className="py-10 text-center text-muted-foreground">Erro ao carregar dados.</div>}
                    </div>
                    
                    {/* FOOTER ACTIONS */}
                    {!detailDialog.isLoading && detailDialog.data && (
                        <DialogFooter className="px-8 py-5 bg-muted/20 border-t border-border">
                            {/* Fecha Modal */}
                            <Button variant="outline" className="mr-auto border-border text-muted-foreground" onClick={() => setDetailDialog({...detailDialog, open: false})}>
                                Fechar
                            </Button>

                            {(['solicitado', 'pendente'].includes(detailDialog.data.status.toLowerCase())) && (
                                <div className="flex gap-3">
                                    <Button 
                                        variant="ghost" 
                                        className="text-red-600 hover:bg-red-100 hover:text-red-700" 
                                        onClick={(e)=>onOpenActionDialog(e,'deny',detailDialog.data)}
                                    >
                                        <XCircle className="w-4 h-4 mr-2"/> Rejeitar
                                    </Button>
                                    <Button 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" 
                                        onClick={(e)=>onOpenActionDialog(e,'approve',detailDialog.data)}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2"/> Aprovar
                                    </Button>
                                </div>
                            )}

                            {detailDialog.data.status.toLowerCase() === 'aprovado' && (
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-md" onClick={(e)=>onOpenBuyDialog(e, detailDialog.data)}>
                                    <ShoppingBag className="w-4 h-4 mr-2"/> Iniciar Compra
                                </Button>
                            )}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            {/* --- 2. MODAL ACTION (CONFIRM) --- */}
            <Dialog open={actionDialog.open} onOpenChange={(open)=>!open && setActionDialog({...actionDialog, open:false})}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Confirmar Ação</DialogTitle></DialogHeader>
                    <div className="py-4">
                        Deseja <strong>{actionDialog.type==='approve'?'APROVAR':'REJEITAR'}</strong> o pedido 
                        <span className="font-mono bg-muted px-1 mx-1 rounded">{actionDialog.item?.sku}</span>?
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={()=>setActionDialog({...actionDialog, open:false})}>Cancelar</Button>
                        <Button className={actionDialog.type === 'approve' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"} onClick={onConfirmStatusUpdate} disabled={isSubmitting}>
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- 3. MODAL BUY --- */}
            <Dialog open={buyDialog.open} onOpenChange={(open)=>!open && setBuyDialog({...buyDialog, open:false})}>
                <DialogContent>
                    <DialogHeader><DialogTitle className="flex items-center gap-2 text-indigo-600"><ShoppingBag size={20}/> Nova Compra</DialogTitle></DialogHeader>
                    <div className="py-2 space-y-4">
                        <div><Label>Qtd (Múlt. 200)</Label><Input type="number" value={buyForm.amount} onChange={e=>setBuyForm({...buyForm, amount:e.target.value})}/></div>
                        <div><Label>Instruções</Label><Textarea value={buyForm.description} onChange={e=>setBuyForm({...buyForm, description:e.target.value})}/></div>
                    </div>
                    <DialogFooter><Button variant="ghost" onClick={()=>setBuyDialog({...buyDialog, open:false})}>Cancelar</Button><Button onClick={onSubmitCompra} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enviar Pedido</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}