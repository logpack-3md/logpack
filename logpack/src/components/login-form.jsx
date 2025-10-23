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

export function LoginForm({ className, ...props }) {
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
          {/* Formulário de CPF e Senha */}
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="cpf"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              
              </div>
              <Input id="password" type="password" placeholder="••••••••" required />
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
          <a href="#" className="font-medium underline-offset-4 hover:text-primary hover:underline"> Cadastre-se </a>
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