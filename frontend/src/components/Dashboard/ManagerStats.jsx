"use client";

import React from 'react';
import { Package, Layers, FileText, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManagerStats({ stats, loading }) {
    const items = [
        {
            title: "Insumos",
            value: stats.totalInsumos,
            icon: Package,
            desc: "Catálogo total",
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
        },
        {
            title: "Setores",
            value: stats.totalSetores,
            icon: Layers,
            desc: "Áreas ativas",
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800"
        },
        {
            title: "Pedidos",
            value: stats.totalPedidos,
            icon: ShoppingCart,
            desc: "Solicitações",
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800"
        },
        {
            title: "Orçamentos",
            value: stats.totalOrcamentos,
            icon: FileText,
            desc: "Cotações",
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"
        }
    ];

    // Layout base: grid-cols-2 (Visual 2x2 no mobile e tablet)
    // Desktop Grande (lg): grid-cols-4 (Visual 1x4 esticado)
    const gridClass = "grid grid-cols-2 gap-4 lg:gap-6 lg:grid-cols-4";

    if (loading) {
        return (
            <div className={gridClass}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className={gridClass}>
            {items.map((item, index) => (
                <Card key={index} className="border border-border shadow-xs hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {item.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg border ${item.bg}`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                        <div className="text-2xl font-bold text-foreground leading-none">
                            {item.value}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5 truncate">
                            {item.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}