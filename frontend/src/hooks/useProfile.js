import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    image: null,
    password: "",
    confirmPassword: "",
  });

  const [backupUser, setBackupUser] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("users/profile");
      
      // Normalização robusta do Status
      // Aceita 'ativo', 'Ativo', true, ou assume 'Inativo'
      const rawStatus = String(response.status || response.user?.status || '').toLowerCase();
      const normalizedStatus = (rawStatus === 'ativo') ? 'Ativo' : 'Inativo';

      const userData = {
        name: response.name || "Usuário",
        email: response.email || "",
        role: response.role || "N/A",
        status: normalizedStatus,
        image: response.image || null,
        password: "",
        confirmPassword: "",
      };

      setUser(userData);
      setBackupUser(userData);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async () => {
    if (!user.name || !user.email) {
      toast.warning("Nome e Email são obrigatórios.");
      return false;
    }

    if (user.password || user.confirmPassword) {
      if (user.password.length < 6) {
        toast.warning("A senha deve ter no mínimo 6 caracteres.");
        return false;
      }
      if (user.password !== user.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return false;
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

      toast.success("Perfil atualizado com sucesso!");
      
      const newUserData = { ...user, password: "", confirmPassword: "" };
      setUser(newUserData);
      setBackupUser(newUserData);
      return true;
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Erro ao atualizar.";
      toast.error(errorMsg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateAvatar = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Formato de arquivo inválido");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, image: previewUrl }));

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const response = await api.put("users/profile", formData);
      const newImageUrl = response.user?.image || response.image;
      
      setUser((prev) => ({ ...prev, image: newImageUrl }));
      setBackupUser((prev) => ({ ...prev, image: newImageUrl }));
      toast.success("Foto atualizada!");
    } catch (err) {
      console.error("Erro upload:", err);
      toast.error("Falha ao enviar foto.");
      setUser((prev) => ({ ...prev, image: backupUser.image }));
    } finally {
      setUploading(false);
    }
  };

  const cancelEdit = () => {
    setUser({ ...backupUser, password: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return {
    user,
    loading,
    saving,
    uploading,
    updateProfile,
    updateAvatar,
    handleChange,
    cancelEdit
  };
};