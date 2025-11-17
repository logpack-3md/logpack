// src/app/dashboard/pedidos/[id]/page.jsx
'use client';

import { useParams, notFound } from 'next/navigation';
import { ArrowLeft, Edit2, Package, User, MapPin, Phone, CreditCard, CheckCircle, Circle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Divider } from '@tremor/react';

const mockOrders = {
  6010: {
    id: 6010,
    status: 'Refunded',
    date: '11 Nov 2025 9:10 am',
    items: [
      { name: 'Urban Explorer Sneakers', code: '16H9UR0', qty: 1, price: 83.74 },
      { name: 'Classic Leather Loafers', code: '16H9UR1', qty: 2, price: 97.14 },
      { name: 'Mountain Trekking Boots', code: '16H9UR2', qty: 3, price: 68.71 },
    ],
    subtotal: 484.15,
    shipping: -10,
    discount: -10,
    taxes: 10,
    total: 474.15,
    customer: {
      name: 'Jayvion Simon',
      email: 'nannie.abernathy70@yahoo.com',
      ip: '192.158.1.38',
    },
    delivery: {
      method: 'DHL',
      speed: 'Standard',
      tracking: 'SPX037739199373',
      address: '19034 Verna Unions Apt. 164\nHonolulu, RI / 87535',
      phone: '365-374-4961',
    },
    payment: { card: '5678' },
    history: [
      { status: 'Delivery successful', date: '10 Nov 2025 8:10 am', success: true },
      { status: 'Transporting to [2]', date: '09 Nov 2025 7:10 am', success: false },
      { status: 'Transporting to [1]', date: '08 Nov 2025 6:10 am', success: false },
      { status: 'The shipping unit has picked up the goods', date: '07 Nov 2025 5:10 am', success: false },
      { status: 'Order has been created', date: '06 Nov 2025 4:10 am', success: false },
      { status: 'Payment processed', date: '06 Nov 2025 3:50 am', success: false },
      { status: 'Order confirmed', date: '06 Nov 2025 3:45 am', success: false },
    ],
  },
};

export default function PedidoDetalhe() {
  const { id } = useParams();
  const orderId = parseInt(id);
  const order = mockOrders[orderId];
  if (!order) notFound();

  const visibleHistory = order.history.slice(0, 5);
  const hasMore = order.history.length > 5;

  return (
    <div className="min-h-screen bg-white-500 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              {order.status}
            </span>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Package className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* GRID PRINCIPAL: 70% + 30% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUNA ESQUERDA: PEDIDO + HISTORY (70%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* CARD 1: ORDER #6010 + ITENS + RESUMO */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Order #{order.id}</h1>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* DETAILS */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-500" />
                      Details
                    </h2>
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">x{item.qty}</p>
                          <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RESUMO */}
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-red-600">-${Math.abs(order.shipping).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-red-600">-${Math.abs(order.discount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes</span>
                      <span className="font-medium">${order.taxes.toFixed(2)}</span>
                    </div>
                    <Divider className="my-3 border-gray-200" />
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: HISTORY (ABAIXO DO PEDIDO, ALTURA MENOR) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-h-96">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
                <div className="relative overflow-y-auto max-h-72 pr-2">
                  {/* Linha vertical da timeline */}
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    {visibleHistory.map((h, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="relative z-10 flex-shrink-0">
                          {h.success ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 bg-white" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 fill-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className={h.success ? 'font-medium text-emerald-700' : 'text-gray-700'}>
                            {h.status}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{h.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show more */}
                  {hasMore && (
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-4">
                      Show more
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: CLIENTE (30%) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
              <div className="p-6 space-y-6">
                {/* CUSTOMER */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" />
                      Customer
                    </h2>
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                      <p className="text-xs text-gray-400">IP: {order.customer.ip}</p>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                    + Add to blacklist
                  </button>
                </div>

                <Divider className="border-gray-100" />

                {/* DELIVERY */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-500" />
                      Delivery
                    </h2>
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Ship by</p>
                      <p className="font-medium">{order.delivery.method}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Speedy</p>
                      <p className="font-medium">{order.delivery.speed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tracking No.</p>
                      <p className="font-medium text-blue-600">{order.delivery.tracking}</p>
                    </div>
                  </div>
                </div>

                <Divider className="border-gray-100" />

                {/* SHIPPING */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      Shipping
                    </h2>
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{order.delivery.address}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {order.delivery.phone}
                  </p>
                </div>

                <Divider className="border-gray-100" />

                {/* PAYMENT */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      Payment
                    </h2>
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">•••• •••• •••• {order.payment.card}</span>
                    <div className="w-8 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}