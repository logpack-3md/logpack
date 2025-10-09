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
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SwitchTheme } from "../SwitchThemes";

export default function Header() {
    return (
        <header className="w-full border-b  backdrop-blur-2xl  bg-gradient-to-r from-header-color1 to-header-color2 sticky top-0 z-50">

            <div className="flex items-center justify-between w-full max-w-8xl mx-auto p-4">

                <div className="flex items-center gap-4 lg:gap-8">

                    {/* Logo */}
                    <div className="flex items-center lg:pl-10 lg:pr-30">
                        <Avatar className={"w-12 h-11 lg:w-23 lg:h-17 rounded-none"}>
                            <AvatarImage src="./logo/log1.png" />
                            <AvatarFallback>L</AvatarFallback>
                        </Avatar>
                        {/* px-2 apos isso é o Gradient */}
                        <h2 className="font-bold text-xl px-2 bg-gradient-to-r from-[#75543d] to-[#946949] bg-clip-text text-transparent 
                        hover:from-[#8f5f3b] hover:to-[#e0a273]" >
                            LogPack
                        </h2>
                    </div>





                    {/* NavBar */}
                    <NavigationMenu viewport={false} className="hidden lg:block">
                        {/* não criar varios menuList. caso queira fazer mais itens faça copiando o MenuItem */}
                        <NavigationMenuList className="space-x-5">

                            {/* item 1 */}
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/" className="px-4 py-2 block text-lg font-bold rounded-md">Home</NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* item 2 */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={"font-bold"}>Sobre</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink href="/sobre" className="px-2 py-2 block w-27">Nossa História</NavigationMenuLink>
                                    <NavigationMenuLink href="/sobre" className="px-2 py-2 block w-27">Objetivo</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* item 3 */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={"font-bold"}>Serviços</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink href="/servicos" className="px-4 py-2 block">Assistência</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>


                            {/* item 4 */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={"font-bold"}>Contato</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink href="/contato" className="px-4 py-2 block w-28">Contate-nos</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>


                {/* Avatar do usuario e Menu Mobile*/}
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">

                        <Drawer direction="right">

                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" /> {/* Ícone de 3 barrinhas */}
                                </Button>
                            </DrawerTrigger>

                            <DrawerContent className="h-full right-0 mt-0 w-64 fixed bottom-0 rounded-none">

                                <DrawerHeader className="text-left">
                                    <DrawerTitle>LogPack Navegação</DrawerTitle>
                                    <DrawerDescription>Explore nossas opções</DrawerDescription>
                                </DrawerHeader>

                                <div className="p-4 overflow-y-auto">
                                    <Accordion type="single" collapsible className="w-full">
                                        {/* item 1 */}
                                        <AccordionItem value="item-1">
                                            <AccordionContent>
                                                <a href="/" className="py-2 block text-sm hover:bg-accent hover:text-accent-foreground rounded-sm">
                                                    Home
                                                </a>
                                            </AccordionContent>
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
                                        <Button variant="outline">Fechar</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>


                    <SwitchTheme />


                    {/* Avatar */}
                    <Avatar className={"w-10 h-10 lg:w-12 lg:h-12"}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>

            </div>
        </header>
    )
}