import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useManagerOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });

  const fetchOrcamentos = useCallback(async (pageIndex = 1, pageSize = 10, statusFilter = 'todos') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageIndex.toString(),
        limit: pageSize.toString()
      });

      if (statusFilter !== 'todos') {
        queryParams.append('status', statusFilter);
      }

      // BUSCA COMPOSTA (Para recuperar SKU caso o backend não envie aninhado)
      const [resOrcamentos, resCompras, resPedidos] = await Promise.all([
        api.get(`manager/orcamentos?${queryParams.toString()}`),
        api.get(`manager/compras?limit=200`), // Cache auxiliar
        api.get(`manager/pedido?limit=500`) // Cache auxiliar
      ]);

      const hasError = resOrcamentos && resOrcamentos.success === false;
      if (hasError) {
        const msg = (resOrcamentos.error || resOrcamentos.message || "").toLowerCase();
        if (resOrcamentos.status === 404 || msg.includes('nenhum') || msg.includes('encontrado')) {
          setOrcamentos([]);
          setMeta({ totalItems: 0, totalPages: 1, currentPage: 1 });
          return;
        }
        throw new Error(resOrcamentos.error || resOrcamentos.message);
      }

      const rawOrcamentos = resOrcamentos?.data || resOrcamentos?.orcamentos || [];
      const listaCompras = Array.isArray(resCompras?.data) ? resCompras.data : [];
      const listaPedidos = Array.isArray(resPedidos?.data) ? resPedidos.data : [];

      const normalized = rawOrcamentos.map(o => {
        // Relações Lógicas
        const compraVinculada = listaCompras.find(c => c.id === o.compraId) || {};
        const pedidoVinculado = compraVinculada.pedidoId
          ? listaPedidos.find(p => p.id === compraVinculada.pedidoId)
          : {};

        // Determina o SKU (prioridade: Orcamento > Compra > Pedido)
        const finalSku = 
            o.insumoSKU || 
            compraVinculada.insumoSKU || 
            pedidoVinculado.insumoSKU || 
            pedidoVinculado.sku || 
            '---';

        // Determina descrição (prioridade: Orçamento > Compra)
        const finalDesc = o.description || compraVinculada.description || "Sem descrição";

        return {
          id: o.id,
          compraId: o.compraId,
          buyerId: o.buyerId,
          description: finalDesc,
          originalAmount: o.amount,
          sku: finalSku,
          valor_total: Number(o.valor_total || 0),
          status: (o.status || 'pendente').toLowerCase(),
          createdAt: o.createdAt || new Date().toISOString(),
        }
      });

      normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrcamentos(normalized);
      setMeta(resOrcamentos?.meta || {
        totalItems: normalized.length,
        totalPages: Math.ceil(normalized.length / pageSize),
        currentPage: pageIndex
      });

      setPage(pageIndex);
      setLimit(pageSize);

    } catch (err) {
      console.warn("Fetch Orcamentos warning:", err);
      setOrcamentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const contestarOrcamento = async (orcamentoId, decision, description = null) => {
    setIsSubmitting(true);
    try {
      const payload = { status: decision };

      // Se renegociar, manda a "conversa" junto
      if (decision === 'renegociacao' && description && description.trim().length > 0) {
        payload.description = description;
      }

      const res = await api.put(`manager/orcamentos/contestar/${orcamentoId}`, payload);

      if (res && res.success === false) throw new Error(res.error || res.message);

      let message = "Status atualizado.";
      if (decision === 'aprovado') message = "Orçamento APROVADO!";
      if (decision === 'negado') message = "Orçamento NEGADO.";
      if (decision === 'renegociacao') message = "Solicitação de ajuste enviada.";

      toast.success(message);

      setOrcamentos(prev => prev.map(o =>
        o.id === orcamentoId ? { ...o, status: decision, description: (payload.description || o.description) } : o
      ));

      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Falha na operação.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Para o modal de detalhes (fresh fetch)
  const getOrcamentoDetails = async (id) => {
    try {
      const res = await api.get(`manager/orcamentos/${id}`);
      return res?.data || res;
    } catch { return null; }
  }

  return {
    orcamentos,
    loading,
    isSubmitting,
    pagination: { page, limit, meta },
    fetchOrcamentos,
    contestarOrcamento,
    getOrcamentoDetails
  };
};