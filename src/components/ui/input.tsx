import * as React from "react";

import { cn } from "@/src/utils/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border-b border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground transition-[border-color,border-width] duration-65 focus-visible:border-b-2 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
