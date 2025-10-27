"use client";

import React from "react";
// Importa o hook que criamos
import { useUsers } from "@/hooks/useUsers"; // <-- Ajuste este caminho para onde seu hook está
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// O componente agora recebe os dados iniciais carregados pelo Server Component
export function ListUser({ 
  initialUsers = [], 
  initialTotalItems = 0, 
  initialPageIndex = 0, 
  initialPageSize = 10 
}) {
  
  // 1. Usa o hook com os dados iniciais
  const {
    users,
    loading,
    error,
    totalItems: hookTotalItems, // total de itens vindo do hook
    currentPage, // 0-based (índice da página)
    pageSize,
    setPage,     // (pageIndex: number) => void
    setLimit,    // (limit: number) => void
  } = useUsers(
    initialUsers, 
    initialPageIndex, 
    initialPageSize
  );

  // 2. Lógica para total de itens
  // O hook pode começar com totalItems = 0 se os dados iniciais forem passados.
  // Usamos o valor do server prop até que o hook atualize (após um fetch).
  const totalItems = hookTotalItems > 0 ? hookTotalItems : initialTotalItems;

  // 3. Calcula o total de páginas com base nos dados do hook/API
  const totalPages = Math.ceil(totalItems / pageSize);

  // 4. Removemos toda a lógica de state local (useState) e .slice()
  // 'users' já é a lista correta para a página atual.

  // 5. Funções de handler agora chamam o hook
  // O hook 'setPage' espera um índice 0-based
  const handlePageChange = (pageIndex) => {
    setPage(pageIndex);
  };

  const handleItemsPerPageChange = (value) => {
    setLimit(Number(value));
    // setLimit já reseta a página para 0 dentro do hook
  };

  // 6. Atualiza a geração de paginação para usar o estado do hook (0-based)
  const generatePaginationItems = () => {
    const items = [];
    const displayPage = currentPage + 1; // Página 1-based para exibição

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={displayPage === i}
              onClick={() => handlePageChange(i - 1)} // Passa índice 0-based
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (displayPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={displayPage === i}
                onClick={() => handlePageChange(i - 1)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(<PaginationEllipsis key="ellipsis-start" />);
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => handlePageChange(totalPages - 1)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (displayPage > totalPages - 4) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => handlePageChange(0)}>1</PaginationLink>
          </PaginationItem>
        );
        items.push(<PaginationEllipsis key="ellipsis-end" />);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={displayPage === i}
                onClick={() => handlePageChange(i - 1)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => handlePageChange(0)}>1</PaginationLink>
          </PaginationItem>
        );
        items.push(<PaginationEllipsis key="ellipsis-start" />);
        for (let i = displayPage - 1; i <= displayPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={displayPage === i}
                onClick={() => handlePageChange(i - 1)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(<PaginationEllipsis key="ellipsis-end" />);
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => handlePageChange(totalPages - 1)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 7. Adiciona estados de loading, error e vazio */}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
            {/* 8. Renderiza 'users' diretamente do hook */}
            {!loading && !error && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Linhas por página</p>
          {/* 9. Conecta o Select ao 'pageSize' e 'setLimit' do hook */}
          <Select
            value={String(pageSize)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 10. Conecta os botões de Paginação ao hook */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                // Desabilita se estiver na página 0
                className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {generatePaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                // Desabilita se a próxima página for >= totalPages
                className={currentPage + 1 >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}