"use client";

import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PedidosFilters({ search, setSearch, statusFilter, setStatusFilter }) {
    return (
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar SKU..." 
                    className="pl-9 bg-background border-input" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-background">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="solicitado">Solicitado</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="compra_iniciada">Em Compra</SelectItem>
                        <SelectItem value="compra_efetuada">Concluído</SelectItem>
                        <SelectItem value="negado">Negados</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}