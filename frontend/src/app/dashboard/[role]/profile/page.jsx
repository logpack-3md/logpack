"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Avatar, Descriptions, message } from "antd";
import Sidebar from "@/components/layout/sidebar";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  const [user, setUser] = useState({
    name: "Carregando...",
    email: "",
    role: "",
    phone: "",
    image: null,
  });

  // =============================================
  // BUSCAR PERFIL
  // =============================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("users/profile");

        // Backend retorna direto o objeto
        const data = response;

        if (!data) {
          message.error("Erro: backend não enviou o perfil corretamente.");
          return;
        }

        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone ?? "",
          image: data.image ?? null,
        });

      } catch (err) {
        console.log(err);
        message.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Avatar - iniciais
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden" loading={loading}>
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-10 text-white">
              <div className="flex flex-col md:flex-row items-center gap-8">

                {/* Avatar */}
                <div className="relative cursor-pointer">
                  <Avatar
                    size={140}
                    src={user.image ? user.image : null}
                    className="border-6 border-white shadow-2xl text-5xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600"
                  >
                    {!user.image && getInitials(user.name)}
                  </Avatar>
                </div>

                {/* Nome e dados */}
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-extrabold">{user.name}</h2>
                  <p className="text-xl opacity-90 mt-2">{user.role}</p>
                  <p className="text-lg opacity-80 mt-1">{user.email}</p>
                </div>

              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-10">
              <Descriptions column={2} bordered className="mb-8 bg-gray-50">
                <Descriptions.Item label="Nome completo">
                  <strong>{user.name}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <strong>{user.email}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Cargo">
                  <strong>{user.role}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Telefone">
                  <strong>{user.phone || "Não informado"}</strong>
                </Descriptions.Item>
              </Descriptions>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}
