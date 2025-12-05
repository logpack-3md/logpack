"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LogoSite } from "@/components/ui/icons-geral";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

// Importações do Sonner
import { toast, Toaster } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const Login = () => {
  const router = useRouter();
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { loginSuccess } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGlobalError(null);

    try {
      const res = await api.post("users/login", data);

      if (!res || res.error) {
        throw new Error(res?.message || 'Credenciais inválidas ou erro no servidor.');
      }

      if (res.token) {
        Cookies.set('token', res.token, {
          expires: 1,
          secure: true,
          sameSite: 'strict',
          path: '/'
        });

        loginSuccess(res.token);
        
        // Toast estilizado
        toast.success("Login realizado!", {
          description: "Bem-vindo de volta ao LogPack.",
          duration: 3000,
          icon: <CheckCircle2 className="h-5 w-5" />, 
        });
        
        router.push('/dashboard');
      }
    } catch (error) {
      const msg = error.message || 'Erro inesperado no login.';
      setGlobalError(msg);
      
      // Toast de erro
      toast.error("Acesso Negado", {
        description: msg,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground transition-colors duration-300">
      <Toaster 
        richColors 
        position="top-center" 
        closeButton
        theme="light"
        toastOptions={{
          style: {
            border: '1px solid var(--border)',
            padding: '16px',
          },
          classNames: {
            title: "text-sm font-bold",
            description: "text-xs opacity-90",
          }
        }}
      />

      <div className="w-full grid h-screen place-items-center">
        <div className="flex flex-col items-center justify-center w-full p-4 sm:p-8">
          
          <div className="mx-auto w-full max-w-sm flex flex-col justify-center space-y-6 border border-border rounded-xl bg-card text-card-foreground shadow-sm p-8">
           
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex justify-center mb-2"> 
                <LogoSite className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Bem vindo ao LogPack!</h1>
              <p className="text-sm text-muted-foreground">Faça login na sua conta para continuar.</p>
            </div>

            {/* SEÇÃO DE AVISOS (ALERTS) */}
            {globalError && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                <span>{globalError}</span>
              </div>
            )}

            {/* Formulário */}
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nome@example.com"
                          className="bg-background placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Senha</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-background placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive font-medium" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Login"}
                </Button>

              </form>
            </Form>

            {/* Rodapé da Box */}
            <p className="px-8 text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/cadastro" className="underline underline-offset-4 hover:text-primary transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };