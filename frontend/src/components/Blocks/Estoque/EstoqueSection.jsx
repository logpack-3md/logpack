// src/components/Blocks/Estoque/EstoqueSection.jsx
'use client';

import { Card } from '@tremor/react';
import Link from 'next/link';

const estoqueData = [
  { area: 'Área 1 - Norte', produto: 'Água Mineral', quantidade: '1.240', unidade: 'unidades', preenchimento: 78 },
  { area: 'Área 2 - Sul', produto: 'Óleo Lubrificante', quantidade: '980', unidade: 'unidades', preenchimento: 62 },
  { area: 'Área 3 - Leste', produto: 'Caixa de Papelão', quantidade: '1.560', unidade: 'unidades', preenchimento: 91 },
  { area: 'Área 4 - Oeste', produto: 'Fita Adesiva', quantidade: '820', unidade: 'unidades', preenchimento: 54 },
  { area: 'Área 5 - Centro', produto: 'Palete de Madeira', quantidade: '2.100', unidade: 'unidades', preenchimento: 88 },
  { area: 'Área 6 - Reserva', produto: 'Filme Stretch', quantidade: '450', unidade: 'unidades', preenchimento: 33 },
  { area: 'Área 7 - Expedição', produto: 'Etiqueta Adesiva', quantidade: '680', unidade: 'unidades', preenchimento: 71 },
  { area: 'Área 8 - Recebimento', produto: 'Saco Plástico', quantidade: '1.120', unidade: 'unidades', preenchimento: 69 },
  { area: 'Área 9 - Qualidade', produto: 'Espuma Protetora', quantidade: '320', unidade: 'unidades', preenchimento: 25 },
];

export default function EstoqueSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Estoque por Área</h2>

      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {estoqueData.map((item) => {
          const preenchimento = item.preenchimento;
          const corBarra =
            preenchimento >= 80
              ? 'bg-yellow-500'
              : preenchimento >= 60
              ? 'bg-yellow-500'
              : preenchimento >= 40
              ? 'bg-yellow-500'
              : 'bg-orange-500';

          return (
            <Card
              key={item.area}
              className="hover:shadow-md transition-shadow border border-gray-200 bg-white p-5"
            >
              {/* Nome da Área */}
              <dt className="text-sm font-medium text-gray-700">{item.area}</dt>

              {/* Produto */}
              <dd className="text-xs text-gray-500 mt-1">{item.produto}</dd>

              {/* Quantidade */}
              <dd className="flex items-baseline space-x-1 text-gray-900 mt-2">
                <span className="text-2xl font-bold">{item.quantidade}</span>
                <span className="text-sm text-gray-500">{item.unidade}</span>
              </dd>

              {/* Barra de Preenchimento */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Preenchimento</span>
                  <span>{preenchimento}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${corBarra} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${preenchimento}%` }}
                  />
                </div>
              </div>

              {/* Link invisível para detalhe */}
              <Link href={`/estoque/${item.area.toLowerCase().replace(/ /g, '-')}`} className="absolute inset-0">
                <span className="sr-only">Ver detalhes de {item.area}</span>
              </Link>
            </Card>
          );
        })}
      </dl>

      {/* BOTÃO VER MAIS */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/dashboard/estoque"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Ver mais
          <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}