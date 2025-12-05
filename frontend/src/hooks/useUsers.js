"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner"; 

const USER_ENDPOINT = "admin";

export function useUsers(initialData = [], initialPage = 0, initialPageSize = 10) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); 

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalItems, setTotalItems] = useState(0);

    const [users, setUsers] = useState([]);
    const [hasInitialDataBeenProcessed, setHasInitialDataBeenProcessed] = useState(false);

    const loadUsers = useCallback(
        async (pageIndex, size) => {
            setLoading(true);
            setError(null);

            try {
                const apiPage = pageIndex + 1;
                const result = await api.get(`${USER_ENDPOINT}?page=${apiPage}&limit=${size}`);

                if (result && result.success === false) {
                    if (result.status !== 404) {
                        toast.error("Erro ao carregar", { description: result.error });
                    }
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
                console.error("Erro loading:", err);
                toast.error("Falha de conexão", { description: "Não foi possível buscar a lista de usuários." });
                setUsers([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (!hasInitialDataBeenProcessed) {
            loadUsers(currentPage, pageSize);
            setHasInitialDataBeenProcessed(true);
        }
    }, [hasInitialDataBeenProcessed, currentPage, pageSize, loadUsers]);

    // NOVA FUNÇÃO DE REFRESH
    const refresh = useCallback(() => {
        loadUsers(currentPage, pageSize);
    }, [currentPage, pageSize, loadUsers]);

    const setPage = useCallback((pageIndex) => {
        if (pageIndex !== currentPage) loadUsers(pageIndex, pageSize);
    }, [currentPage, pageSize, loadUsers]);

    const setLimit = useCallback((newSize) => {
        if (newSize !== pageSize) loadUsers(0, newSize);
    }, [pageSize, loadUsers]);

    const setStatus = useCallback(async (id, newStatus) => {
        setIsUpdating(true);
        let success = false;
        const toastId = toast.loading(`Alterando status para ${newStatus}...`);

        try {
            const result = await api.put(`${USER_ENDPOINT}/status/${id}`, { status: newStatus });
            if (result && result.success !== false) {
                success = true;
                setUsers((currentUsers) => 
                    currentUsers.map((user) => {
                        const currentUserId = user.id || user._id;
                        if (currentUserId === id) return { ...user, status: newStatus };
                        return user;
                    })
                );
                toast.success(`Status atualizado!`, { id: toastId, description: `O usuário agora está ${newStatus.toUpperCase()}.` });
            } else {
                toast.error("Não foi possível alterar", { id: toastId, description: result?.error || "Erro desconhecido." });
            }
        } catch (error) {
            toast.error("Erro de conexão", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
        return success;
    }, []);

    const editUser = useCallback(async (id, data) => {
        setIsUpdating(true);
        let success = false;
        const toastId = toast.loading("Salvando alterações...");
        
        try {
            const result = await api.put(`${USER_ENDPOINT}/manage/${id}`, data); 
            if (result && result.success !== false) {
                success = true;
                setUsers((currentUsers) => 
                    currentUsers.map((user) => {
                        const currentUserId = user.id || user._id;
                        if (currentUserId === id) return { ...user, ...data }; 
                        return user;
                    })
                );
                toast.success("Usuário atualizado!", { id: toastId });
            } else {
                toast.error("Falha ao salvar", { id: toastId, description: result?.error });
            }
        } catch (error) {
            toast.error("Erro de conexão", { id: toastId });
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
        editUser,
        refresh // EXPORTADA AGORA
    };
}