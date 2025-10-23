import { GalleryVerticalEnd } from "lucide-react"
import Logo from "@/components/icons/logo";
import { SignupForm } from "@/components/ui/signup-form"
import { imageOptimizer } from "next/dist/server/image-optimizer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";

export default function SignupPage() {
  return (
    <div
      className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center justify-center">


        <a href="/" className="flex items-center gap-2 self-center font-bold">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md px-4">
            <Avatar className={"w-11 h-9 lg:w-11 lg:h-9 rounded-none"}>

              <AvatarImage src="./logo/Logo.png" className={'dark:hidden'} />
              <AvatarImage src="./logo/Logo.png" className={"hidden dark:block"} />

              <AvatarFallback>L</AvatarFallback>
            </Avatar>
          </div>
          LogPack
        </a>

        <SignupForm />
      </div>
    </div>
  );
}
