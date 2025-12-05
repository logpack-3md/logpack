"use client";

import React from 'react';
import { Package, Users, ShoppingBag, Store, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({ title, value, change, Icon, colorVar, index }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const barWidth = Math.min(Math.abs(change) * 20, 100);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {value.toLocaleString()}
          </h3>
        </div>
        
        {/* Icon Box */}
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 border border-border transition-colors group-hover:bg-muted"
        >
          <Icon 
            className="w-5 h-5" 
            style={{ color: `var(${colorVar})` }} 
          />
        </div>
      </div>

      {/* Seção de Status / Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium">
            {isPositive ? (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                {change}%
              </span>
            ) : isNeutral ? (
              <span className="flex items-center gap-0.5 text-muted-foreground">
                <Minus className="h-3 w-3" />
                0%
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-red-600 dark:text-red-500">
                <ArrowDownRight className="h-3 w-3" />
                {Math.abs(change)}%
              </span>
            )}
            <span className="text-muted-foreground ml-1">vs. semana anterior</span>
        </div>
      </div>

      {/* Barra de Progresso Decorativa */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${barWidth === 0 ? 5 : barWidth}%`,
            backgroundColor: `var(${colorVar})`,
            opacity: 0.8
          }}
        />
      </div>
    </div>
  );
};

export default function DataStats() {
  // Dados simulados
  const stats = [
    {
      title: "Novos Pedidos",
      value: 1368,
      change: 4.3,
      Icon: Package,
      colorVar: "--color-chart-1"
    },
    {
      title: "Novos Clientes",
      value: 785,
      change: 0.39,
      Icon: Users,
      colorVar: "--color-chart-2"
    },
    {
      title: "Vendas Online",
      value: 795,
      change: -1.39,
      Icon: ShoppingBag,
      colorVar: "--color-chart-3"
    },
    {
      title: "Vendas Loja Física",
      value: 573,
      change: 2.69,
      Icon: Store,
      colorVar: "--color-chart-4"
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            index={index}
            {...stat}
          />
        ))}
      </div>
    </div>
  );
}