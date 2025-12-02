"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, Package, Filter, Plus, Upload, MoreHorizontal, 
    Droplets, Box as BoxIcon, FileText, Shield, AlertCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

// Hook
import { useInsumosOperations } from '@/hooks/useInsumosOperations';

// Mapa de Ícones por tipo (simulado pela cor/setor)
const getIcon = (index) => {
    const icons = [Droplets, BoxIcon, FileText, Package, Shield];
    const Icon = icons[index % icons.length];
    return <Icon className="h-6 w-6" />;
};

// Mapa de Cores Pastéis (Adaptado para Dark Mode)
const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
];

export default function InsumosPage() {
    const { 
        insumos, setores, loading, 
        filters, setFilters, 
        fetchData, createInsumo 
    } = useInsumosOperations();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado do Formulário
    const [formData, setFormData] = useState({
        name: '', sku: '', setor: '', description: '', measure: '', max_storage: '', status: 'ativo', file: null
    });

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await createInsumo(formData);
        setIsSubmitting(false);
        if (success) {
            setIsCreateOpen(false);
            setFormData({ name: '', sku: '', setor: '', description: '', measure: '', max_storage: '', status: 'ativo', file: null });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files[0] }));
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-muted/40 p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            
            {/* Header e Ações Principais */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Insumos</h1>
                    <p className="text-muted-foreground mt-1">Visualize e cadastre materiais disponíveis no estoque.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Novo Insumo
                </Button>
            </div>

            {/* Barra de Filtros */}
            <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nome ou SKU..." 
                        className="pl-9 bg-background border-input"
                        value={filters.search}
                        onChange={(e) => setFilters.setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={filters.setorFilter} onValueChange={setFilters.setSetorFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-background border-input">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground"/>
                            <SelectValue placeholder="Setor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os Setores</SelectItem>
                            {setores.map(s => (
                                <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.statusFilter} onValueChange={setFilters.setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[150px] bg-background border-input">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid de Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[180px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : insumos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-border">
                    <div className="bg-muted p-4 rounded-full mb-3">
                        <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Nenhum insumo encontrado</h3>
                    <p className="text-muted-foreground max-w-sm mt-1">Tente ajustar os filtros ou cadastre um novo item.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {insumos.map((item) => (
                        <Card key={item.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden border-border bg-card">
                            {/* Header do Card (Imagem ou Placeholder) */}
                            <div className="h-40 w-full bg-muted/30 relative overflow-hidden flex items-center justify-center border-b border-border/50">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className={clsx("p-4 rounded-full", colors[item.colorIndex])}>
                                        {getIcon(item.colorIndex)}
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground shadow-sm">
                                        {item.measure}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-foreground truncate pr-2" title={item.name}>
                                            {item.name}
                                        </h3>
                                        <p className="text-xs font-mono text-muted-foreground mt-1">{item.sku}</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-0">
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline" className="font-normal text-muted-foreground bg-muted/50 border-border">
                                        {item.setorName}
                                    </Badge>
                                    {item.status === 'inativo' && (
                                        <Badge variant="destructive" className="font-normal">Inativo</Badge>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 border-t border-border bg-muted/10 flex justify-between items-center text-xs text-muted-foreground">
                                <span>Estoque máx: {item.max_storage}</span>
                                <span>
                                    Atualizado {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: ptBR })}
                                </span>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- MODAL DE CRIAÇÃO --- */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Novo Insumo</DialogTitle>
                        <DialogDescription>Preencha as informações para cadastrar um novo material.</DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome do Insumo *</Label>
                                <Input 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    placeholder="Ex: Papel A4" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>SKU / Código *</Label>
                                <Input 
                                    value={formData.sku} 
                                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                                    required 
                                    placeholder="Ex: PAP-001" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Setor Responsável *</Label>
                                <Select onValueChange={(val) => setFormData({...formData, setor: val})} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {setores.map(s => (
                                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Unidade de Medida *</Label>
                                <Select onValueChange={(val) => setFormData({...formData, measure: val})} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="UN">Unidade (UN)</SelectItem>
                                        <SelectItem value="KG">Quilo (KG)</SelectItem>
                                        <SelectItem value="LT">Litro (LT)</SelectItem>
                                        <SelectItem value="CX">Caixa (CX)</SelectItem>
                                        <SelectItem value="PCT">Pacote (PCT)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                placeholder="Detalhes adicionais sobre o item..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Estoque Máximo</Label>
                                <Input 
                                    type="number" 
                                    value={formData.max_storage} 
                                    onChange={e => setFormData({...formData, max_storage: e.target.value})} 
                                    placeholder="0" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Status Inicial</Label>
                                <Select defaultValue="ativo" onValueChange={(val) => setFormData({...formData, status: val})}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ativo">Ativo</SelectItem>
                                        <SelectItem value="inativo">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Imagem de Capa</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-muted/50 transition-colors text-center cursor-pointer relative">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                                    <span className="text-sm font-medium">
                                        {formData.file ? formData.file.name : "Clique para selecionar uma imagem"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() =>   setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                {isSubmitting ? "Salvando..." : "Criar Insumo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}