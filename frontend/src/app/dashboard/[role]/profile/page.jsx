"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Avatar, Descriptions, message, Upload, Spin } from "antd";
import { UploadOutlined, CameraOutlined } from "@ant-design/icons";
import Sidebar from "@/components/layout/sidebar";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // novo estado pro upload
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
            {/* Header com foto clicável */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar clicável + overlay de upload */}
                <div className="relative group">
                  <div
                    className="cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Avatar
                      size={140}
                      src={user.image}
                      className="border-8 border-white shadow-2xl text-5xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 transition-all group-hover:opacity-80"
                    >
                      {!user.image && getInitials(user.name)}
                    </Avatar>

                    {/* Overlay com ícone de câmera */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploading ? (
                        <Spin size="large" />
                      ) : (
                        <CameraOutlined className="text-4xl text-white" />
                      )}
                    </div>
                  </div>

                  {/* Input escondido */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
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