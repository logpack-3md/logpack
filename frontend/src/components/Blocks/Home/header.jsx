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
import { Menu, LogIn } from "lucide-react";
import { SwitchTheme } from "@/components/SwitchThemes";
import { LogoSite } from "@/components/ui/icons-geral";

export default function Header() {
  return (
    <header className="w-full border-b bg-card sticky top-0 z-50 shadow-2xl">

      <div className="flex items-center justify-between w-full max-w-8xl mx-auto p-2">

        <div className="flex items-center gap-4 lg:gap-8">

          {/* Logo */}
          <div>
            <a className="flex items-center gap-1" href="/">

              <LogoSite />

              {/* px-2 apos isso é o Gradient */}
              <h2 className="font-bold text-xl bg-linear-to-r from-[#d15700] to-[#ff9a4d] bg-clip-text text-transparent 
              hover:from-[#b44e00] hover:to-[#ffb67e]" >
                LogPack
              </h2>
            </a>
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
                  <NavigationMenuLink href="/monitoramento" className="px-4 py-2 block">Monitoramento</NavigationMenuLink>
                  <NavigationMenuLink href="/consultoria" className="px-4 py-2 block">Consultoria</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>


              {/* item 3 */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={"font-bold"}>Contato</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/contato" className="px-4 py-2 block w-28">Contate-nos</NavigationMenuLink>
                  <NavigationMenuLink href="/suporte" className="px-4 py-2 block w-28">Suporte</NavigationMenuLink>
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

                      <a href="/" className="py-2 block text-sm hover:underline rounded-sm font-semibold">
                        Home
                      </a>

                    </AccordionItem>

                    {/* item 2 */}
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Serviços</AccordionTrigger>
                      <AccordionContent>
                        <a href="/monitoramento" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Monitoramento</a>
                        <a href="/consultoria" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Consultoria</a>
                      </AccordionContent>
                    </AccordionItem>


                    {/* item 3 */}
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Contato</AccordionTrigger>
                      <AccordionContent>
                        <a href="/contato" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Contate-nos</a>
                        <a href="/suporte" className="px-4 py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">Suporte</a>
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