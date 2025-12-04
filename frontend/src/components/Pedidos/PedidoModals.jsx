"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ShoppingBag, Hash, Clock, User, FileText, AlertTriangle } from 'lucide-react';
import { InsumoImageDetail, formatDate, getStatusColorBg, StatusBadge } from "./PedidoHelpers";
import clsx from "clsx";

export default function PedidoModals({ detailDialog, setDetailDialog, onOpenActionDialog, onOpenBuyDialog, actionDialog, setActionDialog, onConfirmStatusUpdate, buyDialog, setBuyDialog, buyForm, setBuyForm, onSubmitCompra, isSubmitting }) {

    return (
        <>
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({ ...detailDialog, open: false })}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-card border-border">
                    {/* HEADER */}
                    <div className={clsx("pl-6 pr-16 py-5 flex items-center justify-between border-b border-border bg-muted/10", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-0.5"><span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-mono text-muted-foreground">ID: {detailDialog.data?.id.slice(0, 8)}</span><DialogTitle>Detalhes</DialogTitle></div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                        {detailDialog.isLoading ? <div className="space-y-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-20 w-full" /></div> :
                            detailDialog.data ? (
                                <div className="grid md:grid-cols-[200px_1fr] gap-8">
                                    <div className="space-y-4">
                                        <div className="aspect-square rounded-xl bg-muted/20 border border-border flex items-center justify-center overflow-hidden relative shadow-inner">
                                            <InsumoImageDetail src={detailDialog.data.fullInsumo?.image} alt="Insumo" />
                                        </div>
                                        {detailDialog.data.fullInsumo ? (
                                            <div className="bg-muted/40 p-3 rounded-lg border border-border space-y-2">
                                                <div className="flex justify-between text-xs font-medium text-muted-foreground"><span>Estoque</span><span>{detailDialog.data.fullInsumo.current_storage}/{detailDialog.data.fullInsumo.max_storage}</span></div>
                                                <Progress value={(detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) * 100} className="h-1.5" indicatorClassName={(detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) < 0.35 ? "bg-red-500" : "bg-emerald-500"} />
                                            </div>
                                        ) : <div className="p-3 rounded text-center text-xs border border-dashed text-muted-foreground">Dados off-line.</div>}
                                    </div>

                                    <div className="space-y-5 flex flex-col h-full">
                                        <div><h3 className="text-2xl font-bold text-foreground">{detailDialog.data.fullInsumo?.name || "Sem Nome"}</h3><div className="flex items-center gap-2 mt-1"><Badge variant="outline">{detailDialog.data.sku}</Badge>{detailDialog.data.fullInsumo && <Badge variant="secondary">{detailDialog.data.fullInsumo.setorName}</Badge>}</div></div>
                                        <div className="flex-1 bg-muted/10 p-4 rounded-lg border text-sm leading-relaxed text-foreground/80"><span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Descrição</span>{detailDialog.data.fullInsumo?.description || "N/A"}</div>
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <div className="bg-background border rounded p-2.5 flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="p-1 bg-primary/10 rounded text-primary"><User size={12} /></div>
                                                    <div className="flex flex-col"><span className="font-bold uppercase text-[8px] text-muted-foreground">Solicitante</span><span className="text-xs font-mono truncate max-w-[100px]" title={detailDialog.data.userId}>{detailDialog.data.userId ? `User_${detailDialog.data.userId.slice(0, 4)}...` : 'Anon'}</span></div>
                                                </div>
                                            </div>
                                            <div className="bg-background border rounded p-2.5 flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 bg-primary/10 rounded text-primary"><Clock size={12} /></div>
                                                    <div className="flex flex-col"><span className="font-bold uppercase text-[8px] text-muted-foreground">Data</span><span className="text-xs font-medium">{formatDate(detailDialog.data.createdAt)}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : <div className="py-10 text-center text-muted-foreground">Erro.</div>}
                    </div>

                    {!detailDialog.isLoading && detailDialog.data && (
                        <DialogFooter className="px-6 py-4 bg-muted/20 border-t border-border">
                            <div className="flex justify-between w-full items-center">
                                <Button variant="outline" onClick={() => setDetailDialog({ ...detailDialog, open: false })}>Fechar</Button>
                                <div className="flex gap-2">
                                    {(['solicitado', 'pendente'].includes(detailDialog.data.status.toLowerCase())) && (
                                        <><Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={(e) => onOpenActionDialog(e, 'deny', detailDialog.data)}><XCircle className="w-4 h-4 mr-2" /> Negar</Button><Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={(e) => onOpenActionDialog(e, 'approve', detailDialog.data)}><CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar</Button></>
                                    )}
                                    {detailDialog.data.status.toLowerCase() === 'aprovado' && (
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-4" onClick={(e) => onOpenBuyDialog(e, detailDialog.data)}><ShoppingBag className="w-4 h-4 mr-2" /> Comprar</Button>
                                    )}
                                </div>
                            </div>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialogs Actions/Buy mantidos iguais aos de Insumos ... */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
                <DialogContent><DialogHeader><DialogTitle>Confirmar</DialogTitle></DialogHeader><div className="py-4">Confirma a ação?</div><DialogFooter><Button variant="ghost" onClick={() => setActionDialog({ ...actionDialog, open: false })}>Cancelar</Button><Button onClick={onConfirmStatusUpdate} disabled={isSubmitting} className={actionDialog.type === 'approve' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}>Confirmar</Button></DialogFooter></DialogContent>
            </Dialog>
            <Dialog open={buyDialog.open} onOpenChange={(open) => !open && setBuyDialog({ ...buyDialog, open: false })}>
                <DialogContent><DialogHeader><DialogTitle>Nova Compra</DialogTitle></DialogHeader><div className="py-2 space-y-4"><div><Label>Qtd (Múlt. 200)</Label><Input value={buyForm.amount} onChange={e => setBuyForm({ ...buyForm, amount: e.target.value })} type="number" /></div><div><Label>Observações</Label><Textarea value={buyForm.description} onChange={e => setBuyForm({ ...buyForm, description: e.target.value })} /></div></div><DialogFooter><Button variant="ghost" onClick={() => setBuyDialog({ ...buyDialog, open: false })}>Cancelar</Button><Button onClick={onSubmitCompra} disabled={isSubmitting}>Enviar</Button></DialogFooter></DialogContent>
            </Dialog>
        </>
    )
}