"use client";

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
import { Separator } from "@/components/ui/separator";
import { LogoSite } from "@/components/ui/icons-geral";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 8 characters long"),
});

const Login = () => {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { loginSuccess } = useAuth()

  const onSubmit = async (data) => {
    try {
      const res = await api.post("users/login", data);

      if (!res || res.error) {
        throw new Error(res?.message || 'Erro ao comunicar com o servidor.');
      }

      if (res.token) {
        Cookies.set('token', res.token, {
          expires: 1,
          secure: true,
          sameSite: 'strict',
          path: '/'
        });

        loginSuccess(res.token);
        toast.success(res.message || "Login realizado.");
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Erro inesperado no login.');
    }
  }


  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full grid h-screen">
        <div className="flex items-center justify-center p-8">
          <div className="mx-auto w-full max-w-sm flex flex-col justify-center space-y-6 border rounded-xl bg-card text-card-foreground shadow-sm p-8">
           
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex justify-center mb-2"> <LogoSite className="h-10 w-10" /></div>
              <h1 className="text-2xl font-semibold tracking-tight">Bem vindo ao LogPack!</h1>
              <p className="text-sm text-muted-foreground">Faça login na sua conta para continuar.</p>
            </div>

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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                        <Link
                          href="#"
                          className="text-sm font-medium text-muted-foreground hover:underline"
                        >
                          Esqueceu senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>

              </form>
            </Form>

            {/* Rodapé da Box */}
            <p className="px-8 text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/cadastro" className="underline underline-offset-4 hover:text-primary">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
