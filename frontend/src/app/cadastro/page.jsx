import { GalleryVerticalEnd } from "lucide-react"
import { SignupForm } from "@/components/ui/signup-form"
import { imageOptimizer } from "next/dist/server/image-optimizer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";

export default function SignupPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
