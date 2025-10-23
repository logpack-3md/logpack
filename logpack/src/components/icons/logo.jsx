import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
export default function LogoSite() {
    return (
        <Avatar className={"w-16 h-16 rounded-full p-1"}>

            <AvatarImage src="./Logo/Logo_Light.svg" className={'dark:hidden'} />
            <AvatarImage src="./Logo/Logo_Dark.svg" className={"hidden dark:block"} />

            <AvatarFallback>LP</AvatarFallback>
        </Avatar>
    )
}