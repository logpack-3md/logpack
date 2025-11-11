// src/components/Blocks/Graphics/DonutChart.jsx
'use client';

import { DonutChart } from '@tremor/react';

const data = [
  {
    name: 'Imóveis',
    value: 2095920,
  },
  {
    name: 'Ações & ETFs',
    value: 250120,
  },
  {
    name: 'Metais',
    value: 160720,
  },
];

const totalValue = data.reduce((sum, item) => sum + item.value, 0);

const currencyFormatter = (number) =>
  Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(number);

export default function AssetAllocationDonut() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-0">
      <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Alocação de Ativos
      </h3>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        {/* Donut + Total */}
        <div className="flex items-end gap-4">
          <DonutChart
            data={data}
            category="value"
            index="name"
            valueFormatter={currencyFormatter}
            colors={['blue', 'violet', 'fuchsia']}
            className="h-24 w-24"
            showLabel={false}
            variant="donut"
          />
          <div>
            <p className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {currencyFormatter(totalValue)}
            </p>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Valor total
            </p>
          </div>
        </div>

        {/* Legenda */}
        <div className="lg:col-span-2">
          <ul className="space-y-3">
            {data.map((item) => {
              const percentage = ((item.value / totalValue) * 100).toFixed(1);
              return (
                <li key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.name === 'Imóveis'
                          ? 'bg-blue-500'
                          : item.name === 'Ações & ETFs'
                          ? 'bg-violet-500'
                          : 'bg-fuchsia-500'
                      }`}
                    />
                    <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {currencyFormatter(item.value)}
                    </p>
                    <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                      {percentage}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}