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

export function SignupForm({ className, ...props }) {
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
          <form className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Nome */}
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nome Completo</Label>
                <Input id="full-name" placeholder="Seu nome completo" required />
              </div>

              {/* CPF */}
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  required
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
                />
              </div>

              {/* Cargo */}
              <div className="grid gap-2">
                <Label htmlFor="role">Cargo</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Funcionario</SelectItem>
                    <SelectItem value="designer">Gerente de Produção</SelectItem>
                    <SelectItem value="project-manager">Administrador</SelectItem>
                    <SelectItem value="analyst">Gerente de Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Senha e Confirm Senha */}
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
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