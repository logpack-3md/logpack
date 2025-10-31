"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function LoginForm({ className, ...props }) {

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log({ email, password })
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error ("ERRO AO FAZER LOGIN")
      }
      if (data.token) {
        Cookies.set('token', data.token, {
          expires: 1,
          secure: true,
          sameSite: 'strict'
        })

        // alert('login bem sucedido')
        console.log(data)
        router.push('/userList')
      }
      if(data)
      alert(data.message)
    } catch (error) {

    }
  }

  return (
    <Card className={cn("w-full max-w-sm", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Bem-vindo de volta!
        </CardTitle>
        <CardDescription>
          Faça login com a sua conta empresarial para continuar.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          {/* Formulário de email e Senha */}
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@gmail.com"
                className={"bg-background"}
                required
                value = {email}
                onChange={(e) => { setEmail(e.target.value) }} 
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              
              </div>
              <Input id="password" type="password" className={"bg-background"} placeholder="••••••••" required 
                              value = {password}
                onChange={(e) => { setPassword(e.target.value) }}/>
            </div>
            <Button type="submit" className="w-full font-semibold">
              Entrar
            </Button>
          </form>    
        </div>
      </CardContent>

      <CardFooter className="flex flex-col text-center text-sm text-muted-foreground gap-4">

        
        <p> 
          Não tem uma conta?
          {" "}
          <a href="/cadastro" className="font-medium underline-offset-4 hover:text-primary hover:underline"> Cadastre-se </a>
        </p>


        <p className="px-6 text-xs">Ao continuar, você concorda com nossos
          {" "}
          <a href="#" className="underline hover:text-primary"> Termos de Serviço </a>
          {" "}
          e
          {" "}
          <a href="#" className="underline hover:text-primary"> Política de Privacidade </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
}