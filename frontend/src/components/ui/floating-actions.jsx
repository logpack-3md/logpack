// src/components/ui/floating-actions.jsx
'use client';

import { Bell, User, LogOut, Settings } from 'lucide-react';
import { Badge } from '@tremor/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function FloatingActions() {
  const router = useRouter();

  const goToProfile = () => {
    router.push('/dashboard/manager/profile'); // rota certa eu acho,, testando
  };

  const handleLogout = () => {
    // Aqui você coloca sua lógica de logout (ex: limpar token, etc)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      {/* NOTIFICAÇÕES */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200">
            <Bell className="w-5 h-5 text-gray-700" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white rounded-full font-bold">
              3
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 mt-2 p-2">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            Atualização de estoque no setor B01
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Pedido #1234 concluído com sucesso
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Novo fornecedor cadastrado: Embalagens SA
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AVATAR COM MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200 ring-2 ring-transparent hover:ring-blue-400">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-bold">
                US
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
          <DropdownMenuLabel className="font-medium text-gray-900">
            Usuário Logado
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-3 hover:bg-blue-50"
            onClick={goToProfile}
          >
            <User className="w-4 h-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 hover:bg-gray-50">
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}