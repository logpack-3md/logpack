// app/dashboard/12/insumos/[slug]/page.jsx
import { notFound } from "next/navigation";
import Link from "next/link";

const insumos = {
  // 1. OK
  fibroplast: {
    title: "Fibroplast",
    description: "Material compósito leve para embalagens sustentáveis.",
    specs: ["Leve", "Resistente", "100% reciclável"],
    image: "/images/fibroplast.jpg",
  },
  // 2. OK
  aquagel: {
    title: "AquaGel",
    description: "Gel absorvente para transporte de líquidos sensíveis.",
    specs: ["Absorção rápida", "Seguro para alimentos", "Biodegradável"],
    image: "/images/aquagel.jpg",
  },
  // 3. FALTAVA
  biofibra: {
    title: "Biofibra",
    description: "Fibra vegetal biodegradável para reforço estrutural.",
    specs: ["Natural", "Alta resistência", "Compostável"],
    image: "/images/biofibra.jpg",
  },
  // 4. FALTAVA
  termocor: {
    title: "Termocor",
    description: "Revestimento térmico resistente a altas temperaturas.",
    specs: ["Até 800°C", "Isolante", "Durável"],
    image: "/images/termocor.jpg",
  },
  // 5. FALTAVA
  metacrom: {
    title: "Metacrom",
    description: "Liga metálica leve para componentes mecânicos.",
    specs: ["Baixa densidade", "Alta resistência", "Corrosão zero"],
    image: "/images/metacrom.jpg",
  },
  // 6. FALTAVA
  reciclax: {
    title: "Reciclax",
    description: "Polímero reciclado para produção circular.",
    specs: ["100% reciclado", "Forte", "Econômico"],
    image: "/images/reciclax.jpg",
  },
  // 7. FALTAVA
  logistite: {
    title: "Logistite",
    description: "Material otimizado para logística de alta densidade.",
    specs: ["Compacto", "Resistente a impacto", "Leve"],
    image: "/images/logistite.jpg",
  },
  // 8. FALTAVA
  pressol: {
    title: "Pressol",
    description: "Composto pressurizado para vedação industrial.",
    specs: ["Alta pressão", "Vedação perfeita", "Seguro"],
    image: "/images/pressol.jpg",
  },
  // 9. FALTAVA
  luminar: {
    title: "Luminar",
    description: "Material reflexivo para sinalização avançada.",
    specs: ["Reflexão 98%", "Visível à noite", "Durável"],
    image: "/images/luminar.jpg",
  },
  // 10. FALTAVA
  stratoflex: {
    title: "Stratoflex",
    description: "Camadas flexíveis para embalagens multicamadas.",
    specs: ["Flexível", "Resistente", "Personalizável"],
    image: "/images/stratoflex.jpg",
  },
  // 11. FALTAVA
  duracem: {
    title: "Duracem",
    description: "Cimento reforçado para bases logísticas.",
    specs: ["Alta carga", "Rápido endurecimento", "Resistente"],
    image: "/images/duracem.jpg",
  },
  // 12. FALTAVA
  ecosint: {
    title: "Ecosint",
    description: "Resina ecológica para impressão 3D sustentável.",
    specs: ["Biodegradável", "Alta precisão", "Ecológica"],
    image: "/images/ecosint.jpg",
  },
};

export default function InsumoPage({ params }) {
  const { slug } = params;
  const insumo = insumos[slug];

  if (!insumo) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-primary hover:underline">
          ← Voltar ao Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
          {insumo.image ? (
            <img
              src={insumo.image}
              alt={insumo.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-gray-500">Sem imagem</span>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{insumo.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{insumo.description}</p>

          <h2 className="text-xl font-semibold mb-3">Especificações</h2>
          <ul className="space-y-2 mb-8">
            {insumo.specs.map((spec, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-green-500">Check</span> {spec}
              </li>
            ))}
          </ul>

          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition">
            Solicitar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
}