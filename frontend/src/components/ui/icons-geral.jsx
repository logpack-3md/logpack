import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";

function LogoSite() {
    return (
        <Avatar className={"w-16 h-16 rounded-full p-1"}>

            <AvatarImage src="./Logo/Logo_Light.svg" className={'dark:hidden'} alt={"LogPack"} />
            <AvatarImage src="./Logo/Logo_Dark.svg" className={"hidden dark:block"} alt={"LogPack"} />

            <AvatarFallback>LP</AvatarFallback>
        </Avatar>
    )
}

function IconSiteSobre() {
    return (
        <Avatar className={"w-full h-full rounded-full p-1 transition-all duration-300 ease-in-out"}>

            <AvatarImage src="./icons/Log_Light.svg" className={'dark:hidden'} alt={"Centro LogPack"}/>
            <AvatarImage src="./icons/Log_Dark.svg" className={"hidden dark:block"} alt={"Centro LogPack"}/>

            <AvatarFallback>LP</AvatarFallback>
        </Avatar>
    )
}

export { LogoSite, IconSiteSobre };
 