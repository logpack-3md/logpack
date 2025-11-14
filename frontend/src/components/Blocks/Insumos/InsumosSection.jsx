// src/components/Blocks/Insumos/InsumosSection.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { RiArrowRightUpLine, RiLayoutGridLine, RiListCheck } from '@remixicon/react';
import { Package, Droplets, Box, FileText, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const colorOptions = [
  'bg-cyan-100', 'bg-amber-100', 'bg-orange-100', 'bg-yellow-100',
  'bg-purple-100', 'bg-teal-100', 'bg-pink-100', 'bg-emerald-100',
  'bg-blue-100', 'bg-indigo-100', 'bg-fuchsia-100', 'bg-gray-100',
];

const iconMap = {
  insumo: Droplets,
  embalagem: Box,
  acessório: FileText,
  suporte: Package,
  proteção: Shield,
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

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        // TENTA COM LIMIT E PAGE
        let response;
        try {
          response = await api.get('insumos?limit=6&page=1');
        } catch (err) {
          // SE FALHAR, PEGA TODOS E FILTRA NO FRONT
          response = await api.get('insumos');
        }

        if (!response || response.error) {
          console.error('Erro ao carregar insumos:', response?.message);
          setData([]);
          return;
        }

        let insumos = response.data || [];

        // SE NÃO TEM PAGINAÇÃO, PEGA OS ÚLTIMOS 6
        if (!response.meta) {
          insumos = insumos.slice(-6); // últimos 6 criados
        }

        const mappedData = insumos.map((insumo, index) => ({
          id: insumo.id || insumo._id,
          name: insumo.name,
          description: insumo.SKU,
          bgColor: colorOptions[index % colorOptions.length],
          href: `/dashboard/admin/insumos`, // ou `/insumos/${insumo.id}`
          details: [
            { type: 'Tipo', value: insumo.setorName?.toLowerCase() || 'insumo' },
            { type: 'Última reposição', value: timeAgo(insumo.last_check || insumo.updatedAt) },
          ],
        }));

        setData(mappedData);
      } catch (error) {
        console.error('Erro ao fetch insumos:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsumos();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Carregando insumos...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum insumo encontrado.</div>;
  }

  return (
    <div className="-mx-6 px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Insumos</h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            {data.length}
          </span>
        </div>

        <div className="flex space-x-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
            <RiLayoutGridLine className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-gray-800' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
            <RiListCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => <MemberCard key={member.id} member={member} />)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Insumo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Última reposição</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((member) => <MemberRow key={member.id} member={member} />)}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Link href="/dashboard/admin/insumos" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Ver mais
          <RiArrowRightUpLine className="ml-1.5 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

const MemberCard = ({ member }) => {
  const key = member.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
  const iconColor = `text-${key}-500`;
  const Icon = iconMap[member.details[0].value] || Package;

  return (
    <a href={member.href} className="block group">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow transition-shadow duration-200 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 truncate max-w-[130px]">{member.name}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{member.description}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-200 pt-3">
          <div><p className="text-gray-500">Tipo</p><p className="font-medium text-gray-900 flex items-center mt-0.5"><Shield className="w-3.5 h-3.5 mr-1 text-gray-400" />{member.details[0].value}</p></div>
          <div><p className="text-gray-500">Última reposição</p><p className="font-medium text-gray-900 flex items-center mt-0.5"><Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />{member.details[1].value}</p></div>
        </div>
        <RiArrowRightUpLine className="absolute right-3 top-3 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  );
};

const MemberRow = ({ member }) => {
  const key = member.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
  const iconColor = `text-${key}-500`;
  const Icon = iconMap[member.details[0].value] || Package;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 rounded-lg ${iconColor} bg-opacity-10`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{member.name}</p>
            <p className="text-sm text-gray-500">{member.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">{member.details[0].value}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{member.details[1].value}</td>
      <td className="px-4 py-3 text-right">
        <a href={member.href} className="text-sm font-medium text-blue-600 hover:underline">Editar</a>
      </td>
    </tr>
  );
};