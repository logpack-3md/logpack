'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ManagerDashboard from './components/ManagerDashboard';

const RoleComponentMap = {
    'admin': () => <div>Admin Dashboard (Temporário)</div>,
    'manager': ManagerDashboard,
    'employee': () => <div>Employee Dashboard</div>,
    'buyer': () => <div>Buyer Dashboard</div>,
};

export default function DynamicDashboard({ params }) {
    const unwrappedParams = React.use(params);
    const { role } = unwrappedParams; 

    const { isAuthenticated, router } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }
    if (isAuthenticated === null) {
        return <div>Carregando autenticação...</div>;
    }

    const Component = RoleComponentMap[role];

    if (!Component) {
        return <h1>Acesso Negado ou Role Desconhecida</h1>;
    }

    return <Component />;
}