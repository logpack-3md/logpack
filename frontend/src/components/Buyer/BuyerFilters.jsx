"use client";

import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BuyerFilters({ statusFilter, setStatusFilter, onRefresh }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
             <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mr-auto">
                 <Filter className="h-4 w-4" />
                 <span>Filtrar lista:</span>
             </div>

             <div className="w-full sm:w-auto">
                 <Select 
                    value={statusFilter} 
                    onValueChange={(val) => { setStatusFilter(val); if(onRefresh) onRefresh(); }}
                 >
                    <SelectTrigger className="w-full sm:w-[220px] bg-background"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendente">Novos Pedidos</SelectItem>
                        <SelectItem value="renegociacao_solicitada">Renegociação</SelectItem>
                        <SelectItem value="fase_de_orcamento">Aguardando Aprovação</SelectItem>
                        <SelectItem value="concluido">Aprovados</SelectItem>
                        <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                 </Select>
             </div>
        </div>
    );
}