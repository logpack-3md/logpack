"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, message, Spin } from "antd";
import {
  CameraOutlined,
  UserOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Sidebar from "@/components/layout/sidebar-admin";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("users/profile");
      setUser({
        name: response.name || "Usuário",
        email: response.email || "",
        role: response.role || "",
        phone: response.phone ?? "",
        image: response.image ?? null,
      });
    } catch (err) {
      console.error(err);
      message.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // UPLOAD DE FOTO
  // =============================================
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error("A imagem deve ter no máximo 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      message.error("Por favor selecione uma imagem válida");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, image: previewUrl }));

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const response = await api.put("users/profile", formData);

      setUser((prev) => ({
        ...prev,
        image: response.user.image,
      }));

      message.success("Foto de perfil atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar foto:", err);
      message.error("Não foi possível atualizar a foto");
      fetchUser();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />


      <div className={`flex-1 transition-all duration-300 ${ isSidebarOpen ? "lg:ml-64" : "lg:ml-64" } p-4 lg:p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas informações pessoais e configurações de conta.
            </p>
          </div>

          <div className="w-full bg-card text-card-foreground rounded-(--radius) border border-border shadow-sm overflow-hidden flex flex-col">
            
            {/* 1. Banner Decorativo (Capa) */}
            <div className="h-48 w-full bg-linear-to-r from-muted to-primary/20 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            {/* 2. Área do Avatar e Ações */}
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-6 gap-6">
                
                {/* Avatar Wrapper */}
                <div className="relative group">
                  <div
                    className="relative p-1.5 bg-card rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105 border border-border"
                    onClick={handleAvatarClick}
                  >
                    <Avatar
                      size={150}
                      src={user.image}
                      className="flex items-center justify-center text-5xl font-bold bg-muted text-muted-foreground border-4 border-card"
                    >
                      {!user.image && getInitials(user.name)}
                    </Avatar>

                    {/* Overlay de Edição */}
                    <div className="absolute inset-0 m-1.5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      {uploading ? (
                        <Spin size="large" />
                      ) : (
                        <div className="text-center text-white">
                          <CameraOutlined className="text-3xl mb-1 block" />
                          <span className="text-xs font-medium uppercase tracking-wide">
                            Alterar
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input Invisível */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Nome e Cargo */}
                <div className="text-center md:text-left md:mb-4 flex-1">
                  <h2 className="text-3xl font-bold text-foreground">
                    {user.name}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center gap-2 mt-1 text-muted-foreground font-medium">
                    {/* Badge/Chip usando cores secondary do tema */}
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm border border-border">
                      {user.role}
                    </span>
                    <span className="hidden md:inline text-muted-foreground/50">•</span>
                    <span>{user.email}</span>
                  </div>
                </div>


{/* Colcoar funcionalidade para poder alterar (ainda será implementado) */}
                {/* Botão de Ação */}
                <div className="md:mb-4">
                  {/* Usando bg-primary ou --background-button se preferir a cor customizada do tema */}
                  <button className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-(--radius) font-medium transition-colors shadow-md">
                    Editar Perfil
                  </button>
                </div>



              </div>

              <div className="h-px bg-border w-full my-8"></div>

              {/* 3. Grid de Informações Detalhadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <InfoItem
                  icon={<UserOutlined />}
                  label="Nome Completo"
                  value={user.name}
                />

                <InfoItem
                  icon={<MailOutlined />}
                  label="Email Principal"
                  value={user.email}
                />

                <InfoItem
                  icon={<SafetyCertificateOutlined />}
                  label="Cargo / Função"
                  value={user.role}
                />

                <InfoItem
                  icon={<PhoneOutlined />}
                  label="Telefone"
                  value={user.phone || "Não informado"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start p-4 rounded-(--radius) bg-muted/30 hover:bg-muted/60 transition-colors group border border-border">
      <div className="shrink-0 mr-4">
        <div className="w-12 h-12 rounded-md bg-background flex items-center justify-center text-primary text-xl shadow-xs border border-border group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-semibold text-foreground break-all">
          {value}
        </p>
      </div>
    </div>
  );
}