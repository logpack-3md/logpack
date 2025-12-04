"use client";
import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PedidosFilters({ statusFilter, setStatusFilter, onRefresh }) {
    const hasFilters = statusFilter !== 'todos';
    return (
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mr-auto"><Filter className="h-4 w-4" /><span>Filtrar visualização:</span></div>
            <div className="flex gap-2 w-full md:w-auto items-center">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); if(onRefresh) onRefresh(); }}>
                    <SelectTrigger className="w-full md:w-[200px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="solicitado">Novas Solicitações</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="compra_iniciada">Em Compra</SelectItem>
                        <SelectItem value="compra_efetuada">Concluído</SelectItem>
                        <SelectItem value="negado">Negados</SelectItem>
                    </SelectContent>
                </Select>
                {hasFilters && <Button variant="ghost" size="icon" onClick={() => setStatusFilter('todos')} className="shrink-0 text-muted-foreground hover:text-foreground"><X size={16}/></Button>}
            </div>
        </div>
    );
}