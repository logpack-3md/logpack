// src/components/Blocks/Itens/ItensSection.jsx
'use client';

import React, { useState } from 'react';
import {
  RiArrowRightUpLine,
  RiLayoutGridLine,
  RiListCheck,
} from '@remixicon/react';
import { Package, Droplets, Box, FileText, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

const data = [
  {
    name: 'Água Mineral',
    initial: 'AM',
    bgColor: 'bg-cyan-100',
    email: 'agua@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'insumo' }, { type: 'Última reposição', value: '2h ago' }],
  },
  {
    name: 'Óleo Lubrificante',
    initial: 'OL',
    bgColor: 'bg-amber-100',
    email: 'oleo@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'insumo' }, { type: 'Última reposição', value: '1d ago' }],
  },
  {
    name: 'Caixa de Papelão',
    initial: 'CP',
    bgColor: 'bg-orange-100',
    email: 'caixa@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'embalagem' }, { type: 'Última reposição', value: '30min ago' }],
  },
  {
    name: 'Papelão Ondulado',
    initial: 'PO',
    bgColor: 'bg-yellow-100',
    email: 'papelao@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'embalagem' }, { type: 'Última reposição', value: '3h ago' }],
  },
  {
    name: 'Fita Adesiva',
    initial: 'FA',
    bgColor: 'bg-purple-100',
    email: 'fita@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'acessório' }, { type: 'Última reposição', value: '5h ago' }],
  },
  {
    name: 'Saco Plástico',
    initial: 'SP',
    bgColor: 'bg-teal-100',
    email: 'saco@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'embalagem' }, { type: 'Última reposição', value: '1d ago' }],
  },
  {
    name: 'Etiqueta Adesiva',
    initial: 'EA',
    bgColor: 'bg-pink-100',
    email: 'etiqueta@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'acessório' }, { type: 'Última reposição', value: '4h ago' }],
  },
  {
    name: 'Palete de Madeira',
    initial: 'PM',
    bgColor: 'bg-emerald-100',
    email: 'palete@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'suporte' }, { type: 'Última reposição', value: '2d ago' }],
  },
  {
    name: 'Filme Stretch',
    initial: 'FS',
    bgColor: 'bg-blue-100',
    email: 'stretch@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'embalagem' }, { type: 'Última reposição', value: '6h ago' }],
  },
  {
    name: 'Caixa Plástica',
    initial: 'CP',
    bgColor: 'bg-indigo-100',
    email: 'caixa-plastica@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'embalagem' }, { type: 'Última reposição', value: '1d ago' }],
  },
  {
    name: 'Bobina de Plástico',
    initial: 'BP',
    bgColor: 'bg-fuchsia-100',
    email: 'bobina@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'insumo' }, { type: 'Última reposição', value: '3d ago' }],
  },
  {
    name: 'Espuma Protetora',
    initial: 'EP',
    bgColor: 'bg-gray-100',
    email: 'espuma@estoque.com',
    href: '#',
    details: [{ type: 'Tipo', value: 'proteção' }, { type: 'Última reposição', value: '2h ago' }],
  },
];

/* ------------------------------------------------- */
/* CARD (grid view) */
/* ------------------------------------------------- */
const MemberCard = ({ member }) => {
  const colorMap = {
    cyan: 'text-cyan-500',
    amber: 'text-amber-500',
    orange: 'text-orange-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    teal: 'text-teal-500',
    pink: 'text-pink-500',
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    fuchsia: 'text-fuchsia-500',
    gray: 'text-gray-500',
  };
  const key = member.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
  const iconColor = colorMap[key] || colorMap.blue;

  const iconMap = {
    insumo: Droplets,
    embalagem: Box,
    acessório: FileText,
    suporte: Package,
    proteção: Shield,
  };
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
              <h3 className="text-sm font-medium text-gray-900 truncate max-w-[130px]">
                {member.name}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{member.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-200 pt-3">
          <div>
            <p className="text-gray-500">Tipo</p>
            <p className="font-medium text-gray-900 flex items-center mt-0.5">
              <Shield className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {member.details[0].value}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Última reposição</p>
            <p className="font-medium text-gray-900 flex items-center mt-0.5">
              <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {member.details[1].value}
            </p>
          </div>
        </div>

        <RiArrowRightUpLine
          className="absolute right-3 top-3 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      </div>
    </a>
  );
};

/* ------------------------------------------------- */
/* LIST ROW (table view) */
/* ------------------------------------------------- */
const MemberRow = ({ member }) => {
  const colorMap = {
    cyan: 'text-cyan-500',
    amber: 'text-amber-500',
    orange: 'text-orange-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    teal: 'text-teal-500',
    pink: 'text-pink-500',
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    fuchsia: 'text-fuchsia-500',
    gray: 'text-gray-500',
  };
  const key = member.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
  const iconColor = colorMap[key] || colorMap.blue;

  const iconMap = {
    insumo: Droplets,
    embalagem: Box,
    acessório: FileText,
    suporte: Package,
    proteção: Shield,
  };
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
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">{member.details[0].value}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{member.details[1].value}</td>
      <td className="px-4 py-3 text-right">
        <a href={member.href} className="text-sm font-medium text-blue-600 hover:underline">
          Editar
        </a>
      </td>
    </tr>
  );
};

/* ------------------------------------------------- */
/* MAIN COMPONENT */
/* ------------------------------------------------- */
export default function ItensSection() {
  const [view, setView] = useState('grid');

  return (
    <div className="bg-gray-50 -mx-6 px-6 py-6">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Itens</h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            {data.length}
          </span>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'grid'
                ? 'bg-white shadow-sm text-gray-800'
                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Grid view"
          >
            <RiLayoutGridLine className="w-4 h-4" />
          </button>

          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-white shadow-sm text-gray-800'
                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="List view"
          >
            <RiListCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última reposição
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((member) => (
                <MemberRow key={member.name} member={member} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BOTÃO "VER MAIS" - FORA DO CONDICIONAL, DENTRO DO RETURN */}
      <div className="mt-6 flex justify-end">
        <Link
          href="/produtos"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Ver mais
          <RiArrowRightUpLine className="ml-1.5 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}