"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api"; // Assume que você tem este arquivo de API

const USER_ENDPOINT = "admin"; // Endpoint base para gerenciamento de usuários

export function useUsers(initialData = [], initialPage = 0, initialPageSize = 10) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estado para indicar que uma ação específica (update) está em andamento
    const [isUpdating, setIsUpdating] = useState(false); 

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalItems, setTotalItems] = useState(0);

    const initialUsersArray =
        initialData && initialData.data && Array.isArray(initialData.data)
        ? initialData.data
        : Array.isArray(initialData)
        ? initialData
        : [];

    const [users, setUsers] = useState(initialUsersArray);
    const [hasInitialDataBeenProcessed, setHasInitialDataBeenProcessed] = useState(initialUsersArray.length > 0);

    const loadUsers = useCallback(
        async (pageIndex, size) => {
            setLoading(true);
            setError(null);

            try {
                const apiPage = pageIndex + 1;
                // Chamada usando a lib/api.js
                const result = await api.get(`${USER_ENDPOINT}?page=${apiPage}&limit=${size}`);

                // Tratamento de erro conforme a sua lib (result.success === false)
                if (result && result.success === false) {
                    setError(result.error || "Erro ao carregar lista de usuários.");
                    setUsers([]);
                    setTotalItems(0);
                    return;
                }

                const fetchedUsers = Array.isArray(result.data) ? result.data : [];
                setUsers(fetchedUsers);
                setTotalItems(result.totalItems || result.meta?.totalItems || 0);

                setCurrentPage(pageIndex);
                setPageSize(size);

            } catch (err) {
                console.error("Erro ao carregar usuários:", err);
                setError("Falha na comunicação com o servidor ao carregar usuários.");
                setUsers([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (!hasInitialDataBeenProcessed && users.length === 0) {
            loadUsers(currentPage, pageSize);
            setHasInitialDataBeenProcessed(true);
        }
    }, [hasInitialDataBeenProcessed, users.length, currentPage, pageSize, loadUsers]);

    const setPage = useCallback((pageIndex) => {
        if (pageIndex !== currentPage) {
            loadUsers(pageIndex, pageSize);
        }
    }, [currentPage, pageSize, loadUsers]);

    const setLimit = useCallback((newSize) => {
        if (newSize !== pageSize) {
            loadUsers(0, newSize);
        }
    }, [pageSize, loadUsers]);

    // --- FUNÇÃO PARA ATIVAR/INATIVAR (setStatus) ---
    const setStatus = useCallback(async (id, newStatus) => {
        setIsUpdating(true);
        let success = false;
        
        try {
            // Faz o PUT para o endpoint de status, enviando o novo status no corpo
            const result = await api.put(`${USER_ENDPOINT}/status/${id}`, { status: newStatus });

            // Verifica se a API retornou sucesso (sem o flag success: false)
            if (result && result.success !== false) {
                success = true;
                
                // Atualiza a lista localmente (Optimistic UI)
                setUsers((currentUsers) => 
                    currentUsers.map((user) => {
                        const currentUserId = user.id || user._id;
                        if (currentUserId === id) {
                            return { ...user, status: newStatus };
                        }
                        return user;
                    })
                );
            } else {
                // Trata erro e mostra Toast
                console.error("Erro ao mudar status:", result?.error);
                // Se você tiver acesso ao 'toast' do sonner aqui, use: 
                // toast.error(result?.error || "Erro desconhecido ao atualizar status.");
            }

        } catch (error) {
            console.error("Erro de rede:", error);
            // toast.error("Falha na conexão com o servidor.");
        } finally {
            setIsUpdating(false);
        }
        return success;
    }, []);

    // --- FUNÇÃO PARA EDITAR (editUser) ---
    const editUser = useCallback(async (id, data) => {
        setIsUpdating(true);
        let success = false;
        
        try {
            // Faz o PUT para o endpoint de atualização /admin/:id
            const result = await api.put(`${USER_ENDPOINT}/manage/${id}`, data); 

            if (result && result.success !== false) {
                success = true;
                
                // Atualiza a lista localmente (Optimistic UI)
                setUsers((currentUsers) => 
                    currentUsers.map((user) => {
                        const currentUserId = user.id || user._id;
                        if (currentUserId === id) {
                            // Aplica as novas alterações (name e role)
                            return { ...user, ...data }; 
                        }
                        return user;
                    })
                );
                // Exibe feedback de sucesso, se necessário
                // toast.success("Usuário atualizado com sucesso!");

            } else {
                console.error("Erro ao editar usuário:", result?.error);
                // toast.error(result?.error || "Erro ao atualizar usuário.");
            }

        } catch (error) {
            console.error("Erro de rede ao editar usuário:", error);
        } finally {
            setIsUpdating(false);
        }
        return success;
    }, []);

    return {
        users,
        loading,
        isUpdating,
        error,
        totalItems,
        currentPage,
        pageSize,
        setPage,
        setLimit,
        setStatus,
        editUser
    };
}