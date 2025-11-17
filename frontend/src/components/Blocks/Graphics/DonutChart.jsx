// src/components/Blocks/WelcomeCard/WelcomeCard.jsx
'use client';

import { RiArrowRightLine } from '@remixicon/react';

export default function WelcomeCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-5">
        {/* Ícone */}
        <div className="shrink-0">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <RiArrowRightLine className="w-7 h-7 rotate-[-45deg]" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Acessar últimos pedidos
            </h3>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Agora
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Caso queira acessar os últimos pedidos e suas atualizações, clique no botão abaixo.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="/dashboard/admin/pedidos"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow"
            >
              Pedidos
              <RiArrowRightLine className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}