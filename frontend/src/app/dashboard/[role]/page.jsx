'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { notFound } from 'next/navigation';

// Componentes de Dashboard
import ManagerDashboard from './z-components/ManagerDashboard';
import AdminDashboard from './z-components/AdminDashboard/page';
import BuyerDashboard from './z-components/BuyerDashboard/page';
import EmployeeDashboard from './z-components/EmployeeDashboard/page';

// Componentes de UI e Ícones
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockKeyhole, Home, Loader2 } from "lucide-react";

const RoleComponentMap = {
  admin: AdminDashboard,
  manager: ManagerDashboard,
  employee: EmployeeDashboard,
  buyer: BuyerDashboard,
};

export default function DynamicDashboard({ params }) {
  const { role } = React.use(params);
  const { isAuthenticated, userStatus } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Verificando permissões...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  if (userStatus && userStatus !== 'ativo') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-6">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-orange-500">
          <CardHeader className="flex flex-col items-center space-y-4 text-center pb-2">

            <div className="rounded-full bg-orange-100 p-4 shadow-sm">
              <LockKeyhole className="h-8 w-8 text-orange-600" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">Acesso Pendente</CardTitle>
              <CardDescription className="text-base">
                Sua conta foi criada, mas ainda requer aprovação.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex flex-col gap-1 rounded-lg bg-muted p-4 w-full">
              <span className="text-xs font-medium uppercase text-muted-foreground">Status Atual</span>
              <span className="font-bold text-lg uppercase tracking-wider text-orange-600">
                {userStatus}
              </span>
            </div>
            <p className="text-sm text-muted-foreground px-4">
              Entre em contato com o administrador do sistema para solicitar a ativação do seu perfil.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2">
            <Button asChild className="w-full gap-2" variant="default">
              <Link href="/">
                <Home className="h-4 w-4" />
                Voltar para a Home
              </Link>
            </Button>
  
          </CardFooter>
        </Card>
      </div>
    );
  }

  const Component = RoleComponentMap[role];

  if (!Component) {
    notFound();
  }

  return <Component />;
}