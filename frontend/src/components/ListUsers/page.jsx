// Importando o hook useUsers (ajustado o caminho relativo)
import React from 'react';

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

// Função auxiliar para gerar os links de página
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
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Adicionar reticências se necessário
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
  // Chamando o hook e obtendo as funções e estados
  const {
    users,
    loading,
    error,
    isUpdating, // Novo estado
    totalItems,
    currentPage, 
    pageSize,
    setPage,
    setLimit,
    setStatus, // Nova função
  } = useUsers(); 

  const totalPages = Math.ceil(totalItems / pageSize);
  const isActionDisabled = loading || isUpdating;

  // Funções de Navegação
  const handlePrevious = () => {
    if (currentPage > 0) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setPage(currentPage + 1);
    }
  };

  // Função para setar o status do usuário
  const handleSetStatus = (user) => {
    const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
    const userId = user.id || user._id; // Garantindo que pegamos o ID correto

    // Nota: Como não usamos window.confirm, a ação é imediata. 
    // Em produção, você DEVE usar um modal de confirmação.
    console.log(`Tentando mudar o status do usuário ${userId} para ${newStatus}`);
    setStatus(userId, newStatus);
  };
  
  // Renderização condicional para estado de carregamento/erro
  if (loading && users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 inline-block"></div>
        <p className="mt-2 text-sm text-gray-600">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Erro ao carregar a lista: {error}</p>
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum usuário encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead> {/* Nova Coluna */}
            <TableHead className="text-right">Ações</TableHead> {/* Nova Coluna */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const userId = user.id || user._id;
            const isUserActive = user.status === 'ativo';
            const statusVariant = isUserActive ? "default" : "secondary";
            const buttonText = isUserActive ? "Inativar" : "Ativar";
            const buttonVariant = isUserActive ? "destructive" : "default";

            return (
              <TableRow key={userId}>
                <TableCell className="font-medium">{userId.substring(0, 8)}...</TableCell>
                <TableCell>{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>{user.role || 'N/A'}</TableCell>
                
                {/* Coluna Status */}
                <TableCell>
                  <Badge variant={statusVariant}>{user.status || 'N/D'}</Badge>
                </TableCell>

                {/* Coluna Ações (Botão de Status) */}
                <TableCell className="text-right">
                  <Button 
                    variant={buttonVariant} 
                    size="sm"
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

      {/* Paginação e Controle de Limite */}
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando {users.length} de {totalItems} itens. (Página {currentPage + 1} de {totalPages})
        </div>

        <Pagination>
          <PaginationContent>
            {/* Botão Anterior */}
            <PaginationItem>
              <PaginationPrevious 
                onClick={handlePrevious}
                className={currentPage === 0 || isActionDisabled ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={currentPage === 0 || isActionDisabled}
              />
            </PaginationItem>
            
            {/* Links das Páginas */}
            {generatePaginationLinks(currentPage, totalPages, setPage)}

            {/* Botão Próximo */}
            <PaginationItem>
              <PaginationNext 
                onClick={handleNext} 
                className={currentPage >= totalPages - 1 || isActionDisabled ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={currentPage >= totalPages - 1 || isActionDisabled}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Seletor de Limite/PageSize */}
        <select
          value={pageSize}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-2 py-1 border rounded text-sm"
          disabled={isActionDisabled}
        >
          <option value={10}>10 por pág.</option>
          <option value={20}>20 por pág.</option>
          <option value={50}>50 por pág.</option>
        </select>
      </div>
    </div>
  )
}