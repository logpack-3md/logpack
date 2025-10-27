"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as z from zod
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Importe os componentes do Select
import { HelpCircle } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

    static createSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }),
        cpf: z.string().refine(validarCpf, { message: "CPF inválido. Verifique o formato ou os dígitos verificadores." }),
        email: z.email({ message: "Digite um email válido." }),
        password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres." }),
        role: z.enum(['employee', 'admin', 'buyer', 'manager'], { message: "A função é obrigatória." })
    });

export function SignupForm({ className, ...props }) {
  


  const router = useRouter()
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')


  const handleSingUp = async (e) => {
    e.preventDefault()
    // console.log({ email, password })
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, cpf, email, password, role })
      })

      const data = await response.json()
      console.log(data)
      if (!data.message) {
        console.log("Pedido de Cadastro enviado")
        router.push('/login')
      }


        // alert('login bem sucedido')
        // console.log(data)
      
      if (data.message)
        alert(data.message)
    } catch (error) {

    }
  }


  return (
    <Card className={cn("w-200 max-w-lg", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Crie sua conta
        </CardTitle>
        <CardDescription>
          Preencha o formulário para criar sua conta empresarial.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          <form className="grid gap-4" onSubmit={handleSingUp}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Nome */}
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nome Completo</Label>
                <Input id="full-name" placeholder="Seu nome completo" required
                  value={name}
                  onChange={(e) => { setName(e.target.value) }} />
              </div>

              {/* CPF */}
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  required
                  value={cpf}
                  onChange={(e) => { setCpf(e.target.value) }}
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@empresa.com"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value) }}
                />
              </div>

              {/* Cargo */}
              <div className="grid gap-2">
                <Label htmlFor="role">Cargo</Label>
                <Select onValueChange={(value) => { setRole(value) }}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Funcionário</SelectItem>
                    <SelectItem value="manager">Gerente de Produção</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="buyer">Gerente de Compras</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              {/* Senha e Confirm Senha */}
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value) }} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" required />
              </div>
            </div>

            {/* Cadastro e footerzin */}
            <Button type="submit" className="w-full font-semibold">
              Cadastrar
            </Button>
          </form>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col text-center text-sm text-muted-foreground gap-4">
        <p>
          Já tem uma conta?
          {" "}
          <a href="/login" className="font-medium underline-offset-4 hover:text-primary hover:underline"> Login </a>
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