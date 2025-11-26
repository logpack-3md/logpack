// src/components/Blocks/Insumos/InsumosSection.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { RiArrowRightUpLine, RiLayoutGridLine, RiListCheck, RiCloseLine } from '@remixicon/react';
import { Package, Droplets, Box, FileText, Shield, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const iconMap = {
  insumo: Droplets,
  embalagem: Box,
  acessório: FileText,
  suporte: Package,
  proteção: Shield,
};

// Função auxiliar para gerar classes baseadas nas variáveis --chart do seu CSS
const getChartColorClasses = (index) => {
  // Mapeia para chart-1 até chart-5 baseado no index
  const chartIndex = (index % 5) + 1; 
  const colorName = `chart-${chartIndex}`;
  
  return {
    bg: `bg-${colorName}/20`, // Fundo com transparência usando a cor do tema
    text: `text-${colorName}`, // Cor do texto/ícone
  };
};

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
                console.error('Falha crítica ao buscar insumos:', innerError);
                response = { data: [] };
            }
        }

        const rawData = response?.data ? response.data : [];
        insumos = Array.isArray(rawData) ? rawData : [];

        if (insumos.length > 0 && !response?.meta) {
          insumos = insumos.slice(-6);
        }

        const mappedData = insumos.map((insumo, index) => ({
          id: insumo.id || insumo._id,
          name: insumo.name || 'Sem nome',
          description: insumo.SKU || 'Sem SKU',
          colorIndex: index, // Guardamos o index para gerar a cor no render
          href: `/dashboard/admin/insumos`,
          details: [
            { type: 'Tipo', value: insumo.setorName?.toLowerCase() || 'insumo' },
            { type: 'Última reposição', value: timeAgo(insumo.last_check || insumo.updatedAt) },
          ],
        }));

        setData(mappedData);

        if (mappedData.length === 0) {
            setShowNoDataModal(true);
        }

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

  // Modal Component (Popup)
  const NoDataModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000007a] backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
      <div className="bg-popover border border-border rounded-lg shadow-2xl max-w-sm w-full p-6 relative">
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
            Não foram encontrados insumos cadastrados ou disponíveis no momento. É necessário realizar o cadastro ou reposição.
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
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Gerenciar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando insumos...</div>;
  }

  // Renderização Principal
  return (
    <div className="-mx-6 px-6 py-6 relative bg-background">
      
      {showNoDataModal && <NoDataModal />}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-foreground">Insumos</h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {data.length}
          </span>
        </div>

        <div className="flex space-x-1">
          <button 
            onClick={() => setView('grid')} 
            className={`p-2 rounded-lg transition-colors ${view === 'grid' 
              ? 'bg-card shadow-sm text-foreground border border-border' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            <RiLayoutGridLine className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('list')} 
            className={`p-2 rounded-lg transition-colors ${view === 'list' 
              ? 'bg-card shadow-sm text-foreground border border-border' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            <RiListCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhum insumo encontrado.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Cadastre novos insumos para vê-los aqui.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => <MemberCard key={member.id} member={member} />)}
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Insumo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Última reposição</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {data.map((member) => <MemberRow key={member.id} member={member} />)}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Link 
          href="/dashboard/admin/insumos" 
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          Ver mais
          <RiArrowRightUpLine className="ml-1.5 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

const MemberCard = ({ member }) => {
  // Usa as cores do tema (chart-1, chart-2, etc.)
  const themeColors = getChartColorClasses(member.colorIndex);
  const Icon = iconMap[member.details[0].value] || Package;

  return (
    <a href={member.href} className="block group">
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 relative h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${themeColors.bg} ${themeColors.text}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-card-foreground truncate max-w-[130px]">{member.name}</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{member.description}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-3">
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p className="font-medium text-foreground flex items-center mt-0.5">
              <Shield className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              {member.details[0].value}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Última reposição</p>
            <p className="font-medium text-foreground flex items-center mt-0.5">
              <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              {member.details[1].value}
            </p>
          </div>
        </div>
        <RiArrowRightUpLine className="absolute right-3 top-3 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  );
};

const MemberRow = ({ member }) => {
  const themeColors = getChartColorClasses(member.colorIndex);
  const Icon = iconMap[member.details[0].value] || Package;

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 rounded-lg ${themeColors.bg} ${themeColors.text}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-foreground">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{member.details[0].value}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{member.details[1].value}</td>
      <td className="px-4 py-3 text-right">
        <a href={member.href} className="text-sm font-medium text-primary hover:underline">Editar</a>
      </td>
    </tr>
  );
};