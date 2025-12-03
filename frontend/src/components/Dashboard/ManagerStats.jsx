import React from 'react';
import { Package, Layers, FileText, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManagerStats({ stats, loading }) {
    const items = [
        {
            title: "Insumos Cadastrados",
            value: stats.totalInsumos,
            icon: Package,
            desc: "Itens no catálogo",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Setores Operantes",
            value: stats.totalSetores,
            icon: Layers,
            desc: "Todos os setores",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "Pedidos Realizados",
            value: stats.totalPedidos,
            icon: ShoppingCart,
            desc: "Histórico total",
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Orçamentos Gerados",
            value: stats.totalOrcamentos,
            icon: FileText,
            desc: "Cotações do comprador",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
                <Card key={index} className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {item.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${item.bg}`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{item.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {item.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}