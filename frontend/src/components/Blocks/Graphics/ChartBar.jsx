'use client';

import React, { useState } from 'react';
import { AreaChart, BarChart, LineChart } from '@tremor/react';
import { 
  BarChart3, 
  Activity, 
  LineChart as LineChartIcon, 
  MoreHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const chartdata = [
  { date: 'Jan 23', SolarPanels: 2890, Inverters: 2338 },
  { date: 'Feb 23', SolarPanels: 2756, Inverters: 2103 },
  { date: 'Mar 23', SolarPanels: 3322, Inverters: 2194 },
  { date: 'Apr 23', SolarPanels: 3470, Inverters: 2108 },
  { date: 'May 23', SolarPanels: 3475, Inverters: 1812 },
  { date: 'Jun 23', SolarPanels: 3129, Inverters: 1726 },
  { date: 'Jul 23', SolarPanels: 3490, Inverters: 1982 },
  { date: 'Aug 23', SolarPanels: 2903, Inverters: 2012 },
  { date: 'Sep 23', SolarPanels: 2643, Inverters: 2342 },
  { date: 'Oct 23', SolarPanels: 2837, Inverters: 2473 },
  { date: 'Nov 23', SolarPanels: 2954, Inverters: 3848 },
  { date: 'Dec 23', SolarPanels: 3239, Inverters: 3736 },
];

const chartColors = ["indigo", "rose"];

export default function AnalyticsCard() {
  const [activeChart, setActiveChart] = useState('area');

  const formatter = (number) => {
    return Intl.NumberFormat('us').format(number).toString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto   sm:px-6">
      
      {/* Header com Título e Seletor */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-3 p-2">
        <div>
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Análise de Dados
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Insumos em Tempo Real
          </h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
        <div className="flex items-center p-1 space-x-1 rounded-lg bg-muted border border-border">
          <ChartTypeButton 
            isActive={activeChart === 'area'} 
            onClick={() => setActiveChart('area')}
            icon={<Activity className="w-4 h-4" />}
            label="Área"
          />
          <ChartTypeButton 
            isActive={activeChart === 'bar'} 
            onClick={() => setActiveChart('bar')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Barras"
          />
          <ChartTypeButton 
            isActive={activeChart === 'line'} 
            onClick={() => setActiveChart('line')}
            icon={<LineChartIcon className="w-4 h-4" />}
            label="Linha"
          />
            </div>
        </div>

      {/* Container do Gráfico */}
      <div className="relative w-full rounded-xl border border-border bg-card shadow-sm p-2 sm:p-6 transition-all duration-300">
        
        {/* Efeito visual decorativo no topo */}
        <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-border to-transparent opacity-50" />

        <div className="h-[350px] sm:h-[400px] w-full mt-4">
          <AnimatePresence mode="wait">
            {activeChart === 'area' && (
              <motion.div
                key="area"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <AreaChart
                  className="h-full"
                  data={chartdata}
                  index="date"
                  categories={['SolarPanels', 'Inverters']}
                  colors={chartColors}
                  valueFormatter={formatter}
                  yAxisWidth={48}
                  showAnimation={true}
                />
              </motion.div>
            )}

            {activeChart === 'bar' && (
              <motion.div
                key="bar"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <BarChart
                  className="h-full"
                  data={chartdata}
                  index="date"
                  categories={['SolarPanels', 'Inverters']}
                  colors={chartColors}
                  valueFormatter={formatter}
                  yAxisWidth={48}
                  showAnimation={true}
                />
              </motion.div>
            )}

            {activeChart === 'line' && (
              <motion.div
                key="line"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <LineChart
                  className="h-full"
                  data={chartdata}
                  index="date"
                  categories={['SolarPanels', 'Inverters']}
                  colors={chartColors}
                  valueFormatter={formatter}
                  yAxisWidth={48}
                  showAnimation={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rodapé do Card com resumo ou legenda extra */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm" />
                <span>Painéis Solares</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
                <span>Inversores</span>
             </div>
          </div>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <MoreHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Detalhes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChartTypeButton({ isActive, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background
        ${
          isActive
            ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
        }
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}