import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Menu, LogIn } from "lucide-react"; // Importando o ícone de Login
import { SwitchTheme } from "../SwitchThemes";
import LogoSite from "@/components/icons/logo";

export default function Header() {
  return (
    <header className="w-full border-b bg-card sticky top-0 z-50 shadow-2xl">

      <div className="flex items-center justify-between w-full max-w-8xl mx-auto p-2">

        <div className="flex items-center gap-4 lg:gap-8">

          {/* Logo */}
          <div className="flex items-center gap-1">

            <LogoSite />
            
            {/* px-2 apos isso é o Gradient */}
            <h2 className="font-bold text-xl bg-gradient-to-r from-[#75543d] to-[#946949] bg-clip-text text-transparent 
              hover:from-[#8f5f3b] hover:to-[#e0a273]" >
              LogPack
            </h2>
          </div>

          {/* NavBar */}
          <NavigationMenu viewport={false} className="hidden lg:block">
            {/* não criar varios menuList. caso queira fazer mais itens faça copiando o MenuItem */}
            <NavigationMenuList className="space-x-1">

              {/* item 1 */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="px-4 block text-lg font-bold rounded-md">Home</NavigationMenuLink>
              </NavigationMenuItem>


              {/* item 2 */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={"font-bold"}>Serviços</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/servicos" className="px-4 py-2 block">Assistência</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>


              {/* item 3 */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={"font-bold"}>Contato</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/contato" className="px-4 py-2 block w-28">Contate-nos</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

        </div>


        {/* Botão de Login, Avatar do usuario e Menu Mobile*/}
        <div className="flex items-center gap-2 md:gap-4">

          <SwitchTheme />


          {/* Botão de Login */}
          <a href="/login" className="hidden px-5  lg:block">
            <Button variant="outline" className={"bg-background"}>
              <LogIn className="mr-2 h-4 w-4" /> {/* Ícone de login */}
              Login
            </Button>
          </a>


          <div className="lg:hidden">

            <Drawer direction="right">

              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" /> {/* Ícone de 3 barrinhas */}
                </Button>
              </DrawerTrigger>

              <DrawerContent className="h-full right-0 mt-0 w-64 fixed bottom-0 rounded-none">


                <DrawerHeader className="text-left">
                  <DrawerTitle>LogPack</DrawerTitle>
                  <DrawerDescription>Explore nossas opções</DrawerDescription>
                </DrawerHeader>

                <div className="p-4 overflow-y-auto">

                  {/* Botão de Login para o Drawer */}
                  <div className="pb-4">
                    <a href="/login" className="w-full">
                      <Button className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </a>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {/* item 1 */}
                    <AccordionItem value="item-1">

                      <a href="/" className="py-2 block text-sm hover:underline rounded-sm">
                        Home
                      </a>

                    </AccordionItem>

                    {/* item 2 */}
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Serviços</AccordionTrigger>
                      <AccordionContent>
                        <a href="/servicos" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Assistência</a>
                      </AccordionContent>
                    </AccordionItem>

                    {/* item 3 */}
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Sobre</AccordionTrigger>
                      <AccordionContent>
                        <a href="/sobre" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Nossa História</a>
                        <a href="/sobre" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Objetivo</a>
                      </AccordionContent>
                    </AccordionItem>

                    {/* item 4 */}
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Contato</AccordionTrigger>
                      <AccordionContent>
                        <a href="/contato" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Contate-nos</a>
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline" className={"font-bold text-md"}>Fechar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

          </div>

        </div>

      </div>

    </header>
  )
}