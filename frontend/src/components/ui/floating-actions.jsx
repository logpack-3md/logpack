// src/components/ui/floating-actions.jsx
'use client';

import { Bell, User } from 'lucide-react';
import { Badge } from '@tremor/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function FloatingActions() {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      {/* NOTIFICAÇÕES */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200">
            <Bell className="w-5 h-5 text-gray-700" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white rounded-full">
              3
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 mt-2">
          <DropdownMenuItem>Atualização de estoque</DropdownMenuItem>
          <DropdownMenuItem>Pedido #1234 concluído</DropdownMenuItem>
          <DropdownMenuItem>Novo fornecedor cadastrado</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AVATAR */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                US
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}