"use client";

import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import clsx from 'clsx';

export const formatDateSafe = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (!isValid(date)) return '-';
    return format(date, "dd/MM/yy HH:mm", { locale: ptBR });
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
    let colors = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    let label = s.replace(/_/g, " ");

    if(s === 'pendente') { label = "Novo Pedido"; colors = "bg-blue-500/10 text-blue-700 border-blue-500/20"; }
    else if(s.includes('renegociacao')) { label = "Renegociação"; colors = "bg-orange-500/10 text-orange-700 border-orange-500/20"; }
    else if(s.includes('fase_de_orcamento')) { label = "Em Análise"; colors = "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"; }
    else if(s.includes('concluido') || s.includes('aprovado')) { label = "Aprovado"; colors = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"; }
    else if(s.includes('negado') || s.includes('cancelado')) { label = s.includes('negado') ? "Negado" : "Cancelado"; colors = "bg-red-500/10 text-red-700 border-red-500/20"; }

    return <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2 py-0.5 text-[10px]", colors)}>{label}</Badge>
};