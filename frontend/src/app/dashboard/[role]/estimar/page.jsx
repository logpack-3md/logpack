// src/app/dashboard/[role]/estimar/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Menu, CircleUser, Bell, DollarSign, Clock, XCircle, RefreshCw, Plus } from 'lucide-react';
import { Toaster, toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SidebarBuyer, { SidebarContent } from "@/components/layout/sidebar-buyer";
import { useBuyerOperations } from "@/hooks/useBuyerOperations";

export default function EstimarPage() {
  const { compras, loading, fetchCompras, createOrcamento, renegociarOrcamento, cancelarOrcamento } = useBuyerOperations();

  const [tab, setTab] = useState("pedidos");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("criar"); // "criar" | "renegociar" | "cancelar"
  const [selectedItem, setSelectedItem] = useState(null);
  const [valorProposto, setValorProposto] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    const statusMap = {
      pedidos: "fase_de_orcamento",
      renegociacoes: "renegociacao",
      cancelados: "cancelado"
    };
    fetchCompras(1, 100, statusMap[tab] || null);
  }, [tab, fetchCompras]);

  const abrirModal = (item, tipo) => {
    setSelectedItem(item);
    setModalType(tipo);
    setValorProposto(item.orcamento?.[0]?.valor_total?.toString() || "");
    setDescricao(item.orcamento?.[0]?.description || "");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedItem || !valorProposto || parseFloat(valorProposto) <= 0) {
      toast.error("Preencha um valor válido");
      return;
    }

    try {
      if (modalType === "criar") {
        await createOrcamento(selectedItem.id, {
          valor_total: parseFloat(valorProposto),
          description: descricao || "Orçamento enviado pelo comprador"
        });
        toast.success("Orçamento criado com sucesso!");
      } else if (modalType === "renegociar") {
        const orcId = selectedItem.orcamento?.[0]?.id;
        await renegociarOrcamento(orcId, { valor_total: parseFloat(valorProposto) });
        toast.success("Renegociação enviada!");
      }
      setModalOpen(false);
      fetchCompras();
    } catch (err) {
      toast.error(err.message || "Erro ao processar orçamento");
    }
  };

  const handleCancelar = async () => {
    const orcId = selectedItem.orcamento?.[0]?.id;
    if (!orcId) return;

    try {
      await cancelarOrcamento(orcId);
      toast.error("Orçamento cancelado");
      setModalOpen(false);
      fetchCompras();
    } catch (err) {
      toast.error("Erro ao cancelar");
    }
  };

  const itensFiltrados = compras
    .filter(item => {
      const busca = searchTerm.toLowerCase();
      return (
        item.titulo?.toLowerCase().includes(busca) ||
        item.patrimonio?.toLowerCase().includes(busca)
      );
    });

  return (
    <>
      <div className="min-h-screen w-full bg-muted/40">
        <SidebarBuyer />

        <div className="flex flex-col md:pl-[240px] lg:pl-[260px]">
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, patrimônio ou status..."
                  className="pl-8 w-full md:w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Estimativas e Orçamentos</h1>
              <p className="text-sm text-muted-foreground">
                Crie orçamentos, renegocie valores ou cancele solicitações.
              </p>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                <TabsTrigger value="pedidos">
                  Pedidos ({compras.filter(c => !c.orcamento).length})
                </TabsTrigger>
                <TabsTrigger value="renegociacoes">
                  Renegociações ({compras.filter(c => c.orcamento?.[0]?.status === "renegociacao").length})
                </TabsTrigger>
                <TabsTrigger value="cancelados">
                  Cancelados ({compras.filter(c => c.orcamento?.[0]?.status === "cancelado").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={tab}>
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : itensFiltrados.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center text-muted-foreground">
                      Nenhum item encontrado.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {itensFiltrados.map((item) => {
                      const orc = item.orcamento?.[0];

                      return (
                        <Card key={item.id} className="relative overflow-hidden">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{item.titulo || "Sem título"}</CardTitle>
                                <p className="text-sm text-muted-foreground">Patrimônio: {item.patrimonio}</p>
                              </div>
                              {orc && (
                                <Badge variant={orc.status === "cancelado" ? "destructive" : orc.status === "renegociacao" ? "secondary" : "default"}>
                                  {orc.status === "renegociacao" ? "Renegociação" : orc.status}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {orc ? (
                              <div className="space-y-3">
                                <p className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-semibold">R$ {orc.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </p>
                                {orc.status === "renegociacao" && (
                                  <p className="text-amber-600 text-sm flex items-center gap-1">
                                    <RefreshCw className="h-4 w-4" /> Em renegociação
                                  </p>
                                )}
                                {orc.status === "cancelado" && (
                                  <p className="text-red-600 text-sm flex items-center gap-1">
                                    <XCircle className="h-4 w-4" /> Cancelado
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Aguardando orçamento
                              </p>
                            )}

                            {/* Botões de ação */}
                            <div className="mt-4 flex gap-2">
                              {!orc && (
                                <Button size="sm" className="flex-1" onClick={() => abrirModal(item, "criar")}>
                                  <Plus className="h-4 w-4 mr-1" /> Criar Orçamento
                                </Button>
                              )}
                              {orc && orc.status !== "cancelado" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => abrirModal(item, "renegociar")}>
                                    Renegociar
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => abrirModal(item, "cancelar")}>
                                    Cancelar
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {/* Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalType === "criar" && "Criar Orçamento"}
                {modalType === "renegociar" && "Renegociar Orçamento"}
                {modalType === "cancelar" && "Cancelar Orçamento"}
              </DialogTitle>
              <DialogDescription>
                {modalType === "cancelar"
                  ? "Tem certeza que deseja cancelar este orçamento? Esta ação não pode ser desfeita."
                  : "Preencha os dados do orçamento"}
              </DialogDescription>
            </DialogHeader>

            {modalType !== "cancelar" ? (
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Valor Proposto (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={valorProposto}
                    onChange={(e) => setValorProposto(e.target.value)}
                  />
                </div>
                {modalType === "criar" && (
                  <div>
                    <label className="text-sm font-medium">Descrição (opcional)</label>
                    <Input
                      placeholder="Ex: Inclui frete, instalação..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Fechar</Button>
              {modalType === "cancelar" ? (
                <Button variant="destructive" onClick={handleCancelar}>Confirmar Cancelamento</Button>
              ) : (
                <Button onClick={handleSubmit}>
                  {modalType === "criar" ? "Enviar Orçamento" : "Enviar Renegociação"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster position="bottom-right" richColors closeButton />
      </div>
    </>
  );
}