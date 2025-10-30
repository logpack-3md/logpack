import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
export default function IconSiteTecnologia() {
    return (
        <Avatar className={"w-full h-full rounded-full p-1 hover:w-45 hover:h-45 lg:hover:w-97 lg:hover:h-97 transition-all duration-300 ease-in-out"}>

            <AvatarImage src="./icons/Log_Light.svg" className={'dark:hidden'} alt={"Centro LogPack"}/>
            <AvatarImage src="./icons/Log_Dark.svg" className={"hidden dark:block"} alt={"Centro LogPack"}/>

            <AvatarFallback>LP</AvatarFallback>
        </Avatar>
    )
}