"use client"; // Necessário para usar onClick e interatividade

import React from "react";
import { IconSiteSobre } from "@/components/ui/icons-geral";
import { Button } from "@/components/ui/button";
import { Package, Users, Scale, Award, ArrowRight, TrendingUp, ArrowDown } from "lucide-react"; // Adicionei ArrowDown

const defaultAchievements = [
  { icon: Package, label: "Produtos Monitorados", value: "50k+" },
  { icon: Users, label: "Clientes Atendidos", value: "1.2k+" },
  { icon: Scale, label: "Precisão de Inventário", value: "99,5%" },
  { icon: Award, label: "Premiações Recebidas", value: "5+" },
];

const About = ({
  title = "Sobre a LogPack",
  description = "Somos especialistas em inteligência logística. Nossas soluções de monitoramento de estoque e controle de peso em tempo real ajudam negócios a eliminar perdas e maximizar a eficiência operacional.",
  achievementsTitle = "Impacto Real em Números",
  achievementsDescription = "Resultados mensuráveis que transformam a operação dos nossos parceiros, reduzindo desperdícios e aumentando a margem de lucro.",
  achievements = defaultAchievements,
} = {}) => {


  const scrollToIoT = () => {
    const element = document.getElementById("target-iot");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.warn("Elemento 'target-iot' não encontrado na página.");
    }
  };

  return (
    <main className="w-full flex flex-col bg-background text-foreground overflow-x-hidden">
      <section className="relative py-18 container mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          <div className="flex flex-col gap-8 max-w-2xl">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-primary shadow-sm w-fit">
                <TrendingUp className="mr-2 h-3.5 w-3.5" />
                IoT & Tecnologia Avançada
              </div>

              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground">
                {title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed lg:text-xl border-l-4 border-primary/20 pl-6">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {/* BOTÃO COM AÇÃO DE SCROLL ADICIONADA */}
              <Button
                onClick={scrollToIoT}
                size="lg"
                className="group h-12 px-8 text-base shadow-lg shadow-primary/20 cursor-pointer"
              >
                Conheça nossa tecnologia
                <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>

            </div>
          </div>

          <div className="relative w-full max-w-lg lg:max-w-none mx-auto lg:ml-auto perspective-1000">
            <div className="absolute -inset-4 rounded-4xl bg-linear-to-tr from-primary/20 via-transparent to-primary/5 blur-2xl -z-10" />

            <div className="relative bg-card rounded-4xl border dark:border-border border-[#7a7a7a71] p-2 shadow-2xl">
              <div className="bg-muted/30 rounded-3xl overflow-hidden aspect-4/3 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <div className="z-10 w-full h-full p-8 flex items-center justify-center transform transition-transform duration-500 hover:scale-[1.02]">
                  <IconSiteSobre className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- SEÇÃO DE CONQUISTAS / NÚMEROS --- */}
      <section className="py-16 bg-muted/30 border-y dark:border-border border-[#7a7a7a71]">
        <div className="container mx-auto px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row gap-12 lg:items-start lg:justify-between mb-12">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {achievementsTitle}
              </h2>
              <p className="text-muted-foreground text-lg">
                {achievementsDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between p-6 bg-card rounded-xl border dark:border-border border-[#7a7a7a71] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
                >
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.value}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SEÇÃO CTA / PLANOS --- */}
      <section className="py-20 lg:py-32 container mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-card border dark:border-border border-[#7a7a7a71] shadow-2xl">

          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-(--background-button)/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-10">

            <div className="max-w-2xl space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Planos flexíveis para o seu crescimento
              </h2>
              <p className="text-lg text-muted-foreground">
                Não importa o tamanho da sua operação, temos uma solução de monitoramento de estoque que se encaixa perfeitamente ao seu orçamento.
              </p>
            </div>

            <div className="shrink0">
              <Button
                asChild
                className="h-14 px-8 text-lg rounded-full shadow-xl transition-transform hover:scale-105"
              >
                <a href="/contato" className="flex items-center gap-2">
                  Ver Planos de Negócios
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export { About };