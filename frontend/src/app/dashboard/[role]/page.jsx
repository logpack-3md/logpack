'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard/page';

const RoleComponentMap = {
    'admin': () => <AdminDashboard />,
    'manager': ManagerDashboard,
    'employee': () => <div>Employee Dashboard</div>,
    'buyer': () => <div>Buyer Dashboard</div>,
};

export default function DynamicDashboard({ params }) {
    const unwrappedParams = React.use(params);
    const { role } = unwrappedParams;

    // Certifique-se de que seu useAuth retorna o 'userStatus' (ou 'status') lido do token
    const { isAuthenticated, userStatus } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }
    if (isAuthenticated === null) {
        return <div className="flex h-screen items-center justify-center">Carregando autenticação...</div>;
    }

    // --- VERIFICAÇÃO DE STATUS (PENDENTE/INATIVO) ---
    // Se o status existir e for diferente de 'ativo', bloqueia a visão
    if (userStatus && userStatus !== 'ativo') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
                <div className="max-w-md rounded-lg bg-white p-8 shadow-lg border border-gray-200">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Restrito</h1>
                    <p className="text-lg text-gray-700 mb-2">
                        O status da sua conta é: <span className="font-bold uppercase text-red-500">{userStatus}</span>.
                    </p>
                    <p className="text-gray-500">
                        Você precisa aguardar a ativação por um administrador para acessar o painel.
                    </p>
                </div>
            </div>
        );
    }

    const Component = RoleComponentMap[role];

    // Se a role na URL não existir no mapa ou não bater com a role do usuário (se você validar isso aqui também)
    if (!Component) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-xl font-semibold">Cargo desconhecido ou rota inválida.</h1>
            </div>
        );
    }

    return <Component />;
}