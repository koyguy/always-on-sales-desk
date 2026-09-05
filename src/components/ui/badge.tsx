import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs tracking-wide",
  {
    variants: {
      tone: {
        muted: "bg-raised text-muted",
        live: "bg-accent/15 text-accent",
        warn: "bg-warn/15 text-warn",
        danger: "bg-danger/15 text-danger",
        fg: "bg-fg/10 text-fg",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
