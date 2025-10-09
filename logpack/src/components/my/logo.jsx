import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
export default function logo() {
    return (
        <Avatar className={"w-12 h-11 lg:w-22 lg:h-17 rounded-none"}>

            <AvatarImage src="./logo/Logo.png" className={'dark:hidden'} />
            <AvatarImage src="./logo/Logo.png" className={"hidden dark:block"} />

            <AvatarFallback>L</AvatarFallback>
        </Avatar>
    )
}