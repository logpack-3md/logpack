"use client";

import React, { useMemo } from 'react';
import {
    Loader2, MoreHorizontal, FileText, DollarSign,
    ArrowLeftRight, Ban, Inbox, CheckCircle2, XCircle, Clock, AlertCircle, CalendarDays,
    PackageOpen
} from 'lucide-react';
import clsx from 'clsx';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// --- Utilitários ---

const formatCurrency = (val) => {
    if (val === null || val === undefined) return '-';
    const numberVal = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numberVal)) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberVal);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
        }).format(date);
    } catch (e) {
        return dateString;
    }
};

const StatusBadge = ({ status }) => {
    const styles = {
        pendente: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
        fase_de_orcamento: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
        renegociacao: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
        concluido: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
        negado: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
        cancelado: "bg-muted text-muted-foreground border-border",
    };
    
    const labels = {
        pendente: "Novo Pedido",
        fase_de_orcamento: "Em Análise",
        renegociacao: "Renegociação",
        concluido: "Aprovado",
        negado: "Negado",
        cancelado: "Cancelado"
    };

    const Icons = {
        pendente: Inbox,
        fase_de_orcamento: Clock,
        renegociacao: ArrowLeftRight,
        concluido: CheckCircle2,
        negado: XCircle,
        cancelado: Ban
    };

    const Icon = Icons[status] || AlertCircle;

    return (
        <Badge variant="outline" className={clsx("gap-1.5 py-0.5 px-2.5 font-normal whitespace-nowrap shadow-sm", styles[status] || styles.cancelado)}>
            <Icon className="h-3.5 w-3.5" />
            <span className="capitalize">{labels[status] || status}</span>
        </Badge>
    );
};

export default function ListCompras({ compras = [], loading = false, onAction }) {
    
    const sortedCompras = useMemo(() => {
        const lista = Array.isArray(compras) ? [...compras] : [];
        return lista.sort((a, b) => {
            const getPriority = (status) => {
                if (status === 'pendente') return 2;
                if (status === 'renegociacao') return 1;
                return 0;
            };
            const priorityA = getPriority(a.status);
            const priorityB = getPriority(b.status);
            if (priorityA !== priorityB) return priorityB - priorityA;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [compras]);

    // --- ESTADOS DE LOADING ---
    const isInitialLoading = loading && sortedCompras.length === 0;
    const isRevalidating = loading && sortedCompras.length > 0;

    if (isInitialLoading) {
        return (
            <div className="w-full bg-card rounded-lg border border-border p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-3 w-[150px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sortedCompras.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-dashed border-border animate-in fade-in-50">
                <div className="rounded-full bg-muted p-4 mb-3">
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Tudo limpo por aqui</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                    Nenhum pedido encontrado com os filtros atuais.
                </p>
            </div>
        );
    }

    return (
        <div className="relative rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            
            {/* Overlay sutil de carregamento ao revalidar */}
            {isRevalidating && (
                <div className="absolute inset-0 bg-background/50 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px] transition-all duration-300">
                    <div className="bg-background/80 px-4 py-2 rounded-full shadow-sm border flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Atualizando...</span>
                    </div>
                </div>
            )}

            <Table className={clsx("transition-opacity duration-300", isRevalidating && "opacity-60")}>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="w-[140px] pl-6 font-medium text-muted-foreground">Data</TableHead>
                        <TableHead className="min-w-[200px] font-medium text-muted-foreground">Descrição do Insumo</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                        <TableHead className="text-center font-medium text-muted-foreground">Quantidade</TableHead>
                        <TableHead className="text-right font-medium text-muted-foreground">Orçamento (R$)</TableHead>
                        <TableHead className="text-right pr-6 font-medium text-muted-foreground">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedCompras.map((item) => {
                        // --- Extração Segura de Valores ---
                        
                        // 1. Tenta pegar o objeto orçamento (trata array se vier de hasMany)
                        const orcamentoObj = Array.isArray(item.orcamento) ? item.orcamento[0] : item.orcamento;
                        
                        // 2. Tenta pegar o valor total (prioridade: dentro do orcamento > direto no item > null)
                        const rawValue = orcamentoObj?.valor_total ?? item.valor_total;
                        
                        // 3. Verifica se temos um valor válido (diferente de null/undefined) para exibir
                        const hasValue = rawValue !== undefined && rawValue !== null;
                        
                        // 4. Verifica se existe vínculo de orçamento para habilitar menus (precisa de ID)
                        const hasOrcamentoLinked = !!orcamentoObj?.id;

                        const isPending = item.status === 'pendente';
                        const isRenegotiation = item.status === 'renegociacao';
                        
                        const rowClass = clsx(
                            "hover:bg-muted/50 border-border transition-colors group",
                            isPending && "bg-blue-50/30 hover:bg-blue-50/50",
                            isRenegotiation && "bg-orange-50/30 hover:bg-orange-50/50"
                        );

                        return (
                            <TableRow key={item.id} className={rowClass}>
                                <TableCell className="pl-6 py-4 align-top">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                            {formatDate(item.createdAt)}
                                        </div>
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
                                            #{item.id.toString().slice(0, 8)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 align-top">
                                    <div className="flex items-start gap-2">
                                        <PackageOpen className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <p className="text-sm text-foreground/90 leading-snug line-clamp-2 max-w-[300px]" title={item.description}>
                                            {item.description}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 align-top">
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="text-center py-4 align-top">
                                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-muted font-mono text-sm font-medium text-foreground">
                                        {item.amount || 0}
                                        <span className="ml-1 text-xs text-muted-foreground">unid.</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right py-4 align-top">
                                    <span className={clsx(
                                        "font-medium",
                                        // Se tiver valor, destaca em verde (ou cor de dinheiro)
                                        hasValue ? "text-emerald-600 font-semibold" : "text-muted-foreground/40"
                                    )}>
                                        {hasValue ? formatCurrency(rawValue) : '---'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right py-4 pr-6 align-top">
                                    <div className="flex justify-end items-center gap-2">
                                        {item.status === 'pendente' && (
                                            <Button 
                                                size="sm" 
                                                variant="default"
                                                className="bg-primary hover:bg-primary/90 h-8 px-3 text-xs shadow-sm" 
                                                onClick={() => onAction && onAction('create', item)}
                                            >
                                                <DollarSign className="mr-1.5 h-3.5 w-3.5" /> Orçar
                                            </Button>
                                        )}
                                        {item.status === 'renegociacao' && (
                                            <Button 
                                                size="sm" 
                                                variant="secondary"
                                                className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 h-8 px-3 text-xs shadow-sm" 
                                                onClick={() => onAction && onAction('renegotiate', item)}
                                            >
                                                <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" /> Renegociar
                                            </Button>
                                        )}
                                        {/* Menu só aparece se tiver vínculo de orçamento (ID) */}
                                        {hasOrcamentoLinked && !['concluido', 'negado', 'cancelado'].includes(item.status) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => onAction && onAction('edit_desc', item)}>
                                                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" /> Editar Descrição
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => onAction && onAction('cancel', item)}>
                                                        <Ban className="mr-2 h-4 w-4" /> Cancelar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}