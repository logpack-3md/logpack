"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, DollarSign, FileText, Info } from 'lucide-react';
import { getModalTitle } from "./BuyerHelpers";
import clsx from 'clsx';

export default function BuyerModals({
    config, onClose, onSubmit, isSubmitting,
    formData, setFormData
}) {
    const { type } = config;
    if (!type) return null;

    const isCancel = type === 'cancel';
    const isRenegotiation = type === 'renegotiate';

    return (
        <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={clsx("p-0 gap-0 overflow-hidden bg-card border-border shadow-xl", isCancel ? "sm:max-w-[420px]" : "sm:max-w-[480px]")}>

                {/* HEADER ESPECÍFICO POR TIPO */}
                {isCancel ? (
                    <div className="p-6 pb-4 flex flex-col items-center text-center gap-2 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                            <AlertTriangle size={28} strokeWidth={2} />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-red-950 dark:text-red-50">Confirmar Cancelamento</DialogTitle>
                            <DialogDescription className="text-red-800/80 dark:text-red-200/70 mt-1.5">
                                Esta ação é irreversível e encerrará o pedido.
                            </DialogDescription>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-5 border-b bg-muted/30 flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-background shadow-sm text-primary">
                            {isRenegotiation ? <RefreshCcwIcon size={20} /> : <DollarSign size={20} />}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold">{getModalTitle(type)}</DialogTitle>
                            <DialogDescription className="text-xs">Preencha os dados da proposta</DialogDescription>
                        </div>
                    </div>
                )}

                {/* BODY */}
                <div className="p-6">
                    {/* MODO FORMULÁRIO */}
                    {!isCancel && (
                        <div className="space-y-5">

                            {isRenegotiation && (
                                <div className="text-sm bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-100 p-3 rounded-lg border border-amber-200 dark:border-amber-900 flex gap-3">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <span>Gerente solicitou revisão. Insira a nova proposta abaixo.</span>
                                </div>
                            )}

                            <div className="grid gap-1.5">
                                <Label className="text-xs uppercase font-bold text-muted-foreground pl-1">Valor (R$)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">R$</span>
                                    <Input
                                        type="number" step="0.01" placeholder="0.00"
                                        className="pl-9 font-mono text-lg font-bold"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs uppercase font-bold text-muted-foreground pl-1 flex justify-between">
                                    <span>Descrição / Condições</span>
                                </Label>
                                <Textarea
                                    placeholder="Detalhe a proposta, marcas, prazos..."
                                    className="min-h-[120px] resize-none leading-relaxed"
                                    value={formData.desc}
                                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* MODO CANCELAMENTO (Apenas Texto extra) */}
                    {isCancel && (
                        <div className="text-sm text-center text-muted-foreground leading-relaxed">
                            Você está prestes a rejeitar a necessidade de compra e notificar o gerente.
                            Tem certeza que deseja prosseguir?
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <DialogFooter className="px-6 py-4 bg-muted/20 border-t gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        {isCancel ? "Não, manter" : "Cancelar"}
                    </Button>

                    <Button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className={clsx(
                            "font-semibold min-w-[100px]",
                            isCancel
                                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isCancel ? "Sim, Cancelar" : "Enviar"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

// Icone helper local se não tiver importado
const RefreshCcwIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
)