'use client';

import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function WelcomeCard() {
  return (
    <div className="h-full bg-card rounded-xl border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 relative overflow-hidden group">
      
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Zap className="w-24 h-24 text-primary rotate-12" />
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
        {/* Ícone Container */}
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Acessar últimos pedidos
            </h3>
            
            {/* Badge */}
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              Disponível agora
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            Acompanhe o fluxo de vendas e atualizações de status em tempo real. Clique abaixo para gerenciar.
          </p>

          <div className="pt-2">
            <a
              href="/dashboard/admin/pedidos"
              className="group/btn inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver Pedidos
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}