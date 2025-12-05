"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function StatusConfirmationDialog({ 
    open, 
    onOpenChange, 
    item, 
    onConfirm, 
    isSubmitting 
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader><DialogTitle>Alterar Status</DialogTitle></DialogHeader>
                <div className="py-2">
                    Confirmar alteração de <strong>{item?.name}</strong> para {item?.status === 'ativo' ? 'Inativo' : 'Ativo'}?
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={onConfirm} disabled={isSubmitting}>Confirmar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}