"use client";
import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import { AnimatePresence } from "framer-motion";

export default function GlobalLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {    
    // Removemos a dependência do [pathname] e a lógica de resetar o state.
    // Agora, isso roda apenas UMA vez quando a aplicação é montada no navegador.
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Aumentei levemente para 800ms para garantir que a animação seja vista suavemente no primeiro load

    return () => clearTimeout(timer);
  }, []); 

  return (
    <>
      {/* AnimatePresence garante a animação de saída (exit) suave */}
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen />}
      </AnimatePresence>
      
      {/* O conteúdo infantil é renderizado, mas fica escondido/por baixo até o splash sair, 
          ou pode ser renderizado condicionalmente se preferir economizar DOM */}
      {!isLoading && children}
    </>
  );
}