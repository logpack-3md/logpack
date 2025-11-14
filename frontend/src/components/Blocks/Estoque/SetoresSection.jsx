// src/components/Blocks/Setores/SetoresSection.jsx
'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const iconMap = {
  insumo: Shield,
  embalagem: Shield,
  acessório: Shield,
  suporte: Shield,
  proteção: Shield,
};

const getRandomColor = () => {
  const colors = ['bg-blue-100', 'bg-orange-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-teal-100'];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
  const [allSetores, setAllSetores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetores = async () => {
      setLoading(true);
      try {
        const response = await api.get('setor?limit=1000');

        if (response?.error) {
          toast.error(response.message || 'Erro ao carregar setores');
          return;
        }

        const data = Array.isArray(response) ? response : response.data || response.setores || [];

        const formatted = data.map(setor => ({
          id: setor.id || setor._id,
          name: setor.name || setor.nome || 'Sem nome',
          bgColor: getRandomColor(),
          tipo: (setor.name || setor.nome || '').toLowerCase(),
          ultima: formatLastCheck(setor.updatedAt || setor.last_check),
        }));

        setAllSetores(formatted);
        setSetores(formatted);
        toast.success(`Carregados ${formatted.length} setores`);
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
    return <div className="text-center py-8">Carregando setores...</div>;
  }

  if (setores.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum setor encontrado.</div>;
  }

  return (
    <div className="-mx-6 px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Setores</h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            {setores.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {setores.map((setor) => {
          const Icon = iconMap[setor.tipo] || Shield;
          const colorKey = setor.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
          const textColor = `text-${colorKey}-600`;

          return (
            <Link key={setor.id} href={`/dashboard/manager/setores/${setor.id}`} className="block group">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${setor.bgColor} ${textColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate max-w-[130px]">{setor.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 text-xs border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-gray-500">Última atualização</p>
                    <p className="font-medium text-gray-900 flex items-center mt-0.5">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {setor.ultima}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/dashboard/manager/setores" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Ver todos
          <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}