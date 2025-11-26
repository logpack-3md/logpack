import React, { useState } from 'react';
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

// --- IMPORTAÇÕES NOVAS PARA O MODAL DE CONFIRMAÇÃO ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  // --- NOVOS ESTADOS PARA CONTROLAR O MODAL ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const totalPages = Math.ceil(totalItems / pageSize);
  const isActionDisabled = loading || isUpdating;
  const handlePrevious = () => {
    if (currentPage > 0) setPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setPage(currentPage + 1);
  };

  // 1. Ao clicar no botão da tabela, apenas abrimos o modal e salvamos o usuário
  const handleClickToggleStatus = (user) => {
    setUserToToggle(user);
    setIsDialogOpen(true);
  };

  // 2. Esta função é chamada quando o usuário clica em "Continuar" no modal
  const handleConfirmStatusChange = async () => {
    if (!userToToggle) return;
    const userId = userToToggle.id || userToToggle._id;
    const newStatus = userToToggle.status === 'ativo' ? 'inativo' : 'ativo';

    console.log(`Confirmado: Mudando status do usuário ${userId} para ${newStatus}`);

    await setStatus(userId, newStatus);
    setIsDialogOpen(false);
    setUserToToggle(null);
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
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px] font-semibold hidden sm:table-cell">ID</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Nome</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Email</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Função</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const userId = user.id || user._id;
                const isUserActive = user.status === 'ativo';
                const statusClasses = isUserActive
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
                const buttonText = isUserActive ? "Inativar" : "Ativar";
                const buttonVariant = isUserActive ? "destructive" : "outline";

                return (
                  <TableRow key={userId} className="hover:bg-muted/30 transition-colors">

                    {/* ID Cell */}
                    <TableCell className="font-mono text-xs text-muted-foreground hidden sm:table-cell">
                      {userId.substring(0, 8)}...
                    </TableCell>

                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col">
                        <span>{user.name || 'N/A'}</span>
                        <span className="md:hidden text-xs text-muted-foreground font-normal">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* Email Cell */}
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {user.email || 'N/A'}
                    </TableCell>

                    {/* Role Cell */}
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{user.role || 'N/A'}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className={clsx("capitalize shadow-none border-0 font-medium whitespace-nowrap", statusClasses)}>
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
                        onClick={() => handleClickToggleStatus(user)}
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
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">

        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Mostrando <span className="font-medium text-foreground">{users.length}</span> de <span className="font-medium text-foreground">{totalItems}</span> registros.
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center">
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

              <div className="hidden xs:flex">
                {generatePaginationLinks(currentPage, totalPages, setPage)}
              </div>

              <div className="xs:hidden text-sm flex items-center px-2">
                Pág {currentPage + 1}
              </div>

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
            <div className="pointer-events-none absolute right-3 top-2.5 opacity-50">
              <MoreHorizontal size={14} className="rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* --- COMPONENTE DE CONFIRMAÇÃO --- */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[95%] max-w-lg rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggle?.status === 'ativo' ? 'Inativar Usuário?' : 'Ativar Usuário?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja
              <span className="font-bold"> {userToToggle?.status === 'ativo' ? 'inativar' : 'ativar'} </span>
              o acesso de <span className="font-semibold text-foreground">{userToToggle?.name}</span>?
              {userToToggle?.status === 'ativo' && (
                <span className="block mt-2 text-red-500">
                  O usuário perderá acesso ao sistema imediatamente.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel disabled={isUpdating} className="mt-2 sm:mt-0">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              disabled={isUpdating}
              className={clsx(
                userToToggle?.status === 'ativo'
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              )}
            >
              {isUpdating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando</>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}