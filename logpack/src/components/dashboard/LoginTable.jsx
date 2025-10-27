"use client";

import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/dashboard/input";
import { Button } from "@/components/dashboard/button";
import { Badge } from "@/components/dashboard/badge";
import { Card } from "@/components/dashboard/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/table";
import { ArrowUpDown, Search } from "lucide-react";

// Dados simulados
const generateMockLogins = () => {
  return Array.from({ length: 50 }, (_, i) => {
    const statuses = ["Sucesso", "Falha", "Bloqueado"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const loginTime = new Date(now);
    loginTime.setDate(loginTime.getDate() - randomDaysAgo);
    loginTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    return {
      id: `login-${i + 1}`,
      user: `usuario${i + 1}@exemplo.com`,
      timestamp: loginTime.toISOString(),
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      status,
      device: ["Desktop", "Mobile", "Tablet"][Math.floor(Math.random() * 3)],
    };
  });
};

export function LoginTable() {
  const [data] = useState(generateMockLogins);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("todos");

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (dateFilter !== "todos") {
      const now = new Date();
      let cutoff = new Date();

      if (dateFilter === "hoje") {
        cutoff.setHours(0, 0, 0, 0);
      } else if (dateFilter === "7dias") {
        cutoff.setDate(now.getDate() - 7);
      } else if (dateFilter === "30dias") {
        cutoff.setDate(now.getDate() - 30);
      }

      filtered = filtered.filter((login) => new Date(login.timestamp) >= cutoff);
    }

    return filtered;
  }, [data, dateFilter]);

  // COLUNAS SEM TIPOS (compatível com .jsx)
  const columns = [
    {
      accessorKey: "user",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left"
        >
          Usuário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left"
        >
          Data/Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.timestamp);
        return (
          <div className="text-sm">
            {format(date, "dd MMM yyyy, HH:mm", { locale: ptBR })}
          </div>
        );
      },
    },
    {
      accessorKey: "ip",
      header: "IP",
    },
    {
      accessorKey: "device",
      header: "Dispositivo",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "Sucesso"
                ? "default"
                : status === "Falha"
                ? "destructive"
                : "secondary"
            }
            className="text-xs"
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Card className="border-0 shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por usuário ou IP..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os logins</SelectItem>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    Nenhum login encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Mostrando {table.getState().pagination.pageIndex * 10 + 1} a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * 10,
              filteredData.length
            )}{" "}
            de {filteredData.length} resultados
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}