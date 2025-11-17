'use client';

import { useState, useEffect, useRef } from 'react';
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
  compra_efetuada: { label: 'Compra Efetuada', icon: RiTruckLine, color: 'green' },
};

const statusKeys = Object.keys(statusConfig);

export default function PedidosSection() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef([]);

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

  useEffect(() => {
    fetchPedidos();
  }, []);

  const aprovarPedido = async () => {
    if (!pedidoParaAprovar) return;
    try {
      await api.put(`manager/pedido/status/${pedidoParaAprovar.id}`);
      toast.success('Pedido aprovado com sucesso!');
      fetchPedidos();
    } catch {
      toast.error('Erro ao aprovar');
    } finally {
      setDialogOpen(false);
      setPedidoParaAprovar(null);
    }
  };

  const negarPedido = async () => {
    if (!pedidoParaNegar) return;
    try {
      await api.put(`manager/pedido/status/${pedidoParaNegar.id}`, { status: 'negado' });
      toast.success('Pedido negado com sucesso!');
      fetchPedidos();
    } catch {
      toast.error('Erro ao negar');
    } finally {
      setDialogNegarOpen(false);
      setPedidoParaNegar(null);
    }
  };

  const irParaDetalhes = (id) => router.push(`/dashboard/manager/pedidos/${id}`);

  const getByStatus = (status) => pedidos.filter((p) => p.status === status);

  if (loading) return <div className="p-12 text-center text-gray-500">Carregando pedidos...</div>;

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* HEADER ORIGINAL */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
          <h3 className="text-2xl font-bold text-gray-900">Gestão de Solicitações</h3>
          <p className="text-gray-600 mt-1">Aprove, negue ou visualize pedidos de insumos</p>
        </div>

        {/* ABAS COM BARRINHA PERFEITA (SÓ UMA ABA) */}
        <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex} className="p-6">
          <TabList className="relative mb-6 border-b border-gray-200">
            {/* BARRINHA DINÂMICA QUE SEGUE EXATAMENTE A ABA SELECIONADA */}
            {tabRefs.current[selectedIndex] && (
              <div
                className="absolute bottom-0 h-1 bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${tabRefs.current[selectedIndex]?.offsetWidth}px`,
                  left: `${tabRefs.current[selectedIndex]?.offsetLeft}px`,
                }}
              />
            )}

            {statusKeys.map((key, index) => {
              const cfg = statusConfig[key];
              const count = getByStatus(key).length;
              const isActive = selectedIndex === index;

              return (
                <Tab key={key}>
                  <div
                    ref={(el) => (tabRefs.current[index] = el)}
                    className={`flex items-center gap-3 py-3 px-4 transition-all duration-300 ${
                      isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <cfg.icon className={`w-5 h-5 ${isActive ? `text-${cfg.color}-600` : 'text-gray-500'}`} />
                    <span className="font-medium">{cfg.label}</span>
                    <span
                      className={`ml-2 px-2.5 py-0.5 text-xs font-bold rounded-full transition-all ${
                        isActive
                          ? `bg-${cfg.color}-100 text-${cfg.color}-700`
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </Tab>
              );
            })}
          </TabList>

          <TabPanels>
            {statusKeys.map((status) => {
              const cfg = statusConfig[status];
              const lista = getByStatus(status);

              return (
                <TabPanel key={status}>
                  {lista.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <cfg.icon className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">Nenhum pedido {cfg.label.toLowerCase()}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {lista.map((p) => (
                        <div
                          key={p.id}
                          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                  {p.insumoSKU.slice(-3)}
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900">{p.insumoSKU}</h4>
                                  <p className="text-sm text-gray-500">
                                    Solicitado em {new Date(p.createdAt).toLocaleString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {status === 'solicitado' && (
                              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  onClick={() => {
                                    setPedidoParaAprovar(p);
                                    setDialogOpen(true);
                                  }}
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                                >
                                  <RiCheckDoubleLine className="w-4 h-4 mr-1" />
                                  Aprovar
                                </Button>

                                <button
                                  onClick={() => irParaDetalhes(p.id)}
                                  className="p-3 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all hover:scale-110"
                                  title="Ver detalhes"
                                >
                                  <RiEdit2Line className="w-5 h-5 text-blue-600" />
                                </button>

                                <button
                                  onClick={() => {
                                    setPedidoParaNegar(p);
                                    setDialogNegarOpen(true);
                                  }}
                                  className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-all hover:scale-110"
                                  title="Negar pedido"
                                >
                                  <RiDeleteBin6Line className="w-5 h-5 text-red-600" />
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

      {/* DIALOGS (100% originais) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <RiCheckDoubleLine className="w-7 h-7 text-emerald-600" />
              Confirmar Aprovação
            </DialogTitle>
          </DialogHeader>
          <div className="text-base text-gray-700 space-y-3">
            <p>Deseja realmente <strong>aprovar</strong> o pedido:</p>
            <p className="font-bold text-lg text-gray-900 text-center py-2">
              {pedidoParaAprovar?.insumoSKU}
            </p>
          </div>
          <DialogFooter className="gap-3 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={aprovarPedido} className="bg-emerald-600 hover:bg-emerald-700">
              Sim, aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogNegarOpen} onOpenChange={setDialogNegarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <RiCloseLine className="w-7 h-7 text-red-600" />
              Negar Solicitação
            </DialogTitle>
          </DialogHeader>
          <div className="text-base text-gray-700 space-y-3">
            <p>Tem certeza que deseja <strong>negar</strong> o pedido:</p>
            <p className="font-bold text-lg text-gray-900 text-center py-2">
              {pedidoParaNegar?.insumoSKU}
            </p>
            <p className="text-sm text-gray-500 text-center">O solicitante será notificado.</p>
          </div>
          <DialogFooter className="gap-3 mt-6">
            <Button variant="outline" onClick={() => setDialogNegarOpen(false)}>Cancelar</Button>
            <Button onClick={negarPedido} className="bg-red-600 hover:bg-red-700">
              Sim, negar pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}