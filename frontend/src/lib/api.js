// lib/api.js
import { toast } from "sonner";

export function getTokenFromCookie(ctx) {
  if (ctx && ctx.req) {
    const cookie = ctx.req.headers.cookie || "";
    const match = cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : null;
  } else if (typeof window !== "undefined") {
    const match = document.cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : null;
  }
  return null;
}

export async function apiFetch(path, options = {}) {
  const token = getTokenFromCookie();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}${path}`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    // CASOS QUE NÃO SÃO ERRO DE VERDADE (só lista vazia)
    const mensagensNormais = [
      "Nenhum pedido solicitado",
      "Nenhum pedido encontrado",
      "Nenhum insumo encontrado",
      "Lista vazia",
      "Não há registros",
      "Sem resultados",
    ];

    const mensagem = data?.message || "";
    const ehMensagemNormal = mensagensNormais.some(m => mensagem.includes(m));

    if (response.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      document.cookie = "token=; Max-Age=0; path=/";
      return null;
    }
     
    if (response.status === 400) {
      toast.error("Erro encontrado.");
      return response.body
      // return null;
    }
    // SE FOR UMA MENSAGEM "NORMAL" DE LISTA VAZIA → NÃO TRATA COMO ERRO!
    if (!response.ok && ehMensagemNormal) {
      return data || { message: "Nenhum item encontrado" };
    }

    if (!response.ok) {
      if (data?.message) {
        console.error("Erro da API:", data.message);
        throw new Error(data.message);
      } else if (data?.errors) {
        console.error("Erros da API:", data.errors);
        throw new Error(data.errors);
      } else {
        console.error(`Erro HTTP ${response.status}`);
        throw new Error(`Erro ${response.status}`);
      }
    }

    return data;
  } catch (err) {
    if (!err.handled) {
      console.error("Erro inesperado no apiFetch:", err);
    }
    return { error: true, message: err.message };
  }
}

// Atalhos para métodos comuns
export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) =>
    apiFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    apiFetch(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: (path) =>
    apiFetch(path, {
      method: "DELETE",
    }),
};