import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  ...props
}) => {
  return (
    <img
      src="/public/ "
      alt="logo"
      className={cn("size-7", className)}
      {...props} />
  );
};
