"use client";

import { Badge } from "@/components/ui/badge";
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { 
    CheckCircle2, XCircle, ShoppingBag, 
    Clock, Activity, HelpCircle 
} from 'lucide-react';

export const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (!isValid(d)) return '-';
        return format(d, "dd MMM yyyy", { locale: ptBR });
    } catch {
        return dateStr;
    }
};

export const formatStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
        case 'solicitado': return 'Solicitado';
        case 'pendente': return 'Solicitado';
        case 'aprovado': return 'Aprovado';
        case 'negado': return 'Negado';
        case 'compra_iniciada': return 'Em Compra';
        case 'compra_efetuada': return 'Concluído';
        case 'concluido': return 'Concluído';
        case 'renegociacao': return 'Renegociar';
        case 'renegociacao_solicitada': return 'Renegociando';
        case 'fase_de_orcamento': return 'Em Análise';
        case 'cancelado': return 'Cancelado';
        case 'ativo': return 'Ativo';
        case 'inativo': return 'Inativo';
        default: return status || 'N/A';
    }
}

export const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    
    let colors = "bg-slate-500/10 text-slate-600 border-slate-500/20"; 
    let Icon = Activity;

    if (s.includes('aprovado') || s.includes('concluido') || s.includes('compra_efetuada')) {
        colors = "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-400 dark:border-emerald-500/20";
        Icon = CheckCircle2;
    } 
    else if (s.includes('negado') || s.includes('cancelado')) {
        colors = "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-400 dark:border-rose-500/20";
        Icon = XCircle;
    } 
    else if (s.includes('compra_iniciada')) {
        colors = "bg-blue-500/10 text-blue-700 border-blue-500/25 dark:text-blue-400 dark:border-blue-500/20";
        Icon = ShoppingBag;
    } 
    else if (s.includes('pendente') || s.includes('solicitado')) {
        colors = "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-400 dark:border-amber-500/20";
        Icon = Clock;
    }
    else if (s.includes('ativo')) {
        colors = "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400";
        Icon = CheckCircle2;
    }
    else if (s.includes('inativo')) {
        colors = "bg-slate-500/10 text-slate-500 border-slate-500/20";
        Icon = XCircle;
    }

    return (
        <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2.5 py-0.5 gap-1.5 items-center inline-flex", colors)}>
            <Icon size={10} className="shrink-0"/>
            {formatStatusLabel(s)}
        </Badge>
    );
};