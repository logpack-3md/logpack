"use client";

import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import clsx from 'clsx';
import { 
    CheckCircle2, XCircle, Clock, ArrowLeftRight, 
    Hourglass, Ban, Activity, HelpCircle
} from 'lucide-react';

export const formatDateSafe = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (!isValid(date)) return '-';
    return format(date, "dd MMM, HH:mm", { locale: ptBR });
};

export const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

export const getModalTitle = (type) => {
    if(type==='create') return 'Novo Orçamento';
    if(type==='renegotiate') return 'Renegociar Valor';
    if(type==='edit_desc') return 'Editar Detalhes';
    if(type==='cancel') return 'Cancelar Pedido';
    return '';
}

export const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    
    let style = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    let label = s;
    let Icon = Activity;

    if(s === 'pendente') { 
        label = "Novo Pedido"; 
        style = "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400"; 
        Icon = Clock;
    }
    else if(s === 'renegociacao' || s === 'renegociacao_solicitada') { 
        // Mantém label bonita mas funciona com status cru
        label = "Renegociação"; 
        style = "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400"; 
        Icon = ArrowLeftRight;
    }
    else if(s.includes('fase_de_orcamento')) { 
        label = "Em Análise"; 
        style = "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-400"; 
        Icon = Hourglass;
    }
    else if(s.includes('concluido') || s.includes('aprovado')) { 
        label = "Aprovado"; 
        style = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400"; 
        Icon = CheckCircle2;
    }
    else if(s.includes('negado')) { 
        label = "Negado"; 
        style = "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400"; 
        Icon = XCircle;
    }
    else if(s.includes('cancelado')) {
        label = "Cancelado"; 
        style = "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"; 
        Icon = Ban;
    }

    return (
        <Badge variant="outline" className={clsx("shadow-none border font-medium px-2.5 py-0.5 gap-1.5 inline-flex items-center whitespace-nowrap", style)}>
            <Icon size={12} /> {label}
        </Badge>
    );
};