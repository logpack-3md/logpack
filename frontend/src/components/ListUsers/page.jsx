import React from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Inbox, 
  CheckCircle2, 
  XCircle,
  MoreHorizontal 
} from 'lucide-react';

// Importações do Shadcn/ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useUsers } from '@/hooks/useUsers';
import clsx from 'clsx';

const generatePaginationLinks = (currentPage, totalPages, setPage) => {
  const links = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    links.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => setPage(i)}
          isActive={i === currentPage}
          className="cursor-pointer"
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  if (startPage > 0) {
    links.unshift(
      <PaginationItem key="start-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }
  if (endPage < totalPages - 1) {
    links.push(
      <PaginationItem key="end-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  return links;
};

export function ListUsers() {
  const {
    users,
    loading,
    error,
    isUpdating,
    totalItems,
    currentPage,
    pageSize,
    setPage,
    setLimit,
    setStatus,
  } = useUsers();

  const totalPages = Math.ceil(totalItems / pageSize);
  const isActionDisabled = loading || isUpdating;

  // Funções de Navegação (Mantidas)
  const handlePrevious = () => {
    if (currentPage > 0) setPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setPage(currentPage + 1);
  };

  const handleSetStatus = (user) => {
    const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
    const userId = user.id || user._id;
    console.log(`Tentando mudar o status do usuário ${userId} para ${newStatus}`);
    setStatus(userId, newStatus);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10 animate-pulse">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p className="font-medium">Erro ao carregar a lista</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg bg-muted/5 text-muted-foreground">
        <Inbox className="w-12 h-12 mb-2 opacity-50" />
        <p className="font-medium">Nenhum usuário encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Container da Tabela com estilo de Card */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px] font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Email</TableHead>
              <TableHead className="font-semibold">Função</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => {
              const userId = user.id || user._id;
              const isUserActive = user.status === 'ativo';
              
              // Estilização customizada para o Badge
              const statusClasses = isUserActive
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";

              const buttonText = isUserActive ? "Inativar" : "Ativar";
              const buttonVariant = isUserActive ? "destructive" : "outline";

              return (
                <TableRow key={userId} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {userId.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {user.name || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {user.email || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{user.role || 'N/A'}</span>
                    </div>
                  </TableCell>

                  {/* Coluna Status */}
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={clsx("capitalize shadow-none border-0 font-medium", statusClasses)}
                    >
                      {isUserActive ? <CheckCircle2 size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                      {user.status || 'N/D'}
                    </Badge>
                  </TableCell>

                  {/* Coluna Ações */}
                  <TableCell className="text-right">
                    <Button
                      variant={buttonVariant}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => handleSetStatus(user)}
                      disabled={isActionDisabled}
                    >
                      {buttonText}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer: Paginação e Controle de Limite */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 py-2">
        
        <div className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{users.length}</span> de <span className="font-medium text-foreground">{totalItems}</span> registros.
        </div>

        <div className="flex items-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={clsx(
                    "cursor-pointer select-none", 
                    (currentPage === 0 || isActionDisabled) && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {generatePaginationLinks(currentPage, totalPages, setPage)}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={clsx(
                    "cursor-pointer select-none",
                    (currentPage >= totalPages - 1 || isActionDisabled) && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Seletor de Limite Estilizado */}
          <div className="relative">
             <select
              value={pageSize}
              onChange={(e) => setLimit(Number(e.target.value))}
              disabled={isActionDisabled}
              className="h-9 w-[110px] appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={10}>10 linhas</option>
              <option value={20}>20 linhas</option>
              <option value={50}>50 linhas</option>
            </select>
            {/* Ícone chevron para simular um select customizado */}
            <div className="pointer-events-none absolute right-3 top-2.5 opacity-50">
               <MoreHorizontal size={14} className="rotate-90"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}