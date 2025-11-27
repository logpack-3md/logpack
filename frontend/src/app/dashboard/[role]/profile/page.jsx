"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, message, Spin, Tooltip, Tag } from "antd"; // Adicionei Tag para o status visual
import {
  CameraOutlined,
  UserOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  LockOutlined,
  KeyOutlined,
  CheckCircleOutlined, // Novo ícone
} from "@ant-design/icons";
import Sidebar from "@/components/layout/sidebar-admin";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Estado unificado
  const [user, setUser] = useState({
    name: "Carregando...",
    email: "",
    role: "",
    status: "Ativo", // Novo campo para preencher visualmente
    image: null,
    password: "",
    confirmPassword: "",
  });

  const [backupUser, setBackupUser] = useState(null);

  // =============================================
  // BUSCAR PERFIL
  // =============================================
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("users/profile");
      const userData = {
        name: response.name || "Usuário",
        email: response.email || "",
        role: response.role || "",
        status: response.status === 'ativo' ? 'Ativo' : 'Ativo', // Garante valor para exibição
        image: response.image ?? null,
        password: "",
        confirmPassword: "",
      };
      setUser(userData);
      setBackupUser(userData);
    } catch (err) {
      console.error(err);
      message.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // SALVAR
  // =============================================
  const handleSave = async () => {
    if (!user.name || !user.email) {
      message.warning("Nome e Email são obrigatórios.");
      return;
    }

    if (user.password || user.confirmPassword) {
      if (user.password.length < 6) {
        message.warning("A senha deve conter no mínimo 6 caracteres.");
        return;
      }
      if (!user.confirmPassword) {
        message.warning("A confirmação de senha é obrigatória.");
        return;
      }
      if (user.password !== user.confirmPassword) {
        message.error("As senhas não coincidem.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: user.name,
        email: user.email,
      };

      if (user.password) {
        payload.password = user.password;
        payload.confirmPassword = user.confirmPassword;
      }

      await api.put("users/profile", payload);

      message.success("Perfil atualizado com sucesso!");
      
      const newUserData = { ...user, password: "", confirmPassword: "" };
      setBackupUser(newUserData);
      setUser(newUserData);
      
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Erro ao atualizar os dados.";
      message.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUser({ ...backupUser, password: "", confirmPassword: "" });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // =============================================
  // UPLOAD FOTO
  // =============================================
  const handleAvatarClick = () => fileInputRef.current?.click();

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
      const newImageUrl = response.user.image;
      const updatedData = { ...user, image: newImageUrl };
      setUser(updatedData);
      setBackupUser((prev) => ({ ...prev, image: newImageUrl }));
      message.success("Foto de perfil atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar foto:", err);
      message.error("Não foi possível atualizar a foto");
      setUser((prev) => ({ ...prev, image: backupUser.image }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-64"} p-4 lg:p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas informações pessoais e credenciais de acesso.
            </p>
          </div>

          <div className="w-full bg-card text-card-foreground rounded-(--radius) border border-border shadow-sm overflow-hidden flex flex-col">
            {/* Banner */}
            <div className="h-48 w-full bg-linear-to-r from-muted to-primary/20 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            {/* Avatar e Header */}
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-6 gap-6">
                
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
                    <div className="absolute inset-0 m-1.5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      {uploading ? <Spin size="large" /> : (
                        <div className="text-center text-white">
                          <CameraOutlined className="text-3xl mb-1 block" />
                          <span className="text-xs font-medium uppercase tracking-wide">Alterar</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                <div className="text-center md:text-left md:mb-4 flex-1">
                  <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
                  <div className="flex flex-col md:flex-row items-center gap-2 mt-1 text-muted-foreground font-medium">
                    <Tooltip title="Cargo definido pelo sistema.">
                      <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm border border-border flex items-center gap-1 cursor-default">
                        <LockOutlined className="text-xs" /> {user.role}
                      </span>
                    </Tooltip>
                    <span className="hidden md:inline text-muted-foreground/50">•</span>
                    <span className="text-green-600 flex items-center gap-1 text-sm">
                        <CheckCircleOutlined /> {user.status}
                    </span>
                  </div>
                </div>

                <div className="md:mb-4 flex gap-3">
                  {isEditing ? (
                    <>
                      <button onClick={handleCancel} disabled={saving} className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-(--radius) font-medium transition-colors border border-border flex items-center gap-2 cursor-pointer">
                        <CloseOutlined /> Cancelar
                      </button>
                      <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-(--radius) font-medium transition-colors shadow-md flex items-center gap-2 cursor-pointer">
                        {saving ? <Spin size="small" /> : <SaveOutlined />} Salvar
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-(--radius) font-medium transition-colors shadow-md flex items-center gap-2 cursor-pointer">
                      <EditOutlined /> Editar Perfil
                    </button>
                  )}
                </div>
              </div>

              <div className="h-px bg-border w-full my-8"></div>

              {/* Grid Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                
                <InfoItem
                  icon={<UserOutlined />}
                  label="Nome Completo"
                  name="name"
                  value={user.name}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                <InfoItem
                  icon={<MailOutlined />}
                  label="Email Principal"
                  name="email"
                  value={user.email}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Cargo (Read Only) */}
                <InfoItem
                  icon={<SafetyCertificateOutlined />}
                  label="Cargo (Sistema)"
                  name="role"
                  value={user.role}
                  isEditing={false} 
                  readOnly={true}
                  helperText="Gerenciado pela administração."
                />

                {/* Status (Read Only) - Preenche o buraco vazio */}
                <InfoItem
                  icon={<CheckCircleOutlined />}
                  label="Status da Conta"
                  name="status"
                  value={user.status}
                  isEditing={false}
                  readOnly={true}
                  helperText="Sua conta está ativa e operante."
                  customValueColor="text-green-600"
                />

                {/* Campos de Senha (Visíveis apenas ao editar) */}
                {isEditing && (
                  <>
                    <div className="col-span-1 md:col-span-2 h-px bg-border w-full my-2"></div>
                    <div className="col-span-1 md:col-span-2">
                         <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                            <KeyOutlined /> Segurança
                         </h3>
                         <p className="text-sm text-muted-foreground mb-4">Preencha apenas se desejar alterar sua senha.</p>
                    </div>

                    <InfoItem
                      icon={<LockOutlined />}
                      label="Nova Senha"
                      name="password"
                      value={user.password}
                      isEditing={true}
                      type="password"
                      placeholder="Nova senha..."
                      onChange={handleInputChange}
                    />

                    <InfoItem
                      icon={<LockOutlined />}
                      label="Confirmar Nova Senha"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      isEditing={true}
                      type="password"
                      placeholder="Repita a nova senha..."
                      onChange={handleInputChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente InfoItem
function InfoItem({
  icon,
  label,
  value,
  name,
  isEditing,
  onChange,
  readOnly = false,
  type = "text",
  placeholder = "",
  helperText = "",
  customValueColor = ""
}) {
  return (
    <div className={`flex items-start p-4 rounded-(--radius) border border-border transition-colors group ${readOnly ? 'bg-muted/10 opacity-90' : 'bg-muted/30 hover:bg-muted/60'}`}>
      <div className="shrink-0 mr-4">
        <div className={`w-12 h-12 rounded-md bg-background flex items-center justify-center text-xl shadow-xs border border-border transition-transform duration-300 ${readOnly ? 'text-muted-foreground' : 'text-primary group-hover:scale-110'}`}>
          {icon}
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {readOnly && <LockOutlined className="text-muted-foreground/60 text-[10px]" />}
        </div>
        
        {isEditing && !readOnly ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 text-base font-semibold transition-all"
          />
        ) : (
          <p className={`text-lg font-semibold break-all h-8 flex items-center ${customValueColor || 'text-foreground'}`}>
            {value || <span className="text-muted-foreground italic text-sm">Não informado</span>}
          </p>
        )}
        
        {helperText && (
            <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    </div>
  );
}