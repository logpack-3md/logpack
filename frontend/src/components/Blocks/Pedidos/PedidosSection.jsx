'use client';

import { useState, useEffect } from 'react';
import {
  RiSettings3Line,
  RiCheckLine,
  RiCloseLine,
  RiTruckLine,
  RiEdit2Line,
  RiDeleteBin6Line,
  RiCheckDoubleLine,
} from '@remixicon/react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const statusConfig = {
  solicitado: { label: 'Solicitações', icon: RiSettings3Line, color: 'blue' },
  aprovado: { label: 'Aprovados', icon: RiCheckLine, color: 'emerald' },
  negado: { label: 'Negados', icon: RiCloseLine, color: 'red' },
  compra_iniciada: { label: 'Em Análise', icon: RiTruckLine, color: 'orange' },
  compra_efetuada: { label: 'Compra Efetuada', icon: RiTruckLine, color: 'purple' },
};

export default function PedidosSection() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pedidoParaAprovar, setPedidoParaAprovar] = useState(null);
  const [dialogNegarOpen, setDialogNegarOpen] = useState(false);
  const [pedidoParaNegar, setPedidoParaNegar] = useState(null);
  const router = useRouter();

  const fetchPedidos = async () => {
    try {
      const res = await api.get('manager/pedido');
      const data = Array.isArray(res) ? res : res?.data || res?.pedidos || [];
      setPedidos(data);
    } catch (err) {
      console.error(err);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPedidos(); }, []);

  const aprovarPedido = async () => {
    if (!pedidoParaAprovar) return;
    try {
      await api.put(`manager/pedido/status/${pedidoParaAprovar.id}`);
      toast.success('Pedido aprovado com sucesso!');
      fetchPedidos();
    } catch { toast.error('Erro ao aprovar'); } 
    finally { setDialogOpen(false); setPedidoParaAprovar(null); }
  };

  const negarPedido = async () => {
    if (!pedidoParaNegar) return;
    try {
      await api.put(`manager/pedido/status/${pedidoParaNegar.id}`, { status: 'negado' });
      toast.success('Pedido negado com sucesso!');
      fetchPedidos();
    } catch { toast.error('Erro ao negar'); } 
    finally { setDialogNegarOpen(false); setPedidoParaNegar(null); }
  };

  const irParaDetalhes = (id) => router.push(`/dashboard/manager/pedidos/${id}`);

  const getByStatus = (status) => pedidos.filter(p => p.status === status);

  if (loading) return <div className="p-20 text-center text-gray-500">Carregando pedidos...</div>;

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
          <h3 className="text-3xl font-bold text-gray-900">Gestão de Solicitações</h3>
          <p className="text-gray-600 mt-2">Aprove, negue ou visualize todos os pedidos de insumos</p>
        </div>

        <TabGroup className="p-6">
          <TabList className="mb-8 border-b border-gray-200">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <Tab key={key}>
                <div className="flex items-center gap-3 py-3 px-2">
                  <cfg.icon className={`w-6 h-6 text-${cfg.color}-600`} />
                  <span className="font-semibold">{cfg.label}</span>
                  <span className={`ml-3 px-3 py-1 text-xs font-bold rounded-full bg-${cfg.color}-100 text-${cfg.color}-700`}>
                    {getByStatus(key).length}
                  </span>
                </div>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {Object.entries(statusConfig).map(([status, cfg]) => {
              const lista = getByStatus(status);
              return (
                <TabPanel key={status}>
                  {lista.length === 0 ? (
                    <div className="text-center py-32 text-gray-500">
                      <cfg.icon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <p className="text-xl font-medium">Nenhum pedido {cfg.label.toLowerCase()}</p>
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {lista.map(p => (
                        <div key={p.id} className="group bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:border-gray-300 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {p.insumoSKU.slice(-3)}
                              </div>
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900">{p.insumoSKU}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  Solicitado em {new Date(p.createdAt).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>

                            {status === 'solicitado' && (
                              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button onClick={() => { setPedidoParaAprovar(p); setDialogOpen(true); }} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  <RiCheckDoubleLine className="w-5 h-5 mr-2" /> Aprovar
                                </Button>
                                <button onClick={() => irParaDetalhes(p.id)} className="p-3 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all hover:scale-110">
                                  <RiEdit2Line className="w-6 h-6 text-blue-600" />
                                </button>
                                <button onClick={() => { setPedidoParaNegar(p); setDialogNegarOpen(true); }} className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-all hover:scale-110">
                                  <RiDeleteBin6Line className="w-6 h-6 text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabPanel>
              );
            })}
          </TabPanels>
        </TabGroup>
      </div>

      {/* DIALOG APROVAR */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <RiCheckDoubleLine className="w-8 h-8 text-emerald-600" /> Confirmar Aprovação
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg">Deseja realmente <strong className="text-emerald-600">aprovar</strong> o pedido:</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">{pedidoParaAprovar?.insumoSKU}</p>
          </div>
          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={aprovarPedido} className="bg-emerald-600 hover:bg-emerald-700">Sim, aprovar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG NEGAR */}
      <Dialog open={dialogNegarOpen} onOpenChange={setDialogNegarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <RiCloseLine className="w-8 h-8 text-red-600" /> Negar Solicitação
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg">Tem certeza que deseja <strong className="text-red-600">negar</strong> o pedido:</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">{pedidoParaNegar?.insumoSKU}</p>
            <p className="text-sm text-gray-500 mt-4">O solicitante será notificado.</p>
          </div>
          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setDialogNegarOpen(false)}>Cancelar</Button>
            <Button onClick={negarPedido} className="bg-red-600 hover:bg-red-700">Sim, negar pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}