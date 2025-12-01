import Link from "next/link";
import { PackageX, MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="relative mx-auto h-32 w-32 flex items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20">
            <PackageX className="h-16 w-16 text-primary" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-destructive text-destructive-foreground flex items-center justify-center rounded-full text-xs font-bold shadow-lg animate-bounce">
                404
            </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pacote não localizado
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-[90%] mx-auto">
            A rota que você tentou acessar não existe ou foi movida. 
            Assim como uma remessa sem etiqueta, esta página está perdida no sistema.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-accent hover:text-accent-foreground transition-all active:scale-95"
          >
            <Home size={18} />
            <span>Ir para Início</span>
          </Link>
        </div>

        <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-12">
            LogPack System • Error 404
        </div>
        
      </div>
    </div>
  );
}