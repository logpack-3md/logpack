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
import { Logo } from "@/components/blocks/Login/logo";
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
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2 p-4">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <Logo className="h-9 w-9" />
          <p className="mt-4 text-xl font-semibold tracking-tight">
            Log in to Shadcn UI Blocks
          </p>


          <Form {...form}>
            <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" className="w-full"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password"
                        className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <Button type="submit" className="mt-4 w-full">
                Continue with Email
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5">
            <Link
              href="#"
              className="text-sm block underline text-muted-foreground text-center">
              Forgot your password?
            </Link>
            <p className="text-sm text-center">
              Don&apos;t have an account?
              <Link href="#" className="ml-1 underline text-muted-foreground">
                Create account
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block rounded-lg border" />
      </div>
    </div>
  );
};

export default Login;
