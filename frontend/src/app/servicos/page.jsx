import { Footer } from "@/components/Blocks/footer";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Bell, Cpu, Scan } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Dados para os passos do serviço (facilita a manutenção)
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
    icon: Cpu,
    titulo: "Análise com Inteligência Artificial",
    descricao: "Nossos algoritmos de IA analisam os dados recebidos, identificando padrões, prevendo demandas e detectando anomalias instantaneamente.",
  },
  {
    etapa: "04",
    icon: Bell,
    titulo: "Alertas e Insights Visuais",
    descricao: "Você recebe insights claros em um dashboard intuitivo e alertas automáticos sobre níveis de estoque críticos, movimentações e possíveis perdas.",
  },
];

const servico = () => {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-10 lg:px-10 flex flex-col gap-20 lg:gap-24">

        {/* Cabeçalho Principal */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
            Como a LogPack Transforma seu Estoque
          </h1>
          <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
            Nossa solução combina hardware e software oferece uma visão completa e em tempo real do seu estoque.
          </p>
        </section>

        {/* Passo a Passo do Serviço */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicosInformation.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.etapa} className="bg-slate-50 dark:bg-card border rounded-2xl p-6 lg:p-8 flex flex-col gap-4 text-center md:text-left">
                  <div className="flex justify-center md:justify-start items-center gap-4">
                    <div className="p-3 bg-primary/30 rounded-lg text-primary">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <span className="text-5xl font-bold text-primary/50">{item.etapa}</span>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{item.titulo}</h3>
                  <p className="text-muted-foreground text-sm">{item.descricao}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vantagens e Benefícios */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Otimização que Gera Resultados Reais
            </h2>
            <p className="text-muted-foreground lg:text-lg">
              Além de saber exatamente o que você tem no estoque, nossa plataforma oferece vantagens competitivas que impactam diretamente o seu faturamento e eficiência.
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg text-primary shrink-0">
                <ArrowRight className="h-6 w-6 transform -rotate-45" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Redução de Perdas e Furtos</h4>
                <p className="text-muted-foreground text-sm">Monitore cada grama do seu inventário e receba alertas sobre qualquer variação não autorizada, eliminando desvios.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg text-primary shrink-0">
                <ArrowRight className="h-6 w-6 transform -rotate-45" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Compras Inteligentes</h4>
                <p className="text-muted-foreground text-sm">Compre na hora certa e na quantidade exata. Nossas previsões de demanda evitam tanto a falta de produtos quanto o excesso de estoque.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg text-primary shrink-0">
                <ArrowRight className="h-6 w-6 transform -rotate-45" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Eficiência Operacional</h4>
                <p className="text-muted-foreground text-sm">Automatize a contagem de inventário e libere sua equipe para focar em tarefas que realmente agregam valor ao seu negócio.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto rounded-2xl bg-primary/5 dark:bg-card border px-6 py-12 lg:p-16 flex flex-col items-center text-center gap-6 w-full">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Pronto para Otimizar seu Estoque?
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Descubra na prática como nossa tecnologia pode reduzir seus custos e aumentar sua lucratividade. Agende uma demonstração gratuita e personalizada.
          </p>
          <Button className="w-fit gap-2 mt-4" asChild>
            <a href="/contato">
              Solicite uma Demonstração
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </section>

      </main>
<Separator />
      <Footer />
    </>
  );
};

export default servico;