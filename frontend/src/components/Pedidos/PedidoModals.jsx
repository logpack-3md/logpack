"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ShoppingBag, Hash, Clock, User, } from 'lucide-react';
import { InsumoImageDetail, formatDate, getStatusColorBg, StatusBadge } from "./PedidoHelpers";
import clsx from "clsx";

export default function PedidoModals({ detailDialog, setDetailDialog, onOpenActionDialog, onOpenBuyDialog, actionDialog, setActionDialog, onConfirmStatusUpdate, buyDialog, setBuyDialog, buyForm, setBuyForm, onSubmitCompra, isSubmitting }) {

    const MAX_OBS_LENGTH = 300; 
    const currentObsLength = buyForm.description?.length || 0;

    return (
        <>
            <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({ ...detailDialog, open: false })}>
                <DialogContent className="w-[95%] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 bg-card border-border rounded-lg">
                    {/* HEADER */}
                    <div className={clsx("pl-6 pr-12 py-5 flex items-center justify-between border-b border-border bg-muted/10 sticky top-0 z-10", getStatusColorBg(detailDialog.data?.status))}>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-mono text-muted-foreground">ID: {detailDialog.data?.id.slice(0, 8)}</span>
                            <DialogTitle>Detalhes</DialogTitle>
                        </div>
                        {detailDialog.data && <StatusBadge status={detailDialog.data.status} inverse />}
                    </div>

                    {/* BODY */}
                    <div className="p-4 sm:p-6">
                        {detailDialog.isLoading ? (
                            <div className="space-y-6">
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : detailDialog.data ? (
                            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8">
                                <div className="space-y-4">
                                    <div className="aspect-square w-full max-w-[200px] mx-auto md:max-w-none rounded-xl bg-muted/20 border border-border flex items-center justify-center overflow-hidden relative shadow-inner">
                                        <InsumoImageDetail src={detailDialog.data.fullInsumo?.image} alt="Insumo" />
                                    </div>
                                    {detailDialog.data.fullInsumo ? (
                                        <div className="bg-muted/40 p-3 rounded-lg border border-border space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                                <span>Estoque</span>
                                                <span>{detailDialog.data.fullInsumo.current_storage}/{detailDialog.data.fullInsumo.max_storage}</span>
                                            </div>
                                            <Progress value={(detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) * 100} className="h-1.5" indicatorClassName={(detailDialog.data.fullInsumo.current_storage / detailDialog.data.fullInsumo.max_storage) < 0.35 ? "bg-red-500" : "bg-emerald-500"} />
                                        </div>
                                    ) : <div className="p-3 rounded text-center text-xs border border-dashed text-muted-foreground">Dados off-line.</div>}
                                </div>

                                {/* Coluna das Informações */}
                                <div className="space-y-5 flex flex-col h-full">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground wrap-break-word">{detailDialog.data.fullInsumo?.name || "Sem Nome"}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <Badge variant="outline">{detailDialog.data.sku}</Badge>
                                            {detailDialog.data.fullInsumo && <Badge variant="secondary">{detailDialog.data.fullInsumo.setorName}</Badge>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 bg-muted/10 p-4 rounded-lg border text-sm leading-relaxed text-foreground/80">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Descrição</span>
                                        {detailDialog.data.fullInsumo?.description || "N/A"}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                        <div className="bg-background border rounded p-2.5 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="p-1 bg-primary/10 rounded text-primary shrink-0"><User size={12} /></div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-bold uppercase text-[8px] text-muted-foreground">Solicitante</span>
                                                    <span className="text-xs font-mono truncate" title={detailDialog.data.userId}>{detailDialog.data.userId ? `User_${detailDialog.data.userId.slice(0, 4)}...` : 'Anon'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-background border rounded p-2.5 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-primary/10 rounded text-primary shrink-0"><Clock size={12} /></div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold uppercase text-[8px] text-muted-foreground">Data</span>
                                                    <span className="text-xs font-medium">{formatDate(detailDialog.data.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="py-10 text-center text-muted-foreground">Erro ao carregar dados.</div>}
                    </div>

                    {!detailDialog.isLoading && detailDialog.data && (
                        <DialogFooter className="px-6 py-4 bg-muted/20 border-t border-border">
                            <div className="flex flex-col-reverse sm:flex-row justify-between w-full items-center gap-4 sm:gap-0">
                                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setDetailDialog({ ...detailDialog, open: false })}>Fechar</Button>
                                
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    {(['solicitado', 'pendente'].includes(detailDialog.data.status.toLowerCase())) && (
                                        <>
                                            <Button variant="ghost" className="w-full sm:w-auto text-red-600 hover:bg-red-50" onClick={(e) => onOpenActionDialog(e, 'deny', detailDialog.data)}>
                                                <XCircle className="w-4 h-4 mr-2" /> Negar
                                            </Button>
                                            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={(e) => onOpenActionDialog(e, 'approve', detailDialog.data)}>
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar
                                            </Button>
                                        </>
                                    )}
                                    {detailDialog.data.status.toLowerCase() === 'aprovado' && (
                                        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-4" onClick={(e) => onOpenBuyDialog(e, detailDialog.data)}>
                                            <ShoppingBag className="w-4 h-4 mr-2" /> Comprar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
                <DialogContent className="w-[90%] sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar Ação</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-sm text-muted-foreground">
                        Tem certeza que deseja prosseguir com esta ação?
                    </div>
                    <DialogFooter className="flex-row justify-end gap-2">
                        <Button variant="ghost" onClick={() => setActionDialog({ ...actionDialog, open: false })}>Cancelar</Button>
                        <Button 
                            onClick={onConfirmStatusUpdate} 
                            disabled={isSubmitting} 
                            className={actionDialog.type === 'approve' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={buyDialog.open} onOpenChange={(open) => !open && setBuyDialog({ ...buyDialog, open: false })}>
                <DialogContent className="w-[90%] sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Nova Compra</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 space-y-4">
                        <div>
                            <Label htmlFor="amount">Quantidade (Múlt. 200)</Label>
                            <Input 
                                id="amount"
                                value={buyForm.amount} 
                                onChange={e => setBuyForm({ ...buyForm, amount: e.target.value })} 
                                type="number"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <Label htmlFor="description">Observações</Label>
                                <span className={clsx("text-[10px] font-mono", currentObsLength >= MAX_OBS_LENGTH ? "text-red-500 font-bold" : "text-muted-foreground")}>
                                    {currentObsLength}/{MAX_OBS_LENGTH}
                                </span>
                            </div>
                            <Textarea 
                                id="description"
                                value={buyForm.description} 
                                onChange={e => setBuyForm({ ...buyForm, description: e.target.value })}
                                maxLength={MAX_OBS_LENGTH}
                                placeholder="Insira detalhes adicionais sobre a compra..."
                                className="mt-1.5 resize-none h-24 break-all"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setBuyDialog({ ...buyDialog, open: false })}>Cancelar</Button>
                        <Button onClick={onSubmitCompra} disabled={isSubmitting}>Enviar Solicitação</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}