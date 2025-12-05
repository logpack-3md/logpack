// src/components/Blocks/Estoque/SetoresSection.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  Layers, 
  Warehouse, 
  Briefcase, 
  Settings, 
  AlertCircle,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Mapa de ícones baseados no nome do tipo/setor
const iconMap = {
  insumo: Warehouse,
  embalagem: Layers,
  acessório: Briefcase,
  suporte: Settings,
  proteção: Shield,
  geral: LayoutDashboard,
};

// Formatação de tempo
const formatLastCheck = (date) => {
  if (!date) return 'Nunca';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return 'agora';
};

export default function SetoresSection() {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetores = async () => {
      setLoading(true);
      try {
        const response = await api.get('setor?limit=6'); // Limitando a 6 para o widget inicial

        if (response?.error) {
          toast.error(response.message || 'Erro ao carregar setores');
          return;
        }

        const data = Array.isArray(response) ? response : response.data || response.setores || [];

        const formatted = data.map((setor, index) => ({
          id: setor.id || setor._id,
          name: setor.name || setor.nome || 'Sem nome',
          tipo: (setor.name || setor.nome || '').toLowerCase(),
          // Cria variável de cor baseada no índice para ciclar as cores do tema (chart-1 a chart-5)
          colorVar: `--color-chart-${(index % 5) + 1}`,
          ultima: formatLastCheck(setor.updatedAt || setor.last_check),
        }));

        setSetores(formatted);
      } catch (err) {
        console.error('Erro ao carregar setores:', err);
        toast.error('Falha ao carregar setores');
      } finally {
        setLoading(false);
      }
    };

    fetchSetores();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
        <span className="text-sm text-muted-foreground">Carregando setores...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6">
      
      {/* HEADER DA SEÇÃO */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Visão Geral de Setores
          </h3>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted-foreground/10">
            {setores.length}
          </span>
        </div>
      </div>

      {/* ESTADO VAZIO */}
      {setores.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-lg bg-muted/20 border-2 border-dashed border-border">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Nenhum setor encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">Comece criando setores para organizar seus insumos.</p> 
        </div>
      ) : (
        /* GRID DE SETORES */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {setores.map((setor) => {
            // Seleciona ícone baseado no tipo ou usa default
            const Icon = Object.entries(iconMap).find(([key]) => setor.tipo.includes(key))?.[1] || LayoutDashboard;

            return (
              <Link 
                key={setor.id} 
                href={`/dashboard/manager/setores/${setor.id}`} 
                className="block group"
              >
                <div className="h-full bg-background rounded-xl p-5 border border-border transition-all duration-200 hover:shadow-md hover:border-primary/30 relative overflow-hidden">
                    
                    <div 
                      className="absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" 
                      style={{ backgroundColor: `var(${setor.colorVar})` }}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-2.5 rounded-lg border border-border/50"
                          style={{ 
                            backgroundColor: `color-mix(in srgb, var(${setor.colorVar}), transparent 90%)`,
                            color: `var(${setor.colorVar})`
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-sm font-semibold text-foreground truncate max-w-[120px]" title={setor.name}>
                            {setor.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border mt-auto">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Atualizado</span>
                        <div className="flex items-center font-medium text-foreground bg-muted/50 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3 mr-1.5 text-muted-foreground" />
                          {setor.ultima}
                        </div>
                      </div>
                    </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}