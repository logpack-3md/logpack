"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


const services = [
  // Imagem real do pedrones
  {
    title: "Web Development",
    image: "https://img.freepik.com/fotos-gratis/trabalhador-de-armazem-que-opera-uma-empilhadeira-em-uma-instalacao-de-armazenamento_23-2151962537.jpg?semt=ais_hybrid&w=740&q=80",
    url: "",
  },
  {
    title: "Mobile App Development",
    image: "https://static.vecteezy.com/ti/fotos-gratis/p2/6024482-a-empilhadeira-esta-trabalhando-no-armazem-gratis-foto.jpg",
    url: "",
  },


  // -----------------------------------------------------------------------------------------------------

  {
    title: "UI/UX Design",
    image: "https://www.busup.com/hubfs/Imported_Blog_Media/estoque-baguncado-1024x683.jpg",
    url: "",
  },
  {
    title: "Digital Marketing",
    image: "https://admin.ecommercebrasil.com.br/wp-content/uploads/2023/04/20-estoque-fulfillment.jpg.webp",
    url: "",
  },
  {
    title: "Cloud Solutions",
    image: "https://facil123.com.br/wp-content/uploads/as-5-melhores-dicas-para-uma-gestao-de-estoque-eficiente.jpg",
    url: "",
  },
];

const AboutSobre = () => {
  return (
    <section className="flex justify-center items-center px-4 lg:px-10">
      <div className="container grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col justify-between lg:col-span-1">
          <div>
            <h2 className="text-foreground mb-4 text-4xl font-medium md:text-4xl">
              Logística Inteligente para seu Negócio
            </h2>
            <p className="text-muted-foreground w-82 text-base tracking-tight">
              Oferecemos uma plataforma completa para otimizar sua cadeia de
              suprimentos. Da gestão de estoque ao rastreamento em tempo real,
              garantimos eficiência e visibilidade total.
              Nossa missão é impulsionar seu negócio com uma plataforma completa que
              otimiza cada etapa da sua cadeia de suprimentos. Automatize a gestão de
              estoque para reduzir desperdícios, planeje rotas eficientes para
              diminuir custos de frete e proporcione visibilidade total com
              rastreamento preciso e em tempo real. Com as ferramentas da LOGPACK,
              você ganha agilidade, precisão e a confiança necessária para superar as
              expectativas dos seus clientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {/* Featured Services - First 2 */}
          {services.slice(0, 2).map((service, idx) => (
            <motion.a
              key={idx}
              href={service.url}
              whileHover={{ opacity: 0.8 }}
              className="group block overflow-hidden rounded-xl"
            >
              <Card className="relative aspect-[3/4] overflow-hidden p-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <CardContent className="absolute inset-0 flex flex-col justify-start p-6">
                  <div className="pr-4 font-semibold text-white">
                    {service.title}
                  </div>
                </CardContent>
                <ArrowUpRight className="absolute right-6 top-6 h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </Card>
            </motion.a>
          ))}

          {/* Secondary Services - Remaining 3 */}
          <div className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-3">
            {services.slice(2).map((service, idx) => (
              <motion.a
                key={idx + 2}
                href={service.url}
                whileHover={{ opacity: 0.8 }}
                className="group block overflow-hidden rounded-xl"
              >
                <Card className="relative aspect-[4/3] overflow-hidden p-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <CardContent className="absolute inset-0 flex flex-col justify-start p-4">
                    <div className="pr-4 text-sm font-semibold text-white">
                      {service.title}
                    </div>
                  </CardContent>
                  <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-white transition-transform group-hover:scale-110" />
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { AboutSobre };

