// Componentes necessários do shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText, Package, DollarSign, Loader2, Zap, ArrowLeftRight, CheckCircle2, XCircle,
    Eye, Plus, Filter, Pencil
} from 'lucide-react';

// Assumindo que você terá um hook para buscar os dados de compra (similar ao useUsers)
// import { useBuyerPurchases } from '@/hooks/useBuyerPurchases'; 

// Mockup de dados para visualização (substituir por dados reais da API)
const mockPurchases = [
    { id: 'C1001', pedidoId: 'P501', gerenteId: 'G01', amount: 5500.00, status: 'pendente', description: 'Compra de 100Kg de Polímero X' },
    { id: 'C1002', pedidoId: 'P502', gerenteId: 'G02', amount: 0.00, status: 'fase_de_orcamento', description: 'Aquisição de nova máquina de corte' },
    { id: 'C1003', pedidoId: 'P503', gerenteId: 'G01', amount: 1200.50, status: 'aprovado_gerente', description: 'Materiais de escritório para 3 meses' },
    { id: 'C1004', pedidoId: 'P504', gerenteId: 'G03', amount: 0.00, status: 'renegociacao', description: 'Revisão de contrato com Fornecedor Z' },
    { id: 'C1005', pedidoId: 'P505', gerenteId: 'G02', amount: 2500.00, status: 'cancelado', description: 'Licenças de software CAD' },
];

// Mockup de KPIs (Key Performance Indicators)
const mockKpis = [
    { title: "Compras Pendentes", value: 25, icon: Package, description: "Novas solicitações aguardando orçamento." },
    { title: "Em Negociação", value: 8, icon: ArrowLeftRight, description: "Em fase de orçamento ou renegociação." },
    { title: "Orçamentos Aprovados", value: 12, icon: CheckCircle2, description: "Prontas para finalização da compra." },
    { title: "Total Cancelados (Mês)", value: 3, icon: XCircle, description: "Orçamentos que não foram adiante." },
];

// Função auxiliar para estilizar o Status
const getStatusBadge = (status) => {
    switch (status) {
        case 'pendente': return <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Pendente</Badge>;
        case 'fase_de_orcamento': return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"><DollarSign size={14} className="mr-1"/> Orçamento</Badge>;
        case 'renegociacao': return <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"><Zap size={14} className="mr-1"/> Renegociação</Badge>;
        case 'aprovado_gerente': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Aprovado</Badge>;
        case 'cancelado': return <Badge variant="destructive">Cancelado</Badge>;
        default: return <Badge variant="secondary">N/D</Badge>;
    }
}

export default function BuyerDashboard() {
    // const { purchases, loading, error } = useBuyerPurchases(); // Usaria seu hook real
    const purchases = mockPurchases; 
    const loading = false;
    const error = null;

    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">Erro ao carregar dados: {error}</div>;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold tracking-tight">Painel do Comprador 🧑‍💻</h1>
            
            {/* 1. CARDS DE STATUS / KPIS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockKpis.map((kpi) => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* --- SEPARADOR --- */}
            <hr className="my-6" />

            {/* 2. TABELA DE GESTÃO DE COMPRAS E ORÇAMENTOS */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Solicitações de Compra Ativas</h2>
                <div className="flex space-x-2">
                    {/* Botão de Filtro - Permite ao Buyer ver compras por status */}
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtrar Status</Button>
                    
                    {/* Botão para Nova Proposta (O Buyer só pode criar orçamento para uma compra existente) */}
                    <Button><Plus className="mr-2 h-4 w-4" /> Novo Orçamento</Button> 
                </div>
            </div>

            <Card className="shadow-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID Compra</TableHead>
                            <TableHead className="w-[100px]">ID Pedido</TableHead>
                            <TableHead>Descrição da Solicitação</TableHead>
                            <TableHead className="text-right">Valor Atual</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((compra) => (
                            <TableRow key={compra.id} className="hover:bg-accent/50 transition-colors">
                                <TableCell className="font-medium">{compra.id}</TableCell>
                                <TableCell className="text-muted-foreground">{compra.pedidoId}</TableCell>
                                <TableCell>{compra.description}</TableCell>
                                <TableCell className="text-right font-semibold">
                                    {compra.amount > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(compra.amount) : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getStatusBadge(compra.status)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {/* Botão de Ver Detalhes (Função getCompra) */}
                                    <Button variant="ghost" size="icon" title="Ver Detalhes">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    
                                    {/* Botão de Ação Primária (Baseada no Status) */}
                                    {compra.status === 'pendente' && (
                                        // Ação: Criar Orçamento (createOrcamento)
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                            <DollarSign className="h-4 w-4 mr-1" /> Fazer Proposta
                                        </Button>
                                    )}
                                    {compra.status === 'fase_de_orcamento' && (
                                        // Ação: Editar Orçamento (updateOrcamento / renegociarOrcamento)
                                        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                                            <Pencil className="h-4 w-4 mr-1" /> Editar Orçamento
                                        </Button>
                                    )}
                                    {compra.status === 'renegociacao' && (
                                        // Ação: Renegociar Orçamento (renegociarOrcamento)
                                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                            <ArrowLeftRight className="h-4 w-4 mr-1" /> Renegociar
                                        </Button>
                                    )}
                                    {compra.status === 'aprovado_gerente' && (
                                        // Ação: Finalizar/Emitir Compra (Próximo Passo após aprovação)
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                            Finalizar Compra
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* (Opcional: Adicionar paginação e controle de limite, similar ao ListUsers) */}
        </div>
    );
}

// Para usar, garanta que todos os componentes shadcn/ui estejam importados no seu projeto.