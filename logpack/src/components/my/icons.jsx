import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
export default function IconSite() {
    return (
        <Avatar className={"w-full h-full rounded-full p-1"}>

            <AvatarImage src="./icons/Log_Light.svg" className={'dark:hidden'} alt={"Centro LogPack"}/>
            <AvatarImage src="./icons/Log_Dark.svg" className={"hidden dark:block"} alt={"Centro LogPack"}/>

            <AvatarFallback>LP</AvatarFallback>
        </Avatar>
    )
}