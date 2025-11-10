"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "IOT Sensor Funcionalities",
    image: "https://img.freepik.com/fotos-gratis/trabalhador-de-armazem-que-opera-uma-empilhadeira-em-uma-instalacao-de-armazenamento_23-2151962537.jpg?semt=ais_hybrid&w=740&q=80",
    description: "Nossos sensores IoT monitoram a condição e a localização dos seus produtos em tempo real, garantindo a integridade da sua carga e fornecendo dados cruciais para a tomada de decisões.",
  },
  {
    title: "Mobile App Development",
    image: "https://static.vecteezy.com/ti/fotos-gratis/p2/6024482-a-empilhadeira-esta-trabalhando-no-armazem-gratis-foto.jpg",
    description: "Desenvolvemos aplicativos móveis intuitivos para que sua equipe possa gerenciar o estoque, acompanhar entregas e se comunicar de forma eficiente, tudo na palma da mão.",
  },
  {
    title: "Gerenciamento de Estoque",
    image: "https://www.busup.com/hubfs/Imported_Blog_Media/estoque-baguncado-1024x683.jpg",
    description: "Automatize seu controle de estoque com nossa plataforma. Evite perdas, otimize o espaço e saiba exatamente o que você tem e onde está, a qualquer momento.",
  },
  {
    title: "Otimizações Logísticas",
    image: "https://admin.ecommercebrasil.com.br/wp-content/uploads/2023/04/20-estoque-fulfillment.jpg.webp",
    description: "Utilizamos algoritmos avançados para planejar as melhores rotas, consolidar cargas e otimizar toda a sua operação logística, resultando em economia de tempo e dinheiro.",
  },
  {
    title: "Planos Personalizados",
    image: "https://facil123.com.br/wp-content/uploads/as-5-melhores-dicas-para-uma-gestao-de-estoque-eficiente.jpg",
    description: "Entendemos que cada negócio é único. Por isso, oferecemos planos personalizados que se adaptam perfeitamente às suas necessidades específicas e ao seu orçamento.",
  },
];

const AboutSobre = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <section className="flex justify-center items-center lg:text-left text-center px-4 lg:px-10">
        <div className="container grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="flex flex-col justify-between lg:col-span-1">
            <div>
              <h2 className="text-foreground mb-4 text-4xl font-medium md:text-4xl">
                Logística Inteligente para seu Negócio
              </h2>
              <p className="text-muted-foreground w-90 text-center lg:text-justify lg:w-110 text-base tracking-tight">
                Oferecemos uma plataforma completa para otimizar sua cadeia de
                suprimentos. Da gestão de estoque ao rastreamento em tempo real,
                garantimos eficiência e visibilidade total. Nossa missão é
                impulsionar seu negócio com uma plataforma completa que otimiza
                cada etapa da sua cadeia de suprimentos. Automatize a gestão de
                estoque para reduzir desperdícios, planeje rotas eficientes para
                diminuir custos de frete e proporcione visibilidade total com
                rastreamento preciso e em tempo real. Com as ferramentas da
                LOGPACK, você ganha agilidade, precisão e a confiança
                necessária para superar as expectativas dos seus clientes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
            {services.slice(0, 2).map((service, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedService(service)}
                whileHover={{ scale: 1.02 }}
                className="group block overflow-hidden rounded-xl cursor-pointer"
              >
                <Card className="relative aspect-[3/4] overflow-hidden p-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <CardContent className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="font-semibold text-lg text-white">
                      {service.title}
                    </div>
                  </CardContent>
                  <ArrowUpRight className="absolute right-6 top-6 h-6 w-6 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Card>
              </motion.div>
            ))}

            <div className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-3">
              {services.slice(2).map((service, idx) => (
                <motion.div
                  key={idx + 2}
                  onClick={() => setSelectedService(service)}
                  whileHover={{ scale: 1.02 }}
                  className="group block overflow-hidden rounded-xl cursor-pointer"
                >
                  <Card className="relative aspect-[4/3] overflow-hidden p-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <CardContent className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="text-sm font-semibold text-white">
                        {service.title}
                      </div>
                    </CardContent>
                    <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Card>
                </motion.div>
              ))}
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

const Popup = ({ service, onClose }) => {
  const popupRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden"
      >
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
          <p className="text-muted-foreground flex-grow">{service.description}</p>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export { AboutSobre };