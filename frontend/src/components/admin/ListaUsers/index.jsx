import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

// Assumindo que você usa estes imports reais no seu projeto Next.js:
// import { api } from "@/lib/api"; 
// import { toast } from "sonner"; 
// Se precisar de um fallback para este ambiente:
const api = { get: async (path) => { throw new Error("API não definida. Use a real."); } }; 
const toast = { error: (msg) => console.error("TOAST/ERRO:", msg) }; 

// Componente principal
export default function ListaUsersSimples() {
  const pageSize = 5; // Limite fixo de itens por página
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // 0-indexed (0, 1, 2...)
  const [totalRowCount, setTotalRowCount] = useState(0);

  const totalPages = Math.ceil(totalRowCount / pageSize);

  // ------------------------------------------------------------------
  // LÓGICA CENTRAL DE FETCH (GET com Paginação de Servidor)
  // ------------------------------------------------------------------
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    
    // 1. Converte o índice 0-based (React) para 1-based (Backend)
    const page = pageIndex + 1; 
    const limit = pageSize;
    
    // 2. Constrói a URL usando a variável de ambiente
    const apiUrlBase = process.env.NEXT_PUBLIC_API_URL;
    
    // O backend espera a URL completa com os parâmetros:
    const path = `${apiUrlBase}users?page=${page}&limit=${limit}`; 

    try {
        // 3. Executa a chamada real à API
        // Se você usa uma função 'api.get' que abstrai o fetch:
        const result = await api.get(path); 

        // Se você usa o 'fetch' nativo (descomente este bloco se for o caso):
        /*
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Falha na resposta do servidor.');
        }
        const result = await response.json();
        */


        if (result && result.data) { // Verifica a estrutura de resposta esperada
            setData(result.data);
            // É crucial que o backend retorne o totalCount (total de todos os usuários)
            setTotalRowCount(result.totalCount || 0); 
        } else {
            // Se a API retornar sucesso mas com payload inesperado
            toast.error("Resposta da API inválida. Verifique 'data' e 'totalCount'.");
            setData([]);
            setTotalRowCount(0);
        }
    } catch (error) {
        // Erro de rede, erro no fetch, ou erro lançado acima
        toast.error(error.message || "Erro de comunicação com o servidor.");
        setData([]);
        setTotalRowCount(0);
    }
    
    setIsLoading(false);
  }, [pageIndex]); // Apenas o índice da página é a dependência.

  // ------------------------------------------------------------------
  // Efeito: Dispara o fetch quando o componente monta ou a página muda
  // ------------------------------------------------------------------
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Lista de Usuários</h3>
      
      {/* Tabela Mínima */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={1} style={{ textAlign: 'center', padding: '10px' }}>
                <Loader2 className="animate-spin inline-block mr-2 h-4 w-4" /> Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={1} style={{ textAlign: 'center', padding: '10px' }}>Nenhum usuário encontrado.</td>
            </tr>
          ) : (
            data.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Controles de Paginação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <p>Página {pageIndex + 1} de {totalPages || 1}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
            disabled={pageIndex === 0 || isLoading}
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
            Anterior
          </button>
          <button
            onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={pageIndex >= totalPages - 1 || isLoading || totalPages === 0}
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}