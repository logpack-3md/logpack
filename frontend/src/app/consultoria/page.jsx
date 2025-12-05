import { Footer } from "@/components/Blocks/Home/footer";
import Header from "@/components/Blocks/Home/header";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BarChart, 
  TrendingUp, 
  ClipboardCheck, 
  Users, 
  Lightbulb 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Dados reestruturados para uma abordagem de Consultoria e Estratégia
const metodologiaConsultoria = [
  {
    etapa: "01",
    icon: ClipboardCheck,
    titulo: "Diagnóstico Operacional",
    descricao: "Mapeamos os gargalos do seu estoque atual e desenhamos um plano de implementação da infraestrutura IoT da Logpack sob medida para o seu layout.",
  },
  {
    etapa: "02",
    icon: Users,
    titulo: "Implementação Estratégica",
    descricao: "Acompanhamos a instalação dos sensores e treinamos sua equipe para integrar a tecnologia aos processos diários, garantindo adoção sem atrito.",
  },
  {
    etapa: "03",
    icon: BarChart,
    titulo: "Gestão Baseada em Dados",
    descricao: "Transformamos o fluxo de informações brutas da Logpack em KPIs acionáveis, estabelecendo uma cultura de controle absoluto sobre peso e volume.",
  },
  {
    etapa: "04",
    icon: TrendingUp,
    titulo: "Melhoria Contínua e ROI",
    descricao: "Nossos consultores utilizam os insights da IA para propor ajustes constantes, visando a maximização da margem de lucro e redução de capital parado.",
  },
];

const LogpackConsultoria = () => {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-12 lg:px-10 flex flex-col gap-20 lg:gap-28 text-foreground">

        {/* Hero Section - Abordagem Consultiva */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors">
            Consultoria Especializada em Gestão de Estoque
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl text-foreground">
            Inteligência Logística Aliada à Tecnologia Logpack
          </h1>
          
          <p className="mt-4 text-lg text-muted-foreground lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Não entregamos apenas sensores; entregamos uma nova metodologia de gestão. Unimos nossa expertise em supply chain com a precisão da Logpack para transformar dados em decisões executivas.
          </p>
        </section>

        {/* Metodologia de Trabalho */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Nossa Metodologia de Atuação</h2>
            <p className="text-muted-foreground mt-2">Como aplicamos a inteligência Logpack no seu negócio</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metodologiaConsultoria.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.etapa} className="bg-card border dark:border-border border-[#7a7a7a71] rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-4xl font-bold text-muted/50 group-hover:text-primary/20 transition-colors">
                      {item.etapa}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mt-2 mb-2 text-card-foreground">{item.titulo}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Impacto Estratégico */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center bg-muted/30 border rounded-3xl p-8 lg:p-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
              Por que contratar nossa consultoria?
            </h2>
            <p className="text-muted-foreground lg:text-lg">
              Muitas empresas possuem dados, mas poucas geram valor real com eles. Nossa consultoria fecha a lacuna entre a tecnologia Logpack e o resultado financeiro da sua empresa.
            </p>  
          </div>
          
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="flex gap-4 p-5 bg-card rounded-xl border dark:border-border border-[#7a7a7a71] shadow-sm hover:border-primary/50 transition-colors">
              <div className="mt-1 bg-accent p-2 rounded-full h-fit text-accent-foreground">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-card-foreground">Visão Holística do Negócio</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Analisamos não apenas onde está o estoque, mas <strong>por que</strong> ele está lá. Identificamos padrões de compra ineficientes e sugerimos correções no fluxo de caixa.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex gap-4 p-5 bg-card rounded-xl border dark:border-border border-[#7a7a7a71] shadow-sm hover:border-primary/50 transition-colors">
              <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-card-foreground">Auditoria em Tempo Real</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Substituímos inventários anuais custosos por uma auditoria contínua. Detectamos desvios e perdas no momento em que ocorrem, blindando sua operação.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex gap-4 p-5 bg-card rounded-xl border dark:border-border border-[#7a7a7a71] shadow-sm hover:border-primary/50 transition-colors">
              <div className="mt-1 bg-secondary p-2 rounded-full h-fit text-secondary-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-card-foreground">Empoderamento da Equipe</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Não apenas instalamos o sistema; capacitamos seus gestores para tomarem decisões baseadas nos alertas preditivos da Logpack.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Separator className="bg-border" />
      <Footer />
    </>
  );
};

export default LogpackConsultoria;