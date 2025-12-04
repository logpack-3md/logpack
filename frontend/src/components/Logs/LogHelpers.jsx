"use client";

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Activity, Info } from "lucide-react";
import clsx from 'clsx';

export const formatDateLog = (dateString) => {
    if (!dateString) return '-';
    try {
        // backend envia "timestamps"
        return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch { return dateString; }
};

export const ActionBadge = ({ action }) => {
    const act = (action || '').toUpperCase();
    
    let style = "bg-slate-100 text-slate-600 border-slate-200";
    let Icon = Activity;
    let label = act || "AÇÃO";

    if (act === 'INSERT' || act === 'CREATE') {
        style = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
        Icon = PlusCircle;
        label = "CRIAÇÃO";
    } else if (act === 'UPDATE') {
        style = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
        Icon = Edit;
        label = "EDIÇÃO";
    } else if (act === 'DELETE') {
        style = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400";
        Icon = Trash2;
        label = "EXCLUSÃO";
    } else if (act === 'INFO') {
         style = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
         Icon = Info;
         label = "INFO";
    }

    return (
        <Badge variant="outline" className={clsx("gap-1.5 py-0.5 px-2.5 shadow-none border font-medium", style)}>
            <Icon size={12} />
            <span>{label}</span>
        </Badge>
    );
};