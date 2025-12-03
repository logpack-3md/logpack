"use client";

import React from 'react';
import { ArrowLeftRight, Ban, DollarSign, PackageOpen, CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formatCurrency = (val) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val) : '---';
const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function ListOrcamentos({ itens = [], loading, onRenegociar, onCancelar }) {
    if (loading) return <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    if (itens.length === 0) return <div className="text-center py-16 text-muted-foreground text-lg">Nenhum orçamento encontrado nesta aba.</div>;

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-32">Data</TableHead>
                        <TableHead>Insumo</TableHead>
                        <TableHead className="text-center">Qtd.</TableHead>
                        <TableHead className="text-right">Valor Orçado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {itens.map((item) => {
                        const orc = item.orcamento?.[0] || item.orcamento;
                        return (
                            <TableRow key={item.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                        {formatDate(item.createdAt)}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <PackageOpen className="h-4 w-4 text-muted-foreground" />
                                        {orc?.description || item.description || "Sem descrição"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{item.amount} unid.</TableCell>
                                <TableCell className="text-right font-semibold text-emerald-600">
                                    {orc?.valor_total ? formatCurrency(orc.valor_total) : '---'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {(item.status === "fase_de_orcamento" || item.status === "renegociacao") && (
                                            <Button size="sm" onClick={() => onRenegociar(item)}>
                                                <ArrowLeftRight className="h-4 w-4 mr-1" /> Renegociar
                                            </Button>
                                        )}
                                        {item.status !== "cancelado" && (
                                            <Button size="sm" variant="destructive" onClick={() => onCancelar(item)}>
                                                <Ban className="h-4 w-4 mr-1" /> Cancelar
                                            </Button>
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