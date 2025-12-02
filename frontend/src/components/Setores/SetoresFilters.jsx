"use client";

import { Search, Filter, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SetoresFilters({ 
    search, setSearch, 
    statusFilter, setStatusFilter,
    onFilterChange 
}) {
    const hasFilters = (search && search.length > 0) || statusFilter !== 'todos';

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('todos');
        onFilterChange();
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm items-center justify-between shrink-0">
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar Setor por nome..." 
                    className="pl-9 bg-background border-input" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto items-center">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block self-center" />
                
                {/* Filtro de Status (Ativo/Inativo) */}
                <Select 
                    value={statusFilter} 
                    onValueChange={(val) => { setStatusFilter(val); onFilterChange(); }}
                >
                    <SelectTrigger className="w-[150px] bg-background border-input">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Ativos</SelectItem>
                        <SelectItem value="inativo">Inativos</SelectItem>
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <X size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
}