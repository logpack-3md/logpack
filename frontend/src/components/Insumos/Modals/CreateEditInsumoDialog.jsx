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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Ajuste: w-[95%] ou w-full com max-w garante que não vase a tela no mobile */}
            <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Cadastrar Novo Insumo' : 'Editar Insumo'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create' ? 'Preencha os dados para adicionar ao catálogo.' : 'Altere as informações necessárias.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-4">

                    {/* GRUPO 1: Nome e SKU */}
                    {/* Responsividade: 1 coluna no mobile, 2 no desktop (sm) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Ex: Cimento CP II"
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
                                placeholder="Ex: MAT-001"
                            />
                        </div>
                    </div>

                    {/* GRUPO 2: Setor e Unidade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Setor *</Label>
                            <Select value={formData.setor} onValueChange={v => setFormData({ ...formData, setor: v })} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {setores.map(s => {
                                        const isOccupied = occupiedSectors.has(s.name);
                                        const isCurrentItemSector = (mode === 'edit' && s.name === formData.setor);
                                        if (!isOccupied || isCurrentItemSector) {
                                            return <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>;
                                        }
                                        return null;
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Unidade *</Label>
                            <Select value={formData.measure} onValueChange={v => setFormData({ ...formData, measure: v })} required>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Un" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UN">Unidade</SelectItem>
                                    <SelectItem value="KG">Quilo</SelectItem>
                                    <SelectItem value="L">Litro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Descrição ocupa largura total */}
                    <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="resize-none"
                            rows={3}
                        />
                    </div>

                    {/* GRUPO 3: Estoque e Imagem */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Estoque Máx</Label>
                            <Input
                                type="number"
                                value={formData.max_storage}
                                onChange={e => setFormData({ ...formData, max_storage: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Imagem (Opcional)</Label>
                            {/* Ajuste no input file para não quebrar layout */}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-xs file:mr-2 file:py-1 file:px-2 cursor-pointer pt-[0.4rem]"
                            />
                        </div>
                    </div>

                    {/* Footer com botões flexíveis (coluna no mobile, linha no desktop) */}
                    <DialogFooter className="gap-2 sm:gap-0 mt-6 flex-col-reverse sm:flex-row">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}