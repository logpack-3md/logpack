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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Cadastrar Novo Insumo' : 'Editar Insumo'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create' ? 'Preencha os dados para adicionar ao catálogo.' : 'Altere as informações necessárias.'}
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Nome *</Label>
                            <Input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <Label>SKU *</Label>
                            <Input value={formData.sku} onChange={e=>setFormData({...formData, sku:e.target.value})} required className="uppercase font-mono" disabled={mode==='edit'}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Setor *</Label>
                            <Select value={formData.setor} onValueChange={v=>setFormData({...formData, setor:v})} required>
                                <SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger>
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
                        <div className="space-y-1">
                            <Label>Unidade *</Label>
                            <Select value={formData.measure} onValueChange={v=>setFormData({...formData, measure:v})} required>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UN">Unidade</SelectItem>
                                    <SelectItem value="KG">Quilo</SelectItem>
                                    <SelectItem value="L">Litro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Descrição</Label>
                        <Textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Estoque Máx</Label>
                            <Input type="number" value={formData.max_storage} onChange={e=>setFormData({...formData, max_storage:e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label>Imagem (Opcional)</Label>
                            <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs file:mr-2 file:py-1 file:px-2" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={()=>onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}