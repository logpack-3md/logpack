"use client";

import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function InsumoFilters({ 
    setorFilter, setSetorFilter, 
    statusFilter, setStatusFilter,
    setores,
    onFilterChange 
}) {
    const hasFilters = setorFilter !== 'todos' || statusFilter !== 'todos';

    const clearFilters = () => {
        setSetorFilter('todos');
        setStatusFilter('todos');
        onFilterChange(); // Dispara refresh
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
            
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Filter className="h-4 w-4" />
                <span>Filtrar visualização por:</span>
            </div>
            
            <div className="flex flex-1 md:flex-none flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Filtro de Setor */}
                <Select 
                    value={setorFilter} 
                    onValueChange={(val) => { setSetorFilter(val); onFilterChange(); }}
                >
                    <SelectTrigger className="w-full sm:w-[200px] bg-background">
                        <SelectValue placeholder="Todos os Setores" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os Setores</SelectItem>
                        {setores.map(s => (
                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Filtro de Status */}
                <Select 
                    value={statusFilter} 
                    onValueChange={(val) => { setStatusFilter(val); onFilterChange(); }}
                >
                    <SelectTrigger className="w-full sm:w-[150px] bg-background">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos Status</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                </Select>

                {/* Botão Limpar */}
                {hasFilters && (
                    <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive">
                        <X size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
}