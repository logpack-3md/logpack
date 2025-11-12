'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';
import BuyerDashboard from '@/components/dashboards/BuyerDashboard';

export default function Dashboard() {
    const { userRole, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/login');
        }
    }, [isAuthenticated, router])

    if (isAuthenticated === null || isAuthenticated === undefined) {
        return <div>Carregando autenticação...</div>;
    }

    if (!isAuthenticated) {
        return null
    }

    if (!userRole) {
        return <div>Carregando dados do usuário...</div>;
    }

    switch (userRole) {
        case 'admin':
            return <AdminDashboard />;
        case 'manager':
            return <ManagerDashboard />;
        case 'employee':
            return <EmployeeDashboard />;
        case 'buyer':
            return <BuyerDashboard />
    }
}