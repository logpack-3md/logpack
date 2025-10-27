// app/usuarios/page.jsx
"use client";

import { SidebarLogin } from "@/components/dashboard/Sidebar/SidebarLogin";
import { LoginTable } from "@/components/dashboard/LoginTable";
import { useRouter } from "next/navigation";

export default function UsuariosPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar limpa, apenas navegação */}
      <SidebarLogin
        onDashboardClick={() => router.push("/dashboard")}
        onUsuariosClick={() => router.push("/usuarios")}
      />

      {/* Conteúdo principal (tabela de logins) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Acompanhamento de Logins
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Visualize todos os acessos à plataforma em tempo real.
              </p>
            </div>

            <LoginTable />
          </div>
        </div>
      </div>
    </div>
  );
}