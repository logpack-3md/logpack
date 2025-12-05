import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, History } from 'lucide-react'; // ← ADICIONE AQUI O HISTORY

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from 'clsx';

export default function BuyerLogsTable({ logs, loading, pagination, onPageChange, onLimitChange }) {
    if (loading) {
        return (
            <div className="p-6 space-y-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <History className="w-12 h-12 mb-3 opacity-30" /> {/* ← Agora funciona! */}
                <p className="text-lg font-medium">Nenhum registro encontrado</p>
                <p className="text-sm">Você ainda não realizou nenhuma ação.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-auto flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-40">Data/Hora</TableHead>
                            <TableHead className="w-32">Tipo</TableHead>
                            <TableHead className="w-28">Ação</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs font-medium">
                                    {format(new Date(log.timestamps), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </TableCell>
                                <TableCell>
                                    <span className={clsx(
                                        "px-2.5 py-1 text-xs rounded-full font-medium",
                                        log.entidade === 'orcamento'
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        {log.entidade === 'orcamento' ? 'Orçamento' : 'Compra'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={clsx(
                                        "px-2.5 py-1 text-xs rounded-full font-medium",
                                        log.actionType === 'INSERT'
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                    )}>
                                        {log.actionType === 'INSERT' ? 'Criado' : 'Editado'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {log.contextDetails || 'Alteração nos dados'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/10 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Linhas:</span>
                    <Select value={pagination.limit.toString()} onValueChange={onLimitChange}>
                        <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={pagination.page <= 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-3 text-muted-foreground">
                        {pagination.page} / {pagination.totalPages || 1}
                    </span>
                    <Button variant="outline" size="icon" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onPageChange(pagination.totalPages)} disabled={pagination.page >= pagination.totalPages}>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}