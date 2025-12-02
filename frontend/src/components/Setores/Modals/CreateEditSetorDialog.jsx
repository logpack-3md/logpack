"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers } from 'lucide-react';

export default function CreateEditSetorDialog({ 
    open, 
    onOpenChange, 
    mode, 
    name, 
    setName, 
    onSubmit, 
    isSubmitting 
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" /> 
                        {mode === 'create' ? 'Novo Setor' : 'Renomear Setor'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Nome do Setor (Máx 6 Caracteres)</Label>
                        <Input 
                            value={name} 
                            onChange={e => setName(e.target.value.toUpperCase().slice(0,6))} 
                            placeholder="EX: S-01" 
                            className="uppercase font-mono text-lg tracking-widest"
                            maxLength={6}
                            required
                        />
                        <p className="text-xs text-muted-foreground text-right">{name.length}/6</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting || name.length < 2}>{isSubmitting ? "Salvando..." : "Salvar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}