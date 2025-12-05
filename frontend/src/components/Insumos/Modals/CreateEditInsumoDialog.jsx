"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEditInsumoDialog({
    open,
    onOpenChange,
    mode,
    formData,
    setFormData,
    handleFileChange,
    onSubmit,
    setores,
    occupiedSectors,
    isSubmitting
}) {
    const availableSectors = setores.filter(s => {
        const isOccupied = occupiedSectors.has(s.name);
        const isCurrentItemSector = (mode === 'edit' && s.name === formData.setor);
        return !isOccupied || isCurrentItemSector;
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Cadastrar Novo Insumo' : 'Editar Insumo'}</DialogTitle>
                    <DialogDescription>
                        Dados básicos. Setor é opcional.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Nome do item"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>SKU *</Label>
                            <Input
                                value={formData.sku}
                                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                required
                                className="uppercase font-mono"
                                disabled={mode === 'edit'}
                                placeholder="COD-001"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Setor (Opcional)</Label>
                            <Select 
                                value={formData.setor || "none"} 
                                onValueChange={v => setFormData({ ...formData, setor: v })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* O hook vai transformar 'none' em '' para o backend */}
                                    <SelectItem value={null}>Sem Setor</SelectItem>
                                    
                                    {availableSectors.map(s => (
                                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Unidade *</Label>
                            <Select value={formData.measure} onValueChange={v => setFormData({ ...formData, measure: v })} required>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Un" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KG">Quilo</SelectItem>
                                    <SelectItem value="L">Litro</SelectItem>
                                    <SelectItem value="ML">Mililitro</SelectItem>
                                    <SelectItem value="G">Grama</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="resize-none"
                            rows={3}
                            placeholder="Detalhes..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Estoque Máx</Label>
                            <Input
                                type="number"
                                value={formData.max_storage}
                                onChange={e => setFormData({ ...formData, max_storage: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Imagem</Label>
                            <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs pt-1.5"/>
                        </div>
                    </div>

                    <DialogFooter className="mt-4 gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}