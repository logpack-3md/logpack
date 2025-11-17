"use client";

import React from 'react';
import { Package, Users, ShoppingBag, Store } from 'lucide-react';

const StatCard = ({ title, value, change, Icon, color }) => {
  const isPositive = change >= 0;
  const colorClasses = {
    teal: { icon: 'text-teal-500', bar: 'bg-teal-500' },
    blue: { icon: 'text-blue-500', bar: 'bg-blue-500' },
    orange: { icon: 'text-orange-500', bar: 'bg-orange-500' },
    purple: { icon: 'text-purple-500', bar: 'bg-purple-500' },
  };
  const c = colorClasses[color];

  // Barra de progresso: % * 2 (pra ficar curta como na imagem)
  const barWidth = Math.min(Math.abs(change) * 20, 100);

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${c.icon} bg-opacity-10`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">This week</p>
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </span>
          <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-teal-600' : 'text-red-600'}`}>
            {isPositive ? 'up' : 'down'} {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
};

export default function DataStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatCard
        title="New Orders"
        value={1368}
        change={0.43}
        Icon={Package}
        color="teal"
      />
      <StatCard
        title="New Customers"
        value={785}
        change={0.39}
        Icon={Users}
        color="blue"
      />
      <StatCard
        title="Online Orders"
        value={795}
        change={-1.39}
        Icon={ShoppingBag}
        color="orange"
      />
      <StatCard
        title="Offline Orders"
        value={573}
        change={2.69}
        Icon={Store}
        color="purple"
      />
    </div>
  );
}