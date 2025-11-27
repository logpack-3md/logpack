// src/components/ui/GlobalNotification.jsx
'use client';

import { useEffect } from 'react';

const NOTIFICATION_KEY = 'pending-request-notifications';

if (typeof window !== 'undefined') {
  // 1. FUNÇÃO PARA MOSTRAR NOTIFICAÇÃO (em tempo real ou pendente)
  window.notificarNovoPedido = (dados = {}) => {
    const { usuario = 'Funcionário', sku = '', insumo = '' } = dados;

    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-6 z-[9999] animate-in slide-in-from-right-full duration-500 pointer-events-auto';

    notification.innerHTML = `
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-5 max-w-sm border border-white/20 hover:scale-105 transition-all">
        <div class="flex items-start gap-4">
          <div class="bg-white/20 p-3 rounded-xl flex-shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-lg">Novo pedido criado!</h4>
            <p class="text-sm opacity-90">${usuario} solicitou reposição</p>
            ${sku ? `<p class="text-xs mt-1 opacity-80 font-mono">SKU: ${sku}</p>` : ''}
            ${insumo ? `<p class="text-xs opacity-80">${insumo}</p>` : ''}
          </div>
          <button class="text-white/70 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    notification.querySelector('button')?.addEventListener('click', () => {
      notification.classList.add('animate-out', 'slide-out-to-right-full');
      setTimeout(() => notification.remove(), 500);
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.isConnected) {
        notification.classList.add('animate-out', 'slide-out-to-right-full');
        setTimeout(() => notification.remove(), 500);
      }
    }, 7000);
  };

  // 2. SALVA NOTIFICAÇÃO PARA MOSTRAR DEPOIS (quando gerente entrar)
  window.adicionarNotificacaoPendente = (dados) => {
    const existentes = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || '[]');
    const nova = {
      ...dados,
      timestamp: Date.now(),
      id: Date.now() + Math.random()
    };
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify([...existentes, nova]));
  };

  // 3. MOSTRA TODAS AS NOTIFICAÇÕES PENDENTES (chamada ao entrar no manager)
  window.mostrarNotificacoesPendentes = () => {
    const pendentes = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || '[]');
    if (pendentes.length === 0) return;

    pendentes.forEach((notif, index) => {
      setTimeout(() => {
        window.notificarNovoPedido(notif);
      }, index * 1000); // uma a cada 1 segundo
    });

    // Limpa após mostrar
    localStorage.removeItem(NOTIFICATION_KEY);
  };
}

// Componente vazio só pra ativar as funções acima
export default function GlobalNotification() {
  return null;
}