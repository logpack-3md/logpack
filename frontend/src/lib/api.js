// src/lib/api.js
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
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // ⛔ NÃO definir Content-Type manualmente se o body for FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${path}`,
      {
        ...options,
        headers,
        credentials: "include",
      }
    );

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    const mensagensNormais = [
      "Nenhum pedido solicitado",
      "Nenhum pedido encontrado",
      "Nenhum insumo encontrado",
      "Lista vazia",
      "Não há registros",
      "Sem resultados",
    ];

    const ehMensagemNormal =
      data?.message &&
      mensagensNormais.some((m) => data.message.includes(m));

    if (response.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      document.cookie = "token=; Max-Age=0; path=/";
      return null;
    }

    if (response.status === 400) {
      return {
        success: false,
        error: data?.message || "Erro na solicitação",
        details: data?.details || "",
        status: 400,
      };
    }

    if (!response.ok && ehMensagemNormal) {
      return data || { message: "Nenhum item encontrado" };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || data?.errors || `Erro ${response.status}`,
      };
    }

    return data;
  } catch (err) {
    return { success: false, error: "Falha na conexão com o servidor" };
  }
}

export const api = {
  get: (path) => apiFetch(path),

  post: (path, body) =>
    apiFetch(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (path, body) =>
    apiFetch(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (path, body) =>
    apiFetch(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  del: (path) => apiFetch(path, { method: "DELETE" }),
};
