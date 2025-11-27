'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard/page';
import BuyerDashboard from './components/BuyerDashboard/page';
import EmployeeDashboard from './components/EmployeeDashboard/page'

const RoleComponentMap = {
  admin: AdminDashboard,
  manager: ManagerDashboard,
  employee: EmployeeDashboard,
  buyer: BuyerDashboard,
};

export default function DynamicDashboard({ params }) {
  // Next.js 15.5+ → params agora é uma Promise
  const { role } = React.use(params);

  const { isAuthenticated, userStatus, user } = useAuth();

  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center text-xl">Carregando...</div>;
  }

  if (isAuthenticated === false) {
    return null;
  }

  if (userStatus && userStatus !== 'ativo') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="max-w-md rounded-lg bg-white p-10 shadow-xl border">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Restrito</h1>
          <p className="text-lg text-gray-700">
            Status: <span className="font-bold uppercase text-red-500">{userStatus}</span>
          </p>
          <p className="text-gray-600 mt-4">Aguarde ativação do administrador.</p>
        </div>
      </div>
    );
  }

  const Component = RoleComponentMap[role];

  if (!Component) {
    notFound();
  }

  // Opcional: validar se a role da URL bate com a do usuário
  // const userRole = user?.role?.toLowerCase();
  // if (userRole && userRole !== role) notFound();

  return <Component />;
}