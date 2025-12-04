"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';
import { formatDate, StatusBadge } from "./ManagerHelpers";
import { TABS } from '@/hooks/useManagerDashboard';
import clsx from "clsx";

// Sub-componentes de linha para cada tipo
const PedidoRow = ({ item }) => (
    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60 h-12">
        <TableCell className="pl-6 font-mono text-xs text-muted-foreground w-[80px] hidden md:table-cell">
            #{item.id.slice(0, 8)}
        </TableCell>
        <TableCell>
            <div className="flex items-center">
                <Badge variant="outline" className="font-mono text-xs bg-background font-normal px-2 py-1 border-border whitespace-nowrap">
                    {item.insumoSKU || item.sku || '---'}
                </Badge>
            </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
            <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-muted-foreground/70"/>
                {formatDate(item.createdAt)}
            </div>
        </TableCell>
        <TableCell className="text-right pr-6">
            <div className="flex justify-end">
                <StatusBadge status={item.status} />
            </div>
        </TableCell>
    </TableRow>
);

const OrcamentoRow = ({ item }) => (
    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60 h-12">
        <TableCell className="pl-6 font-mono text-xs text-muted-foreground w-[80px] hidden md:table-cell">
            #{item.id.slice(0, 8)}
        </TableCell>
        <TableCell className="max-w-[150px] sm:max-w-[250px]">
             <div className="flex flex-col">
                <span className="truncate text-sm font-medium text-foreground">{item.description || "Sem descrição"}</span>
                <span className="text-[10px] text-muted-foreground md:hidden">ID: #{item.id.slice(0,4)}</span>
             </div>
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
             <span className="font-mono font-semibold text-emerald-600 text-sm">
                {item.valor_total 
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total) 
                    : <span className="text-muted-foreground font-normal text-xs">-</span>
                }
            </span>
        </TableCell>
        <TableCell className="text-right pr-6">
            <div className="flex justify-end">
                 <StatusBadge status={item.status} />
            </div>
        </TableCell>
    </TableRow>
);

const InsumoRow = ({ item }) => (
    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60 h-12">
        <TableCell className="pl-6 py-2">
            <div className="flex flex-col">
                <span className="font-medium text-sm block text-foreground">{item.name || item.nome}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{item.sku || item.SKU}</span>
            </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
            <Badge variant="secondary" className="font-normal text-xs bg-muted border-border">
                {item.setorName && item.setorName !== 'null' ? item.setorName : "N/A"}
            </Badge>
        </TableCell>
        <TableCell className="text-sm text-right md:text-left whitespace-nowrap">
            <span className={clsx(
                "font-semibold",
                (item.current_storage < (item.max_storage * 0.35)) ? "text-red-600" : "text-foreground"
            )}>
                {item.current_storage || 0}
            </span> 
            <span className="text-muted-foreground text-xs opacity-70"> / {item.max_storage}</span>
        </TableCell>
        <TableCell className="text-right pr-6 hidden sm:table-cell">
            <div className="flex justify-end">
                <StatusBadge status={item.status} />
            </div>
        </TableCell>
    </TableRow>
);

const SetorRow = ({ item }) => (
    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-b border-border/60 h-12">
        <TableCell className="pl-6 py-2">
            <span className="font-semibold text-primary text-sm">{item.name}</span>
        </TableCell>
        <TableCell className="font-mono text-xs text-muted-foreground hidden sm:table-cell">
            #{item.id}
        </TableCell>
        <TableCell className="text-right pr-6">
            <div className="flex justify-end">
                <StatusBadge status={item.status} />
            </div>
        </TableCell>
    </TableRow>
);

export default function ManagerTable({ type, data }) {
    const renderContent = () => {
        switch (type) {
            case TABS.PEDIDOS:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                <TableHead className="w-[100px] pl-6 h-10 hidden md:table-cell">ID</TableHead>
                                <TableHead className="h-10">Insumo (SKU)</TableHead>
                                <TableHead className="h-10 hidden sm:table-cell">Data</TableHead>
                                <TableHead className="text-right pr-6 h-10">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{data.map((item) => <PedidoRow key={item.id} item={item} />)}</TableBody>
                    </>
                );

            case TABS.ORCAMENTOS:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                <TableHead className="w-[100px] pl-6 h-10 hidden md:table-cell">ID</TableHead>
                                <TableHead className="h-10">Descrição</TableHead>
                                <TableHead className="text-right h-10">Total</TableHead>
                                <TableHead className="text-right pr-6 h-10">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{data.map((item) => <OrcamentoRow key={item.id} item={item} />)}</TableBody>
                    </>
                );

            case TABS.INSUMOS:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                <TableHead className="pl-6 h-10">Insumo / SKU</TableHead>
                                <TableHead className="h-10 hidden md:table-cell">Setor</TableHead>
                                <TableHead className="h-10 text-right md:text-left">Estoque</TableHead>
                                <TableHead className="text-right pr-6 h-10 hidden sm:table-cell">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{data.map((item) => <InsumoRow key={item.id} item={item} />)}</TableBody>
                    </>
                );

            case TABS.SETORES:
                return (
                    <>
                        <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                <TableHead className="pl-6 h-10">Nome</TableHead>
                                <TableHead className="h-10 hidden sm:table-cell">ID Interno</TableHead>
                                <TableHead className="text-right pr-6 h-10">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{data.map((item) => <SetorRow key={item.id} item={item} />)}</TableBody>
                    </>
                );
            default: return null;
        }
    };

    // w-full min-w-full permite que em telas muito pequenas a tabela tenha scroll horizontal se necessário
    return <Table className="w-full min-w-full">{renderContent()}</Table>;
}