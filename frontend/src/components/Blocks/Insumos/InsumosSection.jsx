'use client';

import React, { useState, useEffect } from 'react';
import { 
  RiLayoutGridLine, 
  RiListCheck, 
  RiCloseLine, 
  RiArrowRightUpLine 
} from '@remixicon/react';
import { 
  Package, 
  Droplets, 
  Box, 
  FileText, 
  Shield, 
  Clock, 
  AlertTriangle,
  Inbox
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const iconMap = {
  insumo: Droplets,
  embalagem: Box,
  acessório: FileText,
  suporte: Package,
  proteção: Shield,
};

// Utilitário para tempo relativo
const timeAgo = (date) => {
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

export default function InsumosSection() {
  const [view, setView] = useState('grid');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoDataModal, setShowNoDataModal] = useState(false);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        let insumos = [];
        let response = null;

        try {
          response = await api.get('insumos?limit=6&page=1');
        } catch (error) {
          console.warn('Falha na paginação, tentando buscar todos:', error);
          try {
            response = await api.get('insumos');
          } catch (innerError) {
            insumos = [];
          }
        }

        const rawData = response?.data || [];
        insumos = Array.isArray(rawData) ? rawData : [];

        if (insumos.length > 0 && !response?.meta) {
          insumos = insumos.slice(-6);
        }

        const mappedData = insumos.map((insumo, index) => ({
          id: insumo.id || insumo._id,
          name: insumo.name || 'Sem nome',
          description: insumo.SKU || 'Sem SKU',
          colorVar: `--color-chart-${(index % 5) + 1}`,
          href: `/dashboard/admin/insumos`,
          details: [
            { type: 'Tipo', value: insumo.setorName?.toLowerCase() || 'insumo' },
            { type: 'Última reposição', value: timeAgo(insumo.last_check || insumo.updatedAt) },
          ],
        }));

        setData(mappedData);
        if (mappedData.length === 0) setShowNoDataModal(true);

      } catch (error) {
        console.error('Erro geral no componente Insumos:', error);
        setData([]);
        setShowNoDataModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInsumos();
  }, []);


  const NoDataModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-popover border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
        <button 
          onClick={() => setShowNoDataModal(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RiCloseLine className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Atenção: Estoque Vazio</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Não foram encontrados insumos recentes. Cadastre novos itens ou verifique a conexão.
          </p>
          <div className="flex w-full gap-3">
             <button 
              onClick={() => setShowNoDataModal(false)}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Fechar
            </button>
            <Link 
              href="/dashboard/admin/insumos" 
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors text-center"
            >
              Gerenciar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden">
      
      {showNoDataModal && <NoDataModal />}

      {/* HEADER DA SEÇÃO */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Insumos Recentes
          </h3>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted-foreground/10">
            {data.length}
          </span>
        </div>

        <div className="flex p-1 space-x-1 rounded-lg bg-muted/50 border border-border">
          <button 
            onClick={() => setView('grid')} 
            aria-label="Visualização em grade"
            className={`p-1.5 rounded-md transition-all ${view === 'grid' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'}`}
          >
            <RiLayoutGridLine className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('list')} 
            aria-label="Visualização em lista"
            className={`p-1.5 rounded-md transition-all ${view === 'list' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'}`}
          >
            <RiListCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/10 border-2 border-dashed border-border rounded-lg">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="text-base font-semibold text-foreground">Nenhum insumo encontrado</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">
            Comece cadastrando novos insumos para monitorar o estoque.
          </p>
        </div>
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item) => (
                <MemberCard key={item.id} member={item} />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full border-collapse text-left text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="border-b border-r border-border py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nome / SKU</th>
                      <th className="border-b border-r border-border py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Tipo</th>
                      <th className="border-b border-r border-border py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Atualização</th>
                      <th className="border-b border-border py-3 px-4 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <MemberRow 
                        key={item.id} 
                        member={item} 
                        isLast={idx === data.length - 1} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* RODAPÉ DO COMPONENTE */}
      <div className="mt-6 pt-4 border-t border-border flex justify-end">
        <Link 
          href="/dashboard/admin/insumos" 
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Ver todos os insumos
          <RiArrowRightUpLine className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

// ----------------------------------------
// Componente CARD (Grid View)
// ----------------------------------------
const MemberCard = ({ member }) => {
  const Icon = iconMap[member.details[0].value] || Package;

  return (
    <Link href={member.href} className="group relative block h-full">
      <div className="relative flex flex-col h-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20 overflow-hidden">
        
        {/* Barra lateral colorida para identidade visual */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: `var(${member.colorVar})` }} 
        />

        <div className="flex items-start justify-between mb-4 pl-2">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center p-2.5 rounded-lg border border-border/50"
              style={{ 
                backgroundColor: `color-mix(in srgb, var(${member.colorVar}), transparent 90%)`,
                color: `var(${member.colorVar})`
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="overflow-hidden">
              <h4 className="font-semibold text-foreground truncate max-w-[140px]" title={member.name}>
                {member.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate" title={member.description}>
                {member.description}
              </p>
            </div>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-3 pl-2">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase">Categoria</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3.5 h-3.5 text-muted-foreground/70" />
              <span className="text-xs font-medium text-foreground capitalize">
                {member.details[0].value}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase">Atualizado</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
              <span className="text-xs font-medium text-foreground">
                {member.details[1].value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ----------------------------------------
// Componente ROW (Table View)
// ----------------------------------------
const MemberRow = ({ member, isLast }) => {
  const Icon = iconMap[member.details[0].value] || Package;

  return (
    <tr className="group bg-card hover:bg-muted/30 transition-colors">
      <td className={`border-r border-border px-4 py-3 ${!isLast ? 'border-b' : ''}`}>
        <div className="flex items-center gap-3">
          <div 
            className="shrink-0 p-2 rounded-md"
            style={{ 
              backgroundColor: `color-mix(in srgb, var(${member.colorVar}), transparent 90%)`,
              color: `var(${member.colorVar})`
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.description}</p>
          </div>
        </div>
      </td>

      <td className={`border-r border-border px-4 py-3 ${!isLast ? 'border-b' : ''}`}>
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground capitalize">
          {member.details[0].value}
        </span>
      </td>

      <td className={`border-r border-border px-4 py-3 ${!isLast ? 'border-b' : ''}`}>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {member.details[1].value}
        </div>
      </td>

      <td className={`px-4 py-3 text-right ${!isLast ? 'border-b border-border' : ''}`}>
        <Link 
          href={member.href} 
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Detalhes
        </Link>
      </td>
    </tr>
  );
};