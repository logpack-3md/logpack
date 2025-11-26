'use client';
import React, { useState, useMemo } from 'react';
import { 
    Loader2, 
    AlertCircle, 
    Inbox, 
    CheckCircle2, 
    XCircle,
    MoreHorizontal,
    Pencil, 
    Power,
} from 'lucide-react';

// Importações do Shadcn/ui (todas as necessárias)
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { useUsers } from '@/hooks/useUsers';
import clsx from 'clsx';

// FUNÇÃO EXISTENTE: Capitaliza apenas a primeira letra de uma string.
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

// Lógica de paginação
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
        editUser,
    } = useUsers();

    // --- ESTADOS PARA O MODAL DE STATUS (AlertDialog) ---
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);

    // --- ESTADOS PARA O MODAL DE EDIÇÃO (Dialog) ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', role: '' });
    
    // Roles permitidas (ajuste conforme seu backend espera)
    const availableRoles = useMemo(() => ['admin', 'manager', 'employee', 'buyer'], []);

    const totalPages = Math.ceil(totalItems / pageSize);
    const isActionDisabled = loading || isUpdating;

    // Funções de Navegação (omitidas)
    const handlePrevious = () => {
        if (currentPage > 0) setPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setPage(currentPage + 1);
    };

    // --- LÓGICA DE STATUS (ATIVAR/INATIVAR) ---
    const handleClickToggleStatus = (user) => {
        setUserToToggle(user);
        setIsDialogOpen(true);
    };

    const handleConfirmStatusChange = async () => {
        if (!userToToggle) return;
        const userId = userToToggle.id || userToToggle._id;
        const newStatus = userToToggle.status === 'ativo' ? 'inativo' : 'ativo';
        await setStatus(userId, newStatus);
        setIsDialogOpen(false);
        setUserToToggle(null);
    };
    
    // --- LÓGICA DE EDIÇÃO (NOME/FUNÇÃO) ---

    const handleEditClick = (user) => {
        const userId = user.id || user._id;
        // Salva dados essenciais e preenche o formulário com dados atuais
        setEditingUser({ 
            id: userId, 
            email: user.email,
            name: user.name, // Guarda o original para checagem de mudança
            role: user.role  // Guarda o original para checagem de mudança
        }); 
        setEditFormData({ name: user.name || '', role: user.role || '' }); 
        setIsEditModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setEditFormData(prev => ({ ...prev, role: value }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingUser || isUpdating) return;

        const userId = editingUser.id;
        
        // Constrói o objeto de dados APENAS com o que mudou
        const updateData = {};
        
        // CORREÇÃO: Verifica se o nome mudou E se não está vazio
        if (editFormData.name !== editingUser.name && editFormData.name.trim() !== '') {
            updateData.name = editFormData.name.trim();
        }
        
        // CORREÇÃO: Verifica se a função mudou (sem checagem de trim(), pois é um Select)
        if (editFormData.role !== editingUser.role) {
            updateData.role = editFormData.role;
        }
        
        // Se nada mudou, fecha e sai.
        if (Object.keys(updateData).length === 0) {
            setIsEditModalOpen(false);
            return;
        }

        // Verifica se o formulário está válido antes de chamar o backend
        if (editFormData.name.trim() === '' || editFormData.role.trim() === '') {
            // Este caso deve ser evitado pelo disabled do botão, mas é uma checagem de segurança.
            console.error("Nome ou Função não podem ser vazios.");
            return;
        }

        const success = await editUser(userId, updateData);

        if (success) {
            setIsEditModalOpen(false);
            setEditingUser(null);
        } 
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
            {/* Container da Tabela */}
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
                            
                            const statusClasses = isUserActive
                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";

                            // Lógica de ícone e cor para o botão de status
                            const StatusIcon = Power; 
                            const iconClass = isUserActive 
                                ? "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300" 
                                : "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300";
                            const iconTitle = isUserActive ? "Inativar Acesso" : "Ativar Acesso";


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
                                            {/* Capitalização da Role */}
                                            <span className="font-medium">{capitalize(user.role) || 'N/A'}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge 
                                            variant="outline" 
                                            className={clsx("capitalize shadow-none border-0 font-medium", statusClasses)}
                                        >
                                            {isUserActive ? <CheckCircle2 size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                                            {user.status || 'N/D'}
                                        </Badge>
                                    </TableCell>

                                    {/* Coluna Ações com dois botões */}
                                    <TableCell className="text-right flex items-center justify-end space-x-2">
                                        
                                        {/* BOTÃO DE EDIÇÃO (LÁPIS) */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-primary/80 hover:text-primary transition-colors"
                                            onClick={() => handleEditClick(user)}
                                            disabled={isActionDisabled}
                                            title="Editar Nome e Função"
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        {/* BOTÃO DE STATUS COM ÍCONE */}
                                        <Button
                                            variant="ghost" 
                                            size="icon"
                                            className={clsx("h-8 w-8", iconClass)} 
                                            onClick={() => handleClickToggleStatus(user)}
                                            disabled={isActionDisabled}
                                            title={iconTitle}
                                        >
                                            <StatusIcon size={18} />
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
                            <MoreHorizontal size={14} className="rotate-90"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL DE CONFIRMAÇÃO DE STATUS (EXISTENTE) --- */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
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
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
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
            
            {/* --- MODAL DE EDIÇÃO DE USUÁRIO (FORMULÁRIO) --- */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Edite o nome e a função de {editingUser?.email} ({editingUser?.name}).
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nome
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleFormChange}
                                    className="col-span-3"
                                    disabled={isUpdating}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                    Função
                                </Label>
                                <Select 
                                    value={editFormData.role} 
                                    onValueChange={handleRoleChange} 
                                    disabled={isUpdating}
                                >
                                    <SelectTrigger className="col-span-3">
                                        {/* Exibe o valor selecionado capitalizado */}
                                        <SelectValue placeholder="Selecione a função">
                                            {capitalize(editFormData.role) || "Selecione a função"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map(role => (
                                            <SelectItem key={role} value={role}>
                                                {/* Aplicando capitalize() */}
                                                {capitalize(role)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditModalOpen(false)} 
                                disabled={isUpdating}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                // O botão é desabilitado se estiver atualizando OU se nome/função estiverem vazios.
                                disabled={isUpdating || !editFormData.name.trim() || !editFormData.role.trim()} 
                            >
                                {isUpdating ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando</>
                                ) : (
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}