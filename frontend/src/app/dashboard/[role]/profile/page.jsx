// src/app/dashboard/[role]/profile/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Avatar, Form, Input, Button, Descriptions, message } from "antd";
import { EditOutlined, SaveOutlined, CameraOutlined } from "@ant-design/icons";
import Sidebar from "@/components/layout/sidebar";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef();

  const [user, setUser] = useState({
    id: "",
    name: "Carregando...",
    email: "",
    role: "",
    phone: "",
    image: null
  });

  // =============================================
  // BUSCAR PERFIL
  // =============================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("users/profile");

        console.log("📌 RESPOSTA COMPLETA:", response);

        // Backend envia direto o objeto, não em response.data
        const raw = response?.data ?? response;

        console.log("📌 RESPOSTA DO BACKEND (data):", raw);

        const data = raw;

        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone ?? "",
          image: data.image ?? null
        });

        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phone: data.phone ?? ""
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

  // =============================================
  // UPLOAD DE FOTO
  // =============================================
  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      message.loading("Enviando foto...");

      const response = await api.put(`/users/${user.id}/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.destroy();
      message.success("Foto atualizada!");

      setUser((prev) => ({
        ...prev,
        image: response.data.image,
      }));

    } catch (err) {
      console.error("Erro ao enviar foto:", err);
      message.error("Erro ao enviar foto.");
    }
  };

  // =============================================
  // SALVAR ALTERAÇÕES DO PERFIL
  // =============================================
  const onFinish = async (values) => {
    setLoading(true);

    try {
      await api.put(`/users/${user.id}`, values);

      message.success("Perfil atualizado!");

      setUser((prev) => ({
        ...prev,
        ...values
      }));

      setEditMode(false);

    } catch (err) {
      console.log(err);
      message.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Inicial do Avatar
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  // Estado 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />


      <div className="flex-1 ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden" loading={loading}>
            {/* Header com gradiente */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-10 text-white">
              <div className="flex flex-col md:flex-row items-center gap-8">

                {/* Avatar */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Avatar
                    size={140}
                    src={user.image ? user.image : null}
                    className="border-6 border-white shadow-2xl text-5xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600"
                  >
                    {!user.image && getInitials(user.name)}
                  </Avatar>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition">
                    <CameraOutlined className="text-4xl text-white" />
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    className="hidden"
                  />
                </div>

                {/* Nome e e-mail */}
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-extrabold">{user.name}</h2>
                  <p className="text-xl opacity-90 mt-2">{user.role}</p>
                  <p className="text-lg opacity-80 mt-1">{user.email}</p>
                </div>

              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-10">
              {editMode ? (
                <Form form={form} layout="vertical" onFinish={onFinish}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item label="Nome completo" name="name" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>

                    <Form.Item label="Telefone" name="phone">
                      <Input size="large" placeholder="(11) 98765-4321" />
                    </Form.Item>
                  </div>

                  <Form.Item label="Email" name="email">
                    <Input size="large" disabled className="bg-gray-100" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="bg-green-600 hover:bg-green-700 mr-4"
                    >
                      <SaveOutlined /> Salvar Alterações
                    </Button>

                    <Button onClick={() => setEditMode(false)} size="large">
                      Cancelar
                    </Button>
                  </Form.Item>

                </Form>
              ) : (
                <>
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

                  <Button
                    type="primary"
                    size="large"
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Editar Perfil
                  </Button>
                </>
              )}
            </div>

          </Card>

        </div>
      </div>
    </div>
  );
}
