import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  ...props
}) => {
  return (
    <img
      src="/images/android-chrome-192x192.png"
      alt="logo"
      className={cn("size-7", className)}
      {...props} />
  );
};
