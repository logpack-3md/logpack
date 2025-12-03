"use client";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';

// --- BADGE DE STATUS ---
export const StatusBadge = ({ status, inverse }) => {
    const s = String(status || '').toLowerCase();
    let colors = "bg-slate-500/10 text-slate-600 border-slate-500/20"; 
    let label = s;

    if (s.includes('aprovado') || s.includes('concluido')) {
        colors = inverse ? "bg-white/20 text-white border-white/40" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400";
        label = "Aprovado";
    } else if (s.includes('negado')) {
        colors = inverse ? "bg-white/20 text-white border-white/40" : "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400";
        label = "Negado";
    } else if (s.includes('cancelado')) {
        colors = inverse ? "bg-white/20 text-white border-white/40" : "bg-gray-500/10 text-gray-700 border-gray-500/20";
        label = "Cancelado";
    } else if (s.includes('renegociacao')) {
        colors = inverse ? "bg-white/20 text-white border-white/40" : "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400";
        label = "Em Renegociação";
    } else if (s.includes('pendente') || s.includes('solicitado')) {
        colors = inverse ? "bg-white/20 text-white border-white/40" : "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400";
        label = "Pendente";
    }

    return (
        <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2.5", colors)}>
            {label}
        </Badge>
    );
};

export const getStatusColorBg = (status) => {
    const s = String(status || '').toLowerCase();
    if(s.includes('aprovado')) return "bg-emerald-50 dark:bg-emerald-950/30";
    if(s.includes('negado')) return "bg-red-50 dark:bg-red-950/30";
    if(s.includes('renegociacao')) return "bg-orange-50 dark:bg-orange-950/30";
    if(s.includes('pendente')) return "bg-blue-50 dark:bg-blue-950/30";
    return "bg-muted/50";
}

// --- BARRA DE FILTROS ---
export function OrcamentoFilters({ statusFilter, setStatusFilter, onRefresh }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mr-auto">
                <Filter className="h-4 w-4" />
                <span>Filtrar orçamentos:</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
                <Select 
                    value={statusFilter} 
                    onValueChange={(val) => { setStatusFilter(val); if(onRefresh) onRefresh(); }}
                >
                    <SelectTrigger className="w-full sm:w-[220px] bg-background">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendente">Pendentes (A Decidir)</SelectItem>
                        <SelectItem value="renegociacao">Em Renegociação</SelectItem>
                        <SelectItem value="aprovado">Aprovados</SelectItem>
                        <SelectItem value="negado">Negados</SelectItem>
                        <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                </Select>
                
                {statusFilter !== 'todos' && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setStatusFilter('todos')} 
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                        <X size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
}