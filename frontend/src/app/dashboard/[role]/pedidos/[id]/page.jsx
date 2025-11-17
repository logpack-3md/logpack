'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Package, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RiSettings3Line, RiTruckLine, RiCheckDoubleLine } from '@remixicon/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function PedidoDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await api.get(`manager/pedido/${id}`);
        setPedido(res?.pedido || res?.data || res);
      } catch {
        toast.error('Pedido não encontrado');
        router.push('/dashboard/manager/pedidos');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPedido();
  }, [id, router]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div><p className="mt-6 text-xl text-gray-600">Carregando pedido...</p></div></div>;
  if (!pedido) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center"><Package className="w-32 h-32 text-gray-300 mx-auto mb-8" /><h2 className="text-3xl font-bold text-gray-900">Pedido não encontrado</h2><Link href="/dashboard/manager/pedidos" className="mt-6 inline-block text-blue-600 hover:underline text-lg">← Voltar à lista</Link></div>;

  const statusConfig = {
    solicitado: { color: 'bg-blue-100 text-blue-800', icon: RiSettings3Line },
    aprovado: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    negado: { color: 'bg-red-100 text-red-800', icon: XCircle },
    compra_iniciada: { color: 'bg-orange-100 text-orange-800', icon: RiTruckLine },
    compra_efetuada: { color: 'bg-purple-100 text-purple-800', icon: RiCheckDoubleLine },
  };

  const status = statusConfig[pedido.status] || statusConfig.solicitado;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/dashboard/manager/pedidos" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 mb-10 text-lg font-medium">
          <ArrowLeft className="w-6 h-6" /> Voltar à gestão de pedidos
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white">
            <h1 className="text-5xl font-bold">Pedido #{pedido.id.slice(0, 8)}</h1>
            <div className={`inline-flex items-center gap-4 mt-6 px-8 py-4 rounded-full text-lg font-bold ${status.color}`}>
              <StatusIcon className="w-8 h-8" />
              {pedido.status.toUpperCase()}
            </div>
          </div>

          <div className="p-10">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Informações do Pedido</h2>
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-500 text-lg">SKU do Insumo</p>
                    <p className="text-5xl font-black text-gray-900 mt-2">{pedido.insumoSKU}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xl">
                    <Calendar className="w-8 h-8 text-gray-400" />
                    <span className="font-medium">{new Date(pedido.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-10 flex flex-col items-center justify-center">
                <div className={`p-12 rounded-full ${status.color}`}>
                  <StatusIcon className="w-32 h-32" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mt-8">
                  {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}