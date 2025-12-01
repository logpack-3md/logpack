"use client";

import React, { useState, useRef } from "react";
import { 
  Camera, User, Mail, ShieldCheck, Save, X, Pencil, Lock, KeyRound, Loader2, CheckCircle2, AlertCircle, Menu
} from "lucide-react";
import { Toaster } from "sonner";
import clsx from 'clsx';

// SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Componentes de Layout
import SidebarAdmin from "@/components/layout/sidebar-admin"; 
import SidebarEmployee from "@/components/layout/sidebar-employee";
import SidebarManager from "@/components/layout/sidebar-manager"; 

import { useProfile } from "@/hooks/useProfile";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { 
    user, loading, saving, uploading, 
    updateProfile, updateAvatar, handleChange, cancelEdit 
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const params = useParams();

  // Seleção dinâmica de Sidebar baseada na rota
  const Sidebar = () => {
      const role = params.role;
      if (role === 'employee') return <SidebarEmployee />;
      if (role === 'manager') return <SidebarManager />;
      return <SidebarAdmin />; // Default
  };

  const handleSaveClick = async () => {
    const success = await updateProfile();
    if (success) setIsEditing(false);
  };

  const handleCancelClick = () => {
    cancelEdit();
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const isActive = user.status === 'Ativo';

  return (
    <div className="min-h-screen bg-muted/40 font-sans text-foreground flex">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30 border-r bg-background">
         <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        
        {/* Header Mobile */}
        <div className="lg:hidden p-4 border-b bg-background flex items-center gap-4 sticky top-0 z-20 shadow-sm">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64"><Sidebar /></SheetContent>
            </Sheet>
            <span className="font-bold text-lg">Meu Perfil</span>
        </div>

        <main className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto w-full">
          
          {/* Cabeçalho da Página */}
          <div className="mb-8 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Configurações da Conta</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências de segurança.</p>
          </div>

          <Card className="overflow-hidden border-border shadow-sm">
            
            {/* Banner Decorativo */}
            <div className="h-48 w-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-950 relative">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <CardContent className="px-6 pb-8 md:px-10">
              
              {/* Seção de Avatar e Info Principal */}
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-8 gap-6">
                
                {/* Avatar com Upload */}
                <div className="relative group">
                  <div 
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className={clsx(
                      "relative p-1.5 bg-background rounded-full shadow-xl ring-1 ring-border transition-transform",
                      isEditing ? "cursor-pointer hover:scale-105" : "cursor-default"
                    )}
                  >
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background bg-muted">
                      <AvatarImage src={user.image} className="object-cover" />
                      <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-500">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Overlay de Upload (Só aparece editando) */}
                    {isEditing && (
                      <div className="absolute inset-0 m-1.5 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          {uploading ? (
                              <Loader2 className="h-8 w-8 text-white animate-spin" />
                          ) : (
                              <>
                                  <Camera className="h-8 w-8 text-white mb-1" />
                                  <span className="text-[10px] uppercase font-bold text-white tracking-wider">Alterar</span>
                              </>
                          )}
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => updateAvatar(e.target.files[0])} className="hidden" />
                </div>

                {/* Informações do Usuário */}
                <div className="flex-1 text-center md:text-left mb-2 space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1 gap-1.5 text-sm font-medium h-7">
                        <ShieldCheck className="h-3.5 w-3.5" /> {user.role}
                    </Badge>
                    
                    <div className={clsx(
                        "flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full h-7",
                        isActive ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                        {user.status}
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 md:mb-4">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" onClick={handleCancelClick} disabled={saving}>
                        <X className="mr-2 h-4 w-4" /> Cancelar
                      </Button>
                      <Button onClick={handleSaveClick} disabled={saving} className="min-w-[120px]">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="default" className="shadow-sm">
                      <Pencil className="mr-2 h-4 w-4" /> Editar Perfil
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Formulário Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="name"
                            name="name" 
                            value={user.name} 
                            onChange={handleChange} 
                            disabled={!isEditing} 
                            className={clsx("pl-9", !isEditing && "bg-muted/50 text-muted-foreground border-transparent")}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Principal</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="email"
                            name="email" 
                            value={user.email} 
                            onChange={handleChange} 
                            disabled={!isEditing} 
                            className={clsx("pl-9", !isEditing && "bg-muted/50 text-muted-foreground border-transparent")}
                        />
                    </div>
                </div>

                {/* Seção de Segurança (Visível apenas ao editar) */}
                {isEditing && (
                    <div className="md:col-span-2 bg-muted/30 p-6 rounded-xl border border-border mt-2 animate-in fade-in-50 slide-in-from-top-2">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                <KeyRound className="h-5 w-5 text-primary" /> Alterar Senha
                            </h3>
                            <p className="text-sm text-muted-foreground">Preencha os campos abaixo apenas se desejar redefinir sua senha de acesso.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nova Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="password"
                                        type="password"
                                        name="password" 
                                        placeholder="••••••"
                                        value={user.password} 
                                        onChange={handleChange} 
                                        className="pl-9 bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword" 
                                        placeholder="••••••"
                                        value={user.confirmPassword} 
                                        onChange={handleChange} 
                                        className="pl-9 bg-background"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}