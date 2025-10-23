import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
export default function IconSiteTecnologia() {
    return (
        <Avatar className={"w-95 h-95 rounded-full p-1 hover:w-100 hover:h-100 transition-all duration-300 ease-in-out"}>

            <AvatarImage src="./icons/Log_Light.svg" className={'dark:hidden'} alt={"Centro LogPack"}/>
            <AvatarImage src="./icons/Log_Dark.svg" className={"hidden dark:block"} alt={"Centro LogPack"}/>

            <AvatarFallback>LP</AvatarFallback>
        </Avatar>
    )
}