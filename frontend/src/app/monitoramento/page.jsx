import { Footer } from "@/components/Blocks/Home/footer";
import Header from "@/components/Blocks/Home/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BarChart, Bell, CheckCircle2, Cpu, Scan } from "lucide-react";

// Dados para os passos do serviço
const servicosInformation = [
  {
    etapa: "01",
    icon: Scan,
    titulo: "Instalação dos Sensores",
    descricao: "Nossa equipe instala sensores IoT de alta precisão em suas prateleiras, paletes ou áreas de estoque, sem interromper sua operação.",
  },
  {
    etapa: "02",
    icon: BarChart,
    titulo: "Monitoramento em Tempo Real",
    descricao: "Os sensores capturam dados de peso e volume 24/7 e os transmitem para nossa plataforma na nuvem de forma segura e contínua.",
  },
  {
    etapa: "03",
    icon: Bell,
    titulo: "Alertas e Insights Visuais",
    descricao: "Você recebe insights claros em um dashboard intuitivo e alertas automáticos sobre níveis de estoque críticos, movimentações e possíveis perdas.",
  },
];

const Monitoramento = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 px-10">
        
        {/* Hero Section com Gradiente Sutil */}
        <section className="relative py-10 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm font-medium rounded-full border-primary/20 bg-primary/5 text-primary">
              Tecnologia IoT & AI
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              Como a LogPack Transforma seu Estoque
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nossa solução combina hardware robusto e software inteligente para oferecer uma visão completa, preditiva e em tempo real do seu negócio.
            </p>
          </div>
        </section>

        <Separator className="max-w-7xl mx-auto opacity-50" />

        {/* Passo a Passo do Serviço (Cards Modernos) */}
        <section className="container mx-auto px-4 py-20 lg:py-24">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">O Processo Simplificado</h2>
            <p className="text-muted-foreground">Entenda como implementamos nossa tecnologia em quatro passos simples.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicosInformation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card 
                  key={item.etapa} 
                  className="relative overflow-hidden group hover:shadow-lg hover:border-primary/50 transition-all duration-300 border-muted bg-card/50"
                >
                  <div className="absolute -right-4 -top-4 text-9xl font-bold text-foreground/10 opacity-80 select-none group-hover:scale-110 transition-transform duration-500">
                    {item.etapa}
                  </div>
                  
                  <CardHeader className="pb-2 relative z-10">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{item.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.descricao}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Vantagens e Benefícios (Layout Assimétrico) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="border-primary text-primary">Resultados</Badge>
                <h2 className="text-3xl font-bold tracking-tight lg:text-5xl">
                  Otimização que Gera <span className="text-primary">Lucro Real</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Não é apenas sobre monitoramento; é sobre inteligência de negócios. Além de saber o que você tem, nossa plataforma entrega vantagens competitivas mensuráveis.
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Dashboard 100% customizável</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Integração via API com seu ERP</span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div className="bg-background rounded-2xl p-6 shadow-sm border flex gap-4 transition-all hover:-translate-y-1">
                  <div className="p-3 h-fit bg-red-100 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 shrink-0">
                    <ArrowRight className="h-6 w-6 transform -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Redução de Perdas e Furtos</h4>
                    <p className="text-muted-foreground text-sm">Monitore cada grama do inventário. Alertas imediatos sobre variações não autorizadas eliminam desvios na fonte.</p>
                  </div>
                </div>

                <div className="bg-background rounded-2xl p-6 shadow-sm border flex gap-4 transition-all hover:-translate-y-1">
                  <div className="p-3 h-fit bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                    <ArrowRight className="h-6 w-6 transform -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Compras Inteligentes</h4>
                    <p className="text-muted-foreground text-sm">Evite ruptura e excesso. Nossas previsões de demanda garantem que você compre a quantidade exata na hora certa.</p>
                  </div>
                </div>

                <div className="bg-background rounded-2xl p-6 shadow-sm border flex gap-4 transition-all hover:-translate-y-1">
                  <div className="p-3 h-fit bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 shrink-0">
                    <ArrowRight className="h-6 w-6 transform -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Eficiência Operacional</h4>
                    <p className="text-muted-foreground text-sm">Automatize a contagem. Libere sua equipe de tarefas repetitivas para focar no crescimento do negócio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Fundo Escuro/Primário para destaque */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative rounded-3xl bg-primary px-6 py-16 md:px-12 md:py-20 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            {/* Elemento decorativo de fundo */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Pronto para Otimizar seu Estoque?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Descubra na prática como a LogPack reduz custos e aumenta sua lucratividade. Agende uma demonstração gratuita hoje mesmo.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105" asChild>
                <a href="/contato" className="flex items-center gap-2">
                  Solicite uma Demonstração
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Monitoramento;