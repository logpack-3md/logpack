"use client";

import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Box, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export const formatDate = (d) => { 
    try { return format(new Date(d), "dd MMM, HH:mm", {locale: ptBR}); } catch { return '-'; } 
};

export const formatLabel = (s) => {
    if(!s) return 'N/A';
    if(s.includes('compra_iniciada')) return 'Em Compra';
    if(s.includes('compra_efetuada')) return 'Concluído';
    return s;
}

export const StatusBadge = ({ status, inverse }) => {
    const s = String(status || '').toLowerCase();
    let color = "bg-slate-500/10 text-slate-600 border-slate-500/20";
    
    if (s.includes('aprovado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400";
    else if (s.includes('negado') || s.includes('cancelado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400";
    else if (s.includes('compra')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400";
    else if (s.includes('pendente') || s.includes('solicitado')) color = inverse ? "bg-white/20 text-white border-white/40" : "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400";
    
    return <Badge variant="outline" className={clsx("capitalize shadow-none border whitespace-nowrap font-medium px-2.5 py-0.5", color)}>{formatLabel(s)}</Badge>;
};

export const getStatusColorBg = (status) => {
    const s = String(status || '').toLowerCase();
    if(s.includes('aprovado')) return "bg-emerald-50/50 dark:bg-emerald-950/30";
    if(s.includes('negado')) return "bg-red-50/50 dark:bg-red-950/30";
    if(s.includes('compra')) return "bg-blue-50/50 dark:bg-blue-950/30";
    if(s.includes('pendente')) return "bg-amber-50/50 dark:bg-amber-950/30";
    return "bg-muted/50";
}

export const InsumoImageDetail = ({ src, alt }) => {
    const [err, setErr] = useState(false);
    // No modal detalhe, se der erro, mostra ícone genérico
    if(!src || err) return <ImageIcon className="w-16 h-16 text-muted-foreground/20"/>;
    return <img src={src} alt={alt} className="w-full h-full object-contain p-2 mix-blend-multiply" onError={()=>setErr(true)} />;
};