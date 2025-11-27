"use client";

import React from 'react';
import {
    Loader2,
    MoreHorizontal,
    FileText,
    DollarSign,
    ArrowLeftRight,
    Ban,
    Inbox,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

// Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBuyerOperations } from '@/hooks/useBuyerOperations';
// --- Utilitários Locais ---
const formatCurrency = (val) => {
    if (val === null || val === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const StatusBadge = ({ status }) => {
    const config = {
        pendente: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Pendente", icon: Inbox },
        fase_de_orcamento: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Em Orçamento", icon: FileText },
        renegociacao: { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Renegociação", icon: ArrowLeftRight },
        aprovado_gerente: { color: "bg-green-100 text-green-700 border-green-200", label: "Aprovado", icon: CheckCircle2 },
        cancelado: { color: "bg-red-100 text-red-700 border-red-200", label: "Cancelado", icon: XCircle },
    };
    
    const curr = config[status] || { color: "bg-gray-100 text-gray-700", label: status, icon: AlertCircle };
    const Icon = curr.icon;

    return (
        <Badge variant="outline" className={clsx("gap-1.5 px-2.5 py-0.5", curr.color)}>
            <Icon size={14} />
            {curr.label}
        </Badge>
    );
};



// Adicionado valor padrão [] para compras na desestruturação
export default function ListCompras({ compras = [], loading = false, onAction }) {
    // Garante que listaCompras seja sempre um array, mesmo se a prop vier nula
    const listaCompras = Array.isArray(compras) ? compras : [];

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-blue-600"/> Solicitações Recebidas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pedido</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex items-center justify-center w-full h-full text-slate-500">
                                        <Loader2 className="animate-spin h-6 w-6 mr-2 text-blue-600"/> Carregando...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : listaCompras.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            listaCompras.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium text-slate-700">
                                        {item.pedidoId || `ID: ${item.id}`}
                                    </TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-center">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-slate-600">
                                        {formatCurrency(item.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        
                                        {/* Botão Principal: Orçar (apenas se pendente) */}
                                        {item.status === 'pendente' && (
                                            <Button 
                                                size="sm" 
                                                className="bg-blue-600 hover:bg-blue-700 h-8 text-xs" 
                                                onClick={() => onAction && onAction('create', item)}
                                            >
                                                <DollarSign className="mr-1.5 h-3.5 w-3.5" /> Orçar
                                            </Button>
                                        )}

                                        {/* Botão Principal: Renegociar */}
                                        {item.status === 'renegociacao' && (
                                            <Button 
                                                size="sm" 
                                                className="bg-purple-600 hover:bg-purple-700 h-8 text-xs" 
                                                onClick={() => onAction && onAction('renegotiate', item)}
                                            >
                                                <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" /> Renegociar
                                            </Button>
                                        )}

                                        {/* Opções Extras para itens já orçados */}
                                        {['fase_de_orcamento', 'renegociacao'].includes(item.status) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 text-slate-400 hover:text-slate-700">
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Opções do Orçamento</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => onAction && onAction('edit_desc', item)}>
                                                        <FileText className="mr-2 h-4 w-4" /> Editar Descrição
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onAction && onAction('cancel', item)}>
                                                        <Ban className="mr-2 h-4 w-4" /> Cancelar Orçamento
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}