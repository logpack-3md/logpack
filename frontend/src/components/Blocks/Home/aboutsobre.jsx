"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Zap, BarChart3, CheckCircle2, Layers, ChevronRight } from "lucide-react";

const iotSensor = "/images/iot-sensor.jpeg";
const mobile = "/images/Mobile3.png";

const services = [
  {
    title: "Sensores IoT",
    image: iotSensor,
    category: "Monitoramento",
    description: "Nossos sensores IoT monitoram a condição e a localização dos seus produtos em tempo real, garantindo a integridade da sua carga e fornecendo dados cruciais para a tomada de decisões.",
  },
  {
    title: "App Mobile",
    image: mobile,
    category: "Desenvolvimento",
    description: "Desenvolvemos aplicativos móveis intuitivos para que sua equipe possa gerenciar o estoque, acompanhar entregas e se comunicar de forma eficiente, tudo na palma da mão.",
  },
  {
    title: "Gestão de Estoque",
    image: "https://www.busup.com/hubfs/Imported_Blog_Media/estoque-baguncado-1024x683.jpg",
    category: "Automação",
    description: "Automatize seu controle de estoque com nossa plataforma. Evite perdas, otimize o espaço e saiba exatamente o que você tem e onde está, a qualquer momento.",
  },
  {
    title: "Otimização Logística",
    image: "https://admin.ecommercebrasil.com.br/wp-content/uploads/2023/04/20-estoque-fulfillment.jpg.webp",
    category: "Inteligência",
    description: "Utilizamos algoritmos avançados para planejar as melhores rotas, consolidar cargas e otimizar toda a sua operação logística, resultando em economia de tempo e dinheiro.",
  },
  {
    title: "Planos Personalizados",
    image: "https://facil123.com.br/wp-content/uploads/as-5-melhores-dicas-para-uma-gestao-de-estoque-eficiente.jpg",
    category: "Consultoria",
    description: "Entendemos que cada negócio é único. Por isso, oferecemos planos personalizados que se adaptam perfeitamente às suas necessidades específicas e ao seu orçamento.",
  },
];

const AboutSobre = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <section className="relative w-full bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 lg:px-10">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">

            {/* Coluna de Texto */}
            <div className="flex flex-col lg:col-span-1">
              <div className="lg:sticky space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-primary shadow-sm w-fit">
                    <Layers className="h-3.5 w-3.5" />
                    Soluções Integradas
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
                    Logística Inteligente para seu Negócio
                  </h2>

                  <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-primary/20 pl-4">
                    Da gestão de estoque ao rastreamento em tempo real, nossa missão é
                    impulsionar seu negócio. Automatize processos, reduza desperdícios e
                    ganhe visibilidade total com a plataforma <span className="text-primary font-semibold" id="target-iot" >LOGPACK</span>.
                  </p>
                </div>

                <div className="hidden lg:block p-6 rounded-2xl bg-muted/30 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Por que nos escolher?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" /> Tecnologia de Ponta
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" /> Redução de Custos Operacionais
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" /> Suporte Especializado
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col gap-1">
                    <Zap className="h-5 w-5 text-primary mb-2" />
                    <span className="text-2xl font-bold text-foreground">99.8%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Precisão</span>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col gap-1">
                    <BarChart3 className="h-5 w-5 text-primary mb-2" />
                    <span className="text-2xl font-bold text-foreground">-30%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Custo Operacional</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {["Monitoramento 24/7 em Tempo Real", "Integração total via API", "Suporte Técnico Especializado"].map((item, i) => (

                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item}</span>
                    </div>

                  ))}
                </div>


              </div>
            </div>


            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.slice(0, 2).map((service, idx) => (
                  <ServiceCard
                    key={idx}
                    service={service}
                    onClick={() => setSelectedService(service)}
                    aspect="aspect-[4/5] md:aspect-[3/4]"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {services.slice(2).map((service, idx) => (
                  <ServiceCard
                    key={idx + 2}
                    service={service}
                    onClick={() => setSelectedService(service)}
                    aspect="aspect-video md:aspect-[4/5]"
                    smallText
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <Popup service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

const ServiceCard = ({ service, onClick, aspect, smallText }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 w-full ${aspect}`}
    >

      <div className="absolute inset-0 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Conteúdo */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-xs font-medium text-primary/90 mb-1 uppercase tracking-wider">
            {service.category}
          </p>
          <h3 className={`${smallText ? 'text-lg' : 'text-xl'} font-bold text-white mb-2 leading-tight`}>
            {service.title}
          </h3>
          <div className="h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100">
            <p className="text-xs text-slate-300 line-clamp-2">
              Clique para saber mais
            </p>
          </div>
        </div>
      </div>

      {/* Ícone de Seta */}
      <div className="absolute top-4 right-4 rounded-full bg-white/10 p-2 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-primary group-hover:text-black">
        <ArrowUpRight className="h-5 w-5 text-white group-hover:text-primary-foreground" />
      </div>
    </motion.div>
  );
};

// Componente de Popup Refatorado
const Popup = ({ service, onClose }) => {
  useEffect(() => {
    // Trava o scroll do body quando o modal abre
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop com Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
      />

      {/* Card do Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Lado Esquerdo: Imagem */}
        <div className="relative h-64 w-full md:h-auto md:w-1/2">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden" />
          <div className="absolute bottom-4 left-4 md:hidden text-white">
            <p className="text-sm opacity-80">{service.category}</p>
            <h3 className="text-2xl font-bold">{service.title}</h3>
          </div>
        </div>

        {/* Lado Direito: Conteúdo */}
        <div className="flex w-full flex-col p-6 md:p-10 md:w-1/2 overflow-y-auto">
          <div className="hidden md:block mb-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {service.category}
            </span>
          </div>

          <h3 className="hidden md:block text-3xl font-bold text-foreground mb-6">
            {service.title}
          </h3>

          <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
            <p className="text-base">{service.description}</p>
            <p className="mt-4">
              A LogPack oferece integração total desta funcionalidade com seu ERP atual.
              Entre em contato para uma demonstração técnica.
            </p>
          </div>
        </div>

        {/* Botão Fechar Absoluto (X) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-background/50 p-2 text-foreground backdrop-blur-md transition-colors hover:bg-destructive hover:text-white md:right-6 md:top-6"
        >
          <X size={20} />
          <span className="sr-only">Fechar</span>
        </button>
      </motion.div>
    </div>
  );
};

export { AboutSobre };