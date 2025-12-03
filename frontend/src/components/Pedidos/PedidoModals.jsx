"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, ShoppingBag, Hash, Clock, User, FileText } from 'lucide-react';
import { InsumoImage, formatDate, getStatusColorBg, StatusBadge } from "./PedidoHelpers";
import clsx from "clsx";

export default function PedidoModals({
    // Detalhes
    detailDialog, setDetailDialog, 
    onOpenActionDialog, onOpenBuyDialog, 
    // Confirm
    actionDialog, setActionDialog, onConfirmStatusUpdate,
    // Buy
    buyDialog, setBuyDialog, buyForm, setBuyForm, onSubmitCompra,
    isSubmitting
}) {
    
    // Função segura para exibir ID
    const getDisplayId = (data) => {
        if (!data) return "---";
        // Tenta pegar o requesterId, userId, ou o user do pedido
        return data.userId || data.requesterId || "ID Indisponível";
    }

    return (
        <>
            {/* --- MODAL DE DETALHES --- */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({...detailDialog, open: false})}>
                <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-card border-border shadow-2xl gap-0">
                    
                    {/* HEADER: Padding right 16 para livrar o botão X */}
                    <div className={clsx("pl-8 pr-16 py-5 flex items-center justify-between border-b border-border/60", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1 font-mono">
                                <Hash className="w-3 h-3" /> {detailDialog.data?.id.slice(0,8)}
                            </span>
                            <DialogTitle className="font-semibold text-xl leading-none tracking-tight">
                                Detalhes da Solicitação
                            </DialogTitle>
                        </div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>

                    {/* BODY */}
                    <div className="p-8">
                        {detailDialog.isLoading ? (
                            <div className="space-y-6">
                                <div className="flex gap-6"><Skeleton className="h-40 w-40 rounded-xl"/><div className="flex-1 space-y-4"><Skeleton className="h-8 w-3/4"/><Skeleton className="h-24 w-full"/></div></div>
                            </div>
                        ) : detailDialog.data ? (
                            <div className="grid md:grid-cols-[35%_1fr] gap-8">
                                
                                {/* ESQUERDA: Imagem e Estoque */}
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-2xl bg-muted/20 border border-border flex items-center justify-center overflow-hidden relative">
                                        <InsumoImage src={detailDialog.data.fullInsumo?.image} alt="Insumo" />
                                        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono font-bold border shadow-sm z-10">{detailDialog.data.sku}</div>
                                    </div>
                                    {detailDialog.data.fullInsumo && (
                                        <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2.5">
                                            <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground tracking-wider">
                                                <span>Estoque</span>
                                                <span className="text-foreground">{detailDialog.data.fullInsumo.current_storage} / {detailDialog.data.fullInsumo.max_storage}</span>
                                            </div>
                                            <Progress 
                                                value={(detailDialog.data.fullInsumo.current_storage/detailDialog.data.fullInsumo.max_storage)*100} 
                                                className="h-1.5 bg-muted" 
                                                indicatorClassName={(detailDialog.data.fullInsumo.current_storage/detailDialog.data.fullInsumo.max_storage)<0.35?"bg-red-500":"bg-emerald-500"} 
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* DIREITA: Dados e Infos */}
                                <div className="space-y-5 flex flex-col h-full">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground leading-tight mb-2">
                                            {detailDialog.data.fullInsumo?.name || "Nome do Insumo"}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="font-normal">Setor: {detailDialog.data.fullInsumo?.setorName || "N/A"}</Badge>
                                            <Badge variant="outline">UN: {detailDialog.data.fullInsumo?.measure || "UN"}</Badge>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-muted/10 p-4 rounded-lg border border-border text-sm text-foreground/80">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex gap-1 items-center"><FileText size={10}/> Descrição</span>
                                        {detailDialog.data.fullInsumo?.description || "Sem descrição técnica."}
                                    </div>

                                    {/* METADADOS EMPILHADOS E DESTACADOS (BACKGROUND ESCURO/MUTED) */}
                                    <div className="flex flex-col gap-2 mt-auto pt-2">
                                        
                                        {/* Solicitante */}
                                        <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-between shadow-sm">
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                                <User size={12} className="text-primary" /> Solicitante
                                            </span>
                                            <span className="text-xs font-mono font-medium text-foreground select-all">
                                                {getDisplayId(detailDialog.data)}
                                            </span>
                                        </div>

                                        {/* Data */}
                                        <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-between shadow-sm">
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                                <Clock size={12} className="text-primary" /> Criado em
                                            </span>
                                            <span className="text-xs font-medium text-foreground">
                                                {formatDate(detailDialog.data.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="py-10 text-center text-muted-foreground">Não foi possível carregar os dados.</div>}
                    </div>
                    
                    {/* FOOTER ACTIONS */}
                    {!detailDialog.isLoading && detailDialog.data && (
                        <DialogFooter className="px-8 py-5 bg-muted/20 border-t border-border flex justify-between items-center">
                            <Button variant="ghost" onClick={() => setDetailDialog({...detailDialog, open: false})}>Fechar</Button>

                            <div className="flex gap-3">
                                {(['solicitado', 'pendente'].includes(detailDialog.data.status.toLowerCase())) && (
                                    <>
                                        <Button variant="outline" className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100" onClick={(e)=>onOpenActionDialog(e,'deny',detailDialog.data)}>Rejeitar</Button>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={(e)=>onOpenActionDialog(e,'approve',detailDialog.data)}>Aprovar</Button>
                                    </>
                                )}
                                {detailDialog.data.status.toLowerCase() === 'aprovado' && (
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" onClick={(e)=>onOpenBuyDialog(e, detailDialog.data)}><ShoppingBag className="w-4 h-4 mr-2"/> Comprar</Button>
                                )}
                            </div>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL CONFIRM AÇÃO */}
            <Dialog open={actionDialog.open} onOpenChange={(open)=>!open && setActionDialog({...actionDialog, open:false})}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar {actionDialog.type === 'approve' ? 'Aprovação' : 'Rejeição'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 text-muted-foreground text-sm">Deseja realmente continuar com esta ação para o item <strong>{actionDialog.item?.sku}</strong>?</div>
                    <DialogFooter><Button variant="ghost" onClick={()=>setActionDialog({...actionDialog, open:false})}>Voltar</Button><Button className={actionDialog.type==='approve'?"bg-emerald-600":"bg-red-600"} onClick={onConfirmStatusUpdate} disabled={isSubmitting}>Confirmar</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL COMPRA */}
            <Dialog open={buyDialog.open} onOpenChange={(open)=>!open && setBuyDialog({...buyDialog, open:false})}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Ordem de Compra</DialogTitle></DialogHeader>
                    <div className="py-2 space-y-4">
                        <div className="bg-muted p-2 rounded text-xs border flex justify-between"><span>Item: <strong>{buyDialog.item?.sku}</strong></span><Badge className="bg-emerald-600 text-white">Aprovado</Badge></div>
                        <div><Label>Quantidade</Label><Input type="number" value={buyForm.amount} onChange={e=>setBuyForm({...buyForm, amount:e.target.value})}/></div>
                        <div><Label>Descrição</Label><Textarea value={buyForm.description} onChange={e=>setBuyForm({...buyForm, description:e.target.value})}/></div>
                    </div>
                    <DialogFooter><Button variant="ghost" onClick={()=>setBuyDialog({...buyDialog, open:false})}>Cancelar</Button><Button onClick={onSubmitCompra} disabled={isSubmitting}>Confirmar</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}