// src/components/Blocks/Pedidos/PedidosSection.jsx
'use client';

import {
  RiBuildingFill,
  RiMapPin2Fill,
  RiSettings3Line,
  RiTimeLine,
  RiTruckLine,
  RiUserFill,
} from '@remixicon/react';
import {
  Divider,
  ProgressCircle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Dados com IDs
const data = [
  {
    status: 'Em processamento',
    icon: RiSettings3Line,
    iconColor: 'text-blue-500',
    orders: [
      {
        id: 6010,
        item: 'Impressora Laser Jet Pro',
        company: 'Big Tech Ltda.',
        location: 'São Paulo, SP',
        contact: 'Lena Stone',
        fulfillmentActual: 8,
        fulfillmentTotal: 10,
        lastUpdated: '2min atrás',
      },
      {
        id: 6011,
        item: 'Monitor LED 27"',
        company: 'Bitclick Holding',
        location: 'Rio de Janeiro, RJ',
        contact: 'Matthias Ruedi',
        fulfillmentActual: 3,
        fulfillmentTotal: 4,
        lastUpdated: '5min atrás',
      },
    ],
  },
  {
    status: 'Em entrega',
    icon: RiTruckLine,
    iconColor: 'text-emerald-500',
    orders: [
      {
        id: 6012,
        item: 'Monitor OLED 49"',
        company: 'Walders AG',
        location: 'Belo Horizonte, MG',
        contact: 'Patrick Doe',
        fulfillmentActual: 5,
        fulfillmentTotal: 6,
        lastUpdated: '4d atrás',
      },
    ],
  },
  {
    status: 'Atrasado',
    icon: RiTimeLine,
    iconColor: 'text-orange-500',
    orders: [
      {
        id: 6013,
        item: 'SSD Externo 1TB',
        company: 'Waterbridge Inc.',
        location: 'Curitiba, PR',
        contact: 'Adam Taylor',
        fulfillmentActual: 4,
        fulfillmentTotal: 12,
        lastUpdated: '1d atrás',
      },
    ],
  },
];

const statusColor = {
  'Em processamento': 'bg-blue-50 text-blue-700 ring-blue-600/10',
  'Em entrega': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  'Atrasado': 'bg-orange-50 text-orange-700 ring-orange-600/10',
};

export default function PedidosSection() {
  const handleDelete = (id) => {
    if (confirm(`Tem certeza que deseja excluir o pedido #${id}?`)) {
      alert(`Pedido #${id} excluído com sucesso!`);
      // Futuro: await fetch(`/api/pedidos/${id}`, { method: 'DELETE' })
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-0 overflow-hidden border border-gray-100">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-blue-50/20 to-indigo-50/10">
        <h3 className="text-xl font-bold text-gray-900">Pedidos</h3>
        <p className="text-sm text-gray-600 mt-1">Acompanhe o status em tempo real</p>
      </div>

      <TabGroup>
        <TabList className="px-6 pt-4 border-b-0">
          {data.map((category) => (
            <Tab
              key={category.status}
              className="pb-3 px-1 transition-all data-[selected]:border-b-2 data-[selected]:border-blue-400"
            >
              <div className="flex items-center gap-2">
                <category.icon className={classNames(category.iconColor, 'w-5 h-5 hidden sm:block')} />
                <span className="font-semibold text-gray-700">{category.status}</span>
                <span className="ml-1.5 px-2.5 py-0.5 text-xs font-bold bg-gray-100 text-gray-700 rounded-full">
                  {category.orders.length}
                </span>
              </div>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {/* category está AQUI dentro do map → sem erro */}
          {data.map((category) => (
            <TabPanel key={category.status} className="p-6 space-y-5">
              {category.orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-xl bg-white/95 border border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                >
                  {/* Título + Status */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-base font-semibold text-gray-900 truncate pr-3">
                      {order.item}
                    </h4>
                    <span
                      className={classNames(
                        statusColor[category.status],
                        'px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset'
                      )}
                    >
                      {category.status}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-5">
                    <div className="flex items-center gap-2">
                      <RiBuildingFill className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{order.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiMapPin2Fill className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{order.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiUserFill className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{order.contact}</span>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-50" />

                  {/* Progresso + Atualização */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-3">
                      <ProgressCircle
                        value={(order.fulfillmentActual / order.fulfillmentTotal) * 100}
                        size="md"
                        color={
                          category.status === 'Em entrega'
                            ? 'emerald'
                            : category.status === 'Atrasado'
                            ? 'orange'
                            : 'blue'
                        }
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.fulfillmentActual}/{order.fulfillmentTotal}
                        </p>
                        <p className="text-xs text-gray-500">concluídos</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Atualizado {order.lastUpdated}
                    </p>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <Link
  href={`/dashboard/pedidos/${order.id}`}
  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
>
  <Edit2 className="w-4 h-4" />
</Link>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}