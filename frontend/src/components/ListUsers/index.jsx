'use client';
import React, { useState, useMemo } from 'react';
import {
    Loader2, AlertCircle, Inbox, CheckCircle2, XCircle, Pencil, Power, MoreHorizontal,
} from 'lucide-react';
// ... (Imports de UI mantidos iguais)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from 'clsx';

// Helpers e utilitários de formatação mantidos
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const generatePaginationLinks = (currentPage, totalPages, setPage) => {
    const links = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
        links.push(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => setPage(i)} isActive={i === currentPage} className="cursor-pointer">{i + 1}</PaginationLink>
            </PaginationItem>
        );
    }
    if (startPage > 0) links.unshift(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
    if (endPage < totalPages - 1) links.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
    return links;
};

// *** MUDANÇA APENAS AQUI NA ASSINATURA: recebe PROPS ***
export function ListUsers(props) {
    // Desestruturação das props vindas do pai (o Hook)
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
    } = props;

    // Estados locais de UI (modais) continuam aqui, idênticos.
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', role: '' });

    const availableRoles = useMemo(() => ['admin', 'manager', 'employee', 'buyer'], []);
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const isActionDisabled = loading || isUpdating;

    // Handlers mantidos IGUAIS para garantir funcionamento dos modais
    const handlePrevious = () => { if (currentPage > 0) setPage(currentPage - 1); };
    const handleNext = () => { if (currentPage < totalPages - 1) setPage(currentPage + 1); };

    const handleClickToggleStatus = (user) => { setUserToToggle(user); setIsDialogOpen(true); };
    
    const handleConfirmStatusChange = async () => {
        if (!userToToggle) return;
        const userId = userToToggle.id || userToToggle._id;
        const newStatus = userToToggle.status === 'ativo' ? 'inativo' : 'ativo';
        await setStatus(userId, newStatus); // Chama prop do pai
        setIsDialogOpen(false);
        setUserToToggle(null);
    };

    const handleEditClick = (user) => {
        const userId = user.id || user._id;
        setEditingUser({ id: userId, email: user.email, name: user.name, role: user.role });
        setEditFormData({ name: user.name || '', role: user.role || '' });
        setIsEditModalOpen(true);
    };
    
    const handleFormChange = (e) => { const { name, value } = e.target; setEditFormData(prev => ({ ...prev, [name]: value })); };
    const handleRoleChange = (value) => { setEditFormData(prev => ({ ...prev, role: value })); };
    
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingUser || isUpdating) return;
        const userId = editingUser.id;
        const updateData = {};
        if (editFormData.name !== editingUser.name && editFormData.name.trim() !== '') updateData.name = editFormData.name.trim();
        if (editFormData.role !== editingUser.role) updateData.role = editFormData.role;
        if (Object.keys(updateData).length === 0) { setIsEditModalOpen(false); return; }
        
        const success = await editUser(userId, updateData); // Chama prop do pai
        if (success) { setIsEditModalOpen(false); setEditingUser(null); }
    };

    // Renderização Condicional (Loading/Error) - Estilo Preservado
    if (loading && users.length === 0) return ( <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10 animate-pulse"><Loader2 className="w-10 h-10 text-primary animate-spin mb-4" /><p className="text-muted-foreground font-medium">Carregando usuários...</p></div> );
    if (error) return ( <div className="flex flex-col items-center justify-center h-64 border rounded-lg border-red-200 bg-red-50 text-red-700"><AlertCircle className="w-10 h-10 mb-2" /><p className="font-medium">Erro ao carregar a lista</p><p className="text-sm opacity-80">{error}</p></div> );
    if (users.length === 0 && !loading) return ( <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg bg-muted/5 text-muted-foreground"><Inbox className="w-12 h-12 mb-2 opacity-50" /><p className="font-medium">Nenhum usuário encontrado.</p></div> );

    // Renderização Principal - Layout IDÊNTICO
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px] font-semibold hidden sm:table-cell">ID</TableHead>
                            <TableHead className="font-semibold min-w-[120px]">Nome</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">Email</TableHead>
                            <TableHead className="font-semibold whitespace-nowrap">Função</TableHead>
                            <TableHead className="font-semibold text-center whitespace-nowrap">Status</TableHead>
                            <TableHead className="text-right font-semibold min-w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.map((user) => {
                            const userId = user.id || user._id;
                            const isUserActive = user.status === 'ativo';
                            const statusClasses = isUserActive ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
                            const iconClass = isUserActive ? "text-green-600 hover:text-green-700" : "text-red-500 hover:text-red-600";
                            const StatusIcon = Power;

                            return (
                                <TableRow key={userId} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs text-muted-foreground hidden sm:table-cell">{userId.substring(0, 8)}...</TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        <div className="flex flex-col"><span>{user.name || 'N/A'}</span><span className="md:hidden text-xs text-muted-foreground font-normal">{user.email}</span></div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{user.email || 'N/A'}</TableCell>
                                    <TableCell className="whitespace-nowrap"><span className="font-medium">{capitalize(user.role) || 'N/A'}</span></TableCell>
                                    <TableCell className="text-center whitespace-nowrap">
                                        <Badge variant="outline" className={clsx("capitalize shadow-none border-0 font-medium", statusClasses)}>
                                            {isUserActive ? <CheckCircle2 size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                                            {user.status || 'N/D'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/80 hover:text-primary transition-colors" onClick={() => handleEditClick(user)} disabled={isActionDisabled}><Pencil size={16} /></Button>
                                            <Button variant="ghost" size="icon" className={clsx("h-8 w-8", iconClass)} onClick={() => handleClickToggleStatus(user)} disabled={isActionDisabled}><StatusIcon size={18} /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Footer de Paginação IDÊNTICO */}
            <div className="flex flex-col gap-4 sm:flex-row justify-between items-center py-2">
                <div className="text-sm text-muted-foreground text-center sm:text-left order-2 sm:order-1">Mostrando <span className="font-medium text-foreground">{users.length}</span> de <span className="font-medium text-foreground">{totalItems}</span> registros.</div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
                    <Pagination className="justify-center"><PaginationContent><PaginationItem><PaginationPrevious onClick={handlePrevious} className={clsx("cursor-pointer select-none", (currentPage === 0 || isActionDisabled) && "pointer-events-none opacity-50")} /></PaginationItem>{generatePaginationLinks(currentPage, totalPages, setPage)}<PaginationItem><PaginationNext onClick={handleNext} className={clsx("cursor-pointer select-none", (currentPage >= totalPages - 1 || isActionDisabled) && "pointer-events-none opacity-50")} /></PaginationItem></PaginationContent></Pagination>
                    <div className="relative flex justify-center w-full sm:w-auto">
                        <select value={pageSize} onChange={(e) => setLimit(Number(e.target.value))} disabled={isActionDisabled} className="h-9 w-full sm:w-[110px] appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option value={10}>10 linhas</option><option value={20}>20 linhas</option><option value={50}>50 linhas</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 sm:right-3 top-2.5 opacity-50"><MoreHorizontal size={14} className="rotate-90" /></div>
                    </div>
                </div>
            </div>

            {/* Modais continuam iguais */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="w-[95%] max-w-lg rounded-lg">
                    <AlertDialogHeader><AlertDialogTitle>{userToToggle?.status === 'ativo' ? 'Inativar Usuário?' : 'Ativar Usuário?'}</AlertDialogTitle><AlertDialogDescription>Você tem certeza que deseja<span className="font-bold"> {userToToggle?.status === 'ativo' ? 'inativar' : 'ativar'} </span>o acesso?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleConfirmStatusChange} disabled={isUpdating} className={clsx(userToToggle?.status === 'ativo' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "")}>{isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar"}</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="w-[95%] sm:max-w-[425px] rounded-lg">
                    <DialogHeader><DialogTitle>Editar Usuário</DialogTitle><DialogDescription>Edite o nome e função.</DialogDescription></DialogHeader>
                    <form onSubmit={handleSaveEdit}>
                        <div className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Nome</Label><Input name="name" value={editFormData.name} onChange={handleFormChange} className="col-span-3" /></div>
                             <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Função</Label><Select value={editFormData.role} onValueChange={handleRoleChange}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent>{availableRoles.map(r=><SelectItem key={r} value={r}>{capitalize(r)}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2"><Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button><Button type="submit">{isUpdating ? <Loader2 className="animate-spin h-4 w-4"/> : "Salvar"}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}