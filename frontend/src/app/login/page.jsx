import { LoginForm } from "@/components/ui/login-form"
import LogoSite from "@/components/icons/logo";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">


        <a href="/" className="flex items-center gap-2 self-center font-bold">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md px-4">
            <LogoSite />
          </div>
          LogPack
        </a>

        <LoginForm />
      </div>
    </div>
  );
}
