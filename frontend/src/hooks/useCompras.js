"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api"; // Assume que você tem este arquivo de API

const PURCHASE_ENDPOINT = "buyer/compras"; // Endpoint solicitado

export function usePurchases(initialData = [], initialPage = 0, initialPageSize = 10) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estado para indicar que uma ação específica (update/status) está em andamento
    const [isUpdating, setIsUpdating] = useState(false); 

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalItems, setTotalItems] = useState(0);

    const initialPurchasesArray =
        initialData && initialData.data && Array.isArray(initialData.data)
        ? initialData.data
        : Array.isArray(initialData)
        ? initialData
        : [];

    const [purchases, setPurchases] = useState(initialPurchasesArray);
    const [hasInitialDataBeenProcessed, setHasInitialDataBeenProcessed] = useState(initialPurchasesArray.length > 0);

    const loadPurchases = useCallback(
        async (pageIndex, size) => {
            setLoading(true);
            setError(null);

            try {
                const apiPage = pageIndex + 1;
                // Chamada usando a lib/api.js para a rota /buyer/compras
                const result = await api.get(`${PURCHASE_ENDPOINT}?page=${apiPage}&limit=${size}`);

                // Tratamento de erro conforme a sua lib (result.success === false)
                if (result && result.success === false) {
                    setError(result.error || "Erro ao carregar lista de compras.");
                    setPurchases([]);
                    setTotalItems(0);
                    return;
                }

                const fetchedPurchases = Array.isArray(result.data) ? result.data : [];
                setPurchases(fetchedPurchases);
                setTotalItems(result.totalItems || result.meta?.totalItems || 0);

                setCurrentPage(pageIndex);
                setPageSize(size);

            } catch (err) {
                console.error("Erro ao carregar compras:", err);
                setError("Falha na comunicação com o servidor ao carregar compras.");
                setPurchases([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (!hasInitialDataBeenProcessed && purchases.length === 0) {
            loadPurchases(currentPage, pageSize);
            setHasInitialDataBeenProcessed(true);
        }
    }, [hasInitialDataBeenProcessed, purchases.length, currentPage, pageSize, loadPurchases]);

    const setPage = useCallback((pageIndex) => {
        if (pageIndex !== currentPage) {
            loadPurchases(pageIndex, pageSize);
        }
    }, [currentPage, pageSize, loadPurchases]);

    const setLimit = useCallback((newSize) => {
        if (newSize !== pageSize) {
            loadPurchases(0, newSize);
        }
    }, [pageSize, loadPurchases]);

    // --- FUNÇÃO PARA ATUALIZAR STATUS (ex: Aprovar, Cancelar, Enviar Orçamento) ---
    const updateStatus = useCallback(async (id, newStatus) => {
        setIsUpdating(true);
        let success = false;
        
        try {
            // Faz o PUT para atualizar o status
            const result = await api.put(`${PURCHASE_ENDPOINT}/status/${id}`, { status: newStatus });

            if (result && result.success !== false) {
                success = true;
                
                // Optimistic UI: Atualiza a lista localmente
                setPurchases((currentPurchases) => 
                    currentPurchases.map((purchase) => {
                        const currentId = purchase.id || purchase._id;
                        if (currentId === id) {
                            return { ...purchase, status: newStatus };
                        }
                        return purchase;
                    })
                );
            } else {
                console.error("Erro ao mudar status da compra:", result?.error);
            }

        } catch (error) {
            console.error("Erro de rede:", error);
        } finally {
            setIsUpdating(false);
        }
        return success;
    }, []);

    // --- FUNÇÃO PARA EDITAR DADOS DA COMPRA (Ex: Alterar descrição, valor, etc) ---
    const updatePurchase = useCallback(async (id, data) => {
        setIsUpdating(true);
        let success = false;
        
        try {
            const result = await api.put(`${PURCHASE_ENDPOINT}/${id}`, data); 

            if (result && result.success !== false) {
                success = true;
                
                // Optimistic UI
                setPurchases((currentPurchases) => 
                    currentPurchases.map((purchase) => {
                        const currentId = purchase.id || purchase._id;
                        if (currentId === id) {
                            return { ...purchase, ...data }; 
                        }
                        return purchase;
                    })
                );
            } else {
                console.error("Erro ao editar compra:", result?.error);
            }

        } catch (error) {
            console.error("Erro de rede ao editar compra:", error);
        } finally {
            setIsUpdating(false);
        }
        return success;
    }, []);

    return {
        purchases,      // Lista de compras
        loading,        // Estado de carregamento geral
        isUpdating,     // Estado de carregamento de ações (salvar/editar)
        error,          // Mensagens de erro
        totalItems,     // Total de registros para paginação
        currentPage,    // Página atual (0-indexado)
        pageSize,       // Itens por página
        setPage,        // Função para mudar página
        setLimit,       // Função para mudar limite por página
        updateStatus,   // Função para mudar status
        updatePurchase, // Função para editar dados gerais
        refresh: () => loadPurchases(currentPage, pageSize) // Função extra para recarregar manualmente
    };
}