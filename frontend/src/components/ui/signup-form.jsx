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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogoSite } from "@/components/ui/icons-geral";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export function SignupForm({ className, ...props }) {
const router = useRouter()
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSingUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, cpf, email, password, confirmPassword, role })
      })

      const data = await response.json()


      if (response.ok && !data.message) { 
        toast.success("Cadastro realizado com sucesso!", {
            description: "Seus dados foram enviados para o sistema.",
            duration: 2000,
        });

        setTimeout(() => {
            toast.warning("Conta aguardando ativação.", {
                description: "Somente o administrador pode ativar sua conta para acesso.",
                duration: 5000,
            });

            setTimeout(() => {
                router.push('/login');
            }, 3000);

        }, 2000);
      } 

      else if (data.message) {
        toast.error("Erro no cadastro", {
            description: data.message
        });
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de Conexão", {
        description: 'Não foi possível se conectar ao servidor. Tente novamente.'
      });
      setIsLoading(false);
    }
  }


  return (
    <>
      <Card className={cn("w-full max-w-lg lg:w-200", className)} {...props}>
        <CardHeader className="text-center">

          <div className="flex justify-center mb-4">
            <a href="/" className="flex items-center gap-2 self-center font-bold">
              <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md px-4">
                <LogoSite />
              </div>
            </a>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Crie sua conta no LogPack!
          </CardTitle>
          <CardDescription>
            Preencha o formulário para criar sua conta empresarial.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            <form className="grid gap-3" onSubmit={handleSingUp}>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

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
                <div className="grid gap-2 ">
                  <Label htmlFor="role">Cargo</Label>
                  <Select onValueChange={(value) => { setRole(value) }} >
                    <SelectTrigger id="role" className="w-full">
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
                  <Input id="confirm-password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" placeholder="••••••••" required />
                </div>
              </div>

              {/* Cadastro e footerzin */}
              <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col text-center text-sm text-muted-foreground gap-1 lg:gap-4">
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
      
      {/* Componente Toaster necessário para renderizar os avisos */}
      <Toaster richColors position="top-center" /> 
    </>
  );
}