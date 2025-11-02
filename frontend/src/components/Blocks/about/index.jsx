import IconSiteSobre from "@/components/icons/icons-Sobre";
import IconSiteTecnologia from "@/components/icons/icons-tecnologia";
import { Button } from "@/components/ui/button";
import { Package, Users, Scale, Award, ArrowRight } from "lucide-react";

const defaultAchievements = [
  { icon: Package, label: "Produtos Monitorados", value: "50k+" },
  { icon: Users, label: "Clientes Atendidos", value: "1.2k+" },
  { icon: Scale, label: "Precisão de Inventário", value: "99,5%" },
  { icon: Award, label: "Premiações Recebidas", value: "5+" },
];

const About = ({
  title = "Sobre a LogPack",
  description = "Somos especialistas em inteligência logística. Nossas soluções de monitoramento de estoque e controle de peso em tempo real ajudam negócios a eliminar perdas e maximizar a eficiência operacional.",
  breakout = {
    icon: Scale,
    title: "Tecnologia de Ponta",
    description:
      "Sensores IoT de alta precisão e algoritmos de IA para rastrear variações de estoque e peso no momento em que acontecem.",
    buttonText: "Conheça nossa tecnologia",
    buttonUrl: "/tecnologia",
  },
  achievementsTitle = "Impacto Real em Números",
  achievementsDescription = "Não entregamos apenas software, entregamos resultados mensuráveis que transformam a operação dos nossos parceiros.",
  achievements = defaultAchievements,


} = {}) => {

  return (
    <main className="container mx-auto px-4 py-16 lg:py-5 lg:px-10 flex flex-col gap-20 lg:gap-32">

      {/* Introdução */}
      <section className="grid gap-10 lg:grid-cols-2 items-center">

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground lg:text-xl max-w-[600px]">
              {description}
            </p>
          </div>
        </div>


        <div className="order-2 lg:order-1 relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl shadow-lg border bg-muted justify-center flex w-full max-w-md">
          <IconSiteSobre className="object-cover w-full h-full items-center justify-center" />
        </div>
      </section>

      {/* Resultados */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-card border px-6 py-12 lg:p-16">
        <div className="relative flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:w-1/3 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {achievementsTitle}
            </h2>
            <p className="text-muted-foreground">
              {achievementsDescription}
            </p>
          </div>

          {/* Grid de estatísticas com Ícones */}
          <div className="grid grid-cols-2 gap-8 lg:w-2/3 lg:grid-cols-4">
            {achievements.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div className="flex flex-col items-center lg:items-start gap-2" key={item.label + idx} >
                  <div className="flex items-center lg:items-start gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary mb-2" >
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <span className="text-3xl font-bold lg:text-4xl text-foreground">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center lg:text-md lg:text-left">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* fundo com as bolitas */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.20]"
          style={{ backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`, backgroundSize: '20px 20px' }}>
        </div>
      </section>

      {/* Destaque */}
      <section className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl border bg-muted flex justify-center">
          <IconSiteTecnologia className="object-cover w-full h-full" />
        </div>

        {/* Card de Destaque */}
        <div className="order-1 lg:order-2 flex flex-col justify-center gap-6 rounded-xl bg-muted/50 p-8 lg:p-10 border shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <breakout.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-semibold tracking-tight">{breakout.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{breakout.description}</p>
          </div>
          <Button className="w-fit gap-2" asChild>
            <a href={breakout.buttonUrl}>
              {breakout.buttonText}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>




      {/* Plano */}
          <section className="max-w-5xl mx-auto rounded-2xl bg-slate-50 dark:bg-card border px-6 py-12 lg:p-16 flex flex-col items-center text-center gap-6 w-full">
        <h2 className="text-3xl font-bold tracking-tight lg:text-4xl"> Planos de Negócios </h2>

        <p className="text-muted-foreground max-w-2xl">
          Oferecemos modelos de contratação adaptáveis, projetados para escalar com o seu crescimento. Seja você uma pequena empresa ou uma grande empresa, temos uma solução de monitoramento de estoque que se encaixa perfeitamente às suas necessidades operacionais e financeiras.
        </p>

        <Button className="w-fit gap-2 " asChild>
          <a href="/contato">
            Entre em contato para saber mais
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </section>


    </main>
  );
};

export { About };
