"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { getModalTitle } from "./BuyerHelpers";
import clsx from 'clsx';

export default function BuyerModals({
    config, onClose, onSubmit, isSubmitting,
    formData, setFormData
}) {
    const { type } = config;
    if(!type) return null;

    return (
        <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>{getModalTitle(type)}</DialogTitle>
                    <DialogDescription>
                         {type === 'renegotiate' ? "Insira o novo valor e justificativa." : "Preencha os dados abaixo."}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-5">
                    
                    {/* CAMPOS DE VALOR E DESCRIÇÃO (Compartilhados por Create e Renegotiate) */}
                    {(type === 'create' || type === 'renegotiate') && (
                        <>
                             <div className="space-y-2">
                                 <Label>Valor Total (R$)</Label>
                                 <div className="relative">
                                     <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>
                                     <Input 
                                         type="number" 
                                         step="0.01"
                                         placeholder="0.00" 
                                         className="pl-9 font-mono text-lg"
                                         value={formData.amount} 
                                         onChange={e => setFormData({...formData, amount: e.target.value})} 
                                         autoFocus
                                     />
                                 </div>
                                 {type === 'renegotiate' && <p className="text-[11px] text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">⚠️ Atenção: Negocie o valor com base na solicitação do gerente.</p>}
                             </div>

                             <div className="space-y-2">
                                 <Label>Detalhes / Descrição</Label>
                                 <Textarea 
                                     placeholder="Descreva as condições, marcas, prazos..." 
                                     className="min-h-[100px] resize-none"
                                     value={formData.desc} 
                                     onChange={e => setFormData({...formData, desc: e.target.value})} 
                                 />
                                 <p className="text-[10px] text-muted-foreground text-right">Descreva o item orçado.</p>
                             </div>
                        </>
                    )}

                    {type === 'cancel' && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800 font-medium">
                            Tem certeza que deseja cancelar este pedido? O status da compra e do orçamento será encerrado.
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button 
                        onClick={onSubmit} 
                        disabled={isSubmitting} 
                        className={clsx("shadow-sm text-white min-w-[120px]", type==='cancel' ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90")}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : (type==='cancel' ? "Confirmar" : "Enviar")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}