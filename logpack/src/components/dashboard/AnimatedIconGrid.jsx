"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/dashboard/card";
import { Button } from "@/components/dashboard/button";
import {
  Package,
  Droplet,
  Leaf,
  Flame,
  Wrench,
  Recycle,
  Truck,
  Gauge,
  Sparkles,
  Layers,
  Anchor,
  Sprout,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Fibroplast",
    description: "Material compósito leve para embalagens sustentáveis.",
    slug: "fibroplast",
  },
  {
    icon: Droplet,
    title: "AquaGel",
    description: "Gel absorvente para transporte de líquidos sensíveis.",
    slug: "aquagel",
  },
  {
    icon: Leaf,
    title: "Biofibra",
    description: "Fibra vegetal biodegradável para reforço estrutural.",
    slug: "biofibra",
  },
  {
    icon: Flame,
    title: "Termocor",
    description: "Revestimento térmico resistente a altas temperaturas.",
    slug: "termocor",
  },
  {
    icon: Wrench,
    title: "Metacrom",
    description: "Liga metálica leve para componentes mecânicos.",
    slug: "metacrom",
  },
  {
    icon: Recycle,
    title: "Reciclax",
    description: "Polímero reciclado para produção circular.",
    slug: "reciclax",
  },
  {
    icon: Truck,
    title: "Logistite",
    description: "Material otimizado para logística de alta densidade.",
    slug: "logistite",
  },
  {
    icon: Gauge,
    title: "Pressol",
    description: "Composto pressurizado para vedação industrial.",
    slug: "pressol",
  },
  {
    icon: Sparkles,
    title: "Luminar",
    description: "Material reflexivo para sinalização avançada.",
    slug: "luminar",
  },
  {
    icon: Layers,
    title: "Stratoflex",
    description: "Camadas flexíveis para embalagens multicamadas.",
    slug: "stratoflex",
  },
  {
    icon: Anchor,
    title: "Duracem",
    description: "Cimento reforçado para bases logísticas.",
    slug: "duracem",
  },
  {
    icon: Sprout,
    title: "Ecosint",
    description: "Resina ecológica para impressão 3D sustentável.",
    slug: "ecosint",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function AnimatedIconGrid() {
  const router = useRouter();
  const memoizedFeatures = useMemo(() => features, []);

  const handleViewMore = (slug) => {
    router.push(`/dashboard/insumos/${slug}`);
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="py-12"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-foreground"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Insumos LogPack
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {memoizedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="group will-change-transform"
              >
                <Card className="p-6 text-center border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card text-card-foreground h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <motion.div
                      className="mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05, type: "spring", stiffness: 120, damping: 15 }}
                    >
                      <Icon
                        className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </motion.div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <CardDescription className="text-sm mb-4">
                      {feature.description}
                    </CardDescription>

                    <Button
                      variant="outline"
                      className="w-full mt-auto"
                      onClick={() => handleViewMore(feature.slug)}
                    >
                      Ver mais
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}