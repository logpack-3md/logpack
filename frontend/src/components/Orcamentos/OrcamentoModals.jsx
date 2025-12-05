"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"; // Caso use Badge
import { RefreshCcw, CheckCircle2, XCircle, DollarSign, FileText, Hash, Calendar, User } from 'lucide-react'; // Icons
import { StatusBadge, getStatusColorBg } from "./OrcamentoComponents"; // Helpers
import clsx from 'clsx';

export default function OrcamentoModals({
    detailDialog, setDetailDialog, onDecisionClick,
    confirmDialog, setConfirmDialog, onConfirmSubmit, isSubmitting, renegText, setRenegText
}) {
    // ... manter helpers do modal (formatDate etc) iguais

    // Configuração visual do Modal de Confirmação
    const getConfirmStyles = (type) => {
        if (type === 'aprovado') return { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900', text: 'text-emerald-800 dark:text-emerald-200', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' };
        if (type === 'negado') return { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-100 dark:border-red-900', text: 'text-red-800 dark:text-red-200', btn: 'bg-red-600 hover:bg-red-700 text-white' };
        if (type === 'renegociacao') return { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-100 dark:border-amber-900', text: 'text-amber-800 dark:text-amber-200', btn: 'bg-amber-600 hover:bg-amber-700 text-white' };
        return { bg: 'bg-muted', border: 'border-border', text: 'text-foreground', btn: 'bg-primary' };
    }

    const style = getConfirmStyles(confirmDialog.type);

    return (
        <>
            {/* 1. Detalhes (Mantido do código anterior que está OK) */}
            {/* ... */}
            
            {/* 2. CONFIRM DIALOG (THEME FIX) */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({...confirmDialog, open: false})}>
                <DialogContent className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden shadow-2xl">
                    <div className={clsx("px-6 py-5 border-b", style.bg, style.border)}>
                         <DialogTitle className={clsx("flex items-center gap-2 text-lg font-bold", style.text)}>
                            {confirmDialog.type === 'aprovado' && <CheckCircle2/>}
                            {confirmDialog.type === 'negado' && <XCircle/>}
                            {confirmDialog.type === 'renegociacao' && <RefreshCcw/>}
                            {confirmDialog.type === 'aprovado' ? "Aprovar Orçamento" : confirmDialog.type === 'negado' ? "Negar Orçamento" : "Solicitar Renegociação"}
                         </DialogTitle>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {confirmDialog.type === 'aprovado' && "Você está prestes a aprovar este orçamento. Uma ordem de compra será gerada automaticamente."}
                            {confirmDialog.type === 'negado' && "Esta ação rejeitará a proposta e encerrará o processo de compra. O comprador será notificado."}
                            {confirmDialog.type === 'renegociacao' && "O orçamento retornará ao comprador com status 'Em Renegociação'. Use o campo abaixo para descrever o motivo."}
                        </p>

                        {confirmDialog.type === 'renegociacao' && (
                            <div className="space-y-2">
                                <Label className="font-semibold">Mensagem ao Comprador</Label>
                                <Textarea 
                                    placeholder="Ex: Valor muito alto, solicitamos 5% de desconto..."
                                    className="min-h-[100px] bg-background resize-none focus:ring-1"
                                    value={renegText}
                                    onChange={(e) => setRenegText(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border">
                        <Button variant="outline" onClick={() => setConfirmDialog({...confirmDialog, open: false})}>Cancelar</Button>
                        <Button 
                            className={clsx("shadow-sm font-semibold", style.btn)} 
                            onClick={onConfirmSubmit} 
                            disabled={isSubmitting || (confirmDialog.type === 'renegociacao' && !renegText?.trim())}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}