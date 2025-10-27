"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api"; // Certifique-se de que este caminho está correto

const USER_ENDPOINT = "admin"; // Endpoint base para todas as operações

export function useUsers(initialData = [], initialPage = 0, initialPageSize = 10) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  /**
   * LER: Carrega ou recarrega a lista de usuários do backend com paginação.
   * @param {number} pageIndex - O índice da página a ser carregada (base 0).
   * @param {number} size - O número de itens por página.
   */
  const loadUsers = useCallback(
    async (pageIndex, size) => {
      setLoading(true);
      setError(null);

      try {
        // Converte o pageIndex (0-based) para 1-based para a requisição da API
        const apiPage = pageIndex + 1;

        // ATUALIZADO:
        // O objeto 'params' do Axios/api vai construir a URL
        // como: /admin?$page=[apiPage]&limit=[size]
console.log("-----------------------------",apiPage, size )
        const result = await api.get(`${USER_ENDPOINT}?page=${apiPage}&limit=${size}`);

        if (result && result.error) {
          setError(result.message || "Erro ao carregar lista de usuários.");
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
    [USER_ENDPOINT]
  );

  // Efeito para carregar os dados na montagem
  useEffect(() => {
    if (!hasInitialDataBeenProcessed && users.length === 0) {
      loadUsers(currentPage, pageSize);
      setHasInitialDataBeenProcessed(true);
    }
  }, [hasInitialDataBeenProcessed, users.length, currentPage, pageSize, loadUsers]);

  // Função para mudar a página (será chamada pelo componente de UI)
  const setPage = useCallback((pageIndex) => {
    if (pageIndex !== currentPage) {
      loadUsers(pageIndex, pageSize);
    }
  }, [currentPage, pageSize, loadUsers]);

  // Função para mudar o tamanho da página (será chamada pelo componente de UI)
  const setLimit = useCallback((newSize) => {
    if (newSize !== pageSize) {
      loadUsers(0, newSize); // Volta para a primeira página ao mudar o limite
    }
  }, [pageSize, loadUsers]);

  // ** Funções addUser, editUser, e deleteUser foram removidas **

  // Retorna apenas o estado e funções de paginação/carregamento
  return {
    users,
    loading,
    error,
    totalItems,
    currentPage, // 0-based
    pageSize,
    setPage,
    setLimit,
  };
}