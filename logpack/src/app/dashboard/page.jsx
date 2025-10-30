// app/page.jsx
"use client";

import { AnimatedIconGrid } from "@/components/dashboard/AnimatedIconGrid";
import { CardHoverEffectDemo, projects } from "@/components/dashboard/Card3D/CardHoverDemo";
import { GlowingEffectDemo } from "@/components/dashboard/Glowing/GlowingDemo";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/dashboard/tabs";
import {
  SidebarAdmin,
  OverviewSection,
  RecentActivitiesSection,
  OrderStatusSection,
  AverageValuesContent,
  ConfigurableAnalysisContent,
  FilterAnalysisContent,
} from "@/components/dashboard/Sidebar/SidebarAdmin";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 flex">
      {/* Sidebar não fixa */}
     

      {/* Conteúdo principal */}
      <div className="flex-1 pl-6">
        <h2 className="text-3xl font-bold mb-8">LogPack Dashboard</h2>

        {/* Conteúdo do Dashboard (Gráficos, Tabelas) */}
        <div className="mb-12">
          <Tabs defaultValue="value-comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-2">
              <TabsTrigger value="value-comparison">Comparação de Valores</TabsTrigger>
              <TabsTrigger value="average-values">Valores Médios</TabsTrigger>
              <TabsTrigger value="configurable-analysis">Análise Configurável</TabsTrigger>
              <TabsTrigger value="filter-analysis">Análise de Filtros</TabsTrigger>
            </TabsList>
            <TabsContent value="value-comparison">
              <CardHoverEffectDemo items={[projects[0]]} />
              <OverviewSection />
              <GlowingEffectDemo />
              <div className="grid gap-4 md:grid-cols-2">
                <RecentActivitiesSection />
                <OrderStatusSection />
              </div>
            </TabsContent>
            <TabsContent value="average-values">
              <CardHoverEffectDemo items={[projects[1]]} />
              <AverageValuesContent />
            </TabsContent>
            <TabsContent value="configurable-analysis">
              <CardHoverEffectDemo items={[projects[2]]} />
              <ConfigurableAnalysisContent />
            </TabsContent>
            <TabsContent value="filter-analysis">
              <CardHoverEffectDemo items={[projects[3]]} />
              <FilterAnalysisContent />
            </TabsContent>
          </Tabs>
        </div>

        {/* Seção de Cards Animados */}
        <AnimatedIconGrid />
      </div>
    </div>
  );
}