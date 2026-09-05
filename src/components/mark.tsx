import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      aria-hidden="true"
      fill="none"
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" className="stroke-fg/30" strokeWidth="1" />
      <rect x="6" y="13" width="2" height="5" rx="0.6" className="fill-fg" />
      <rect x="10" y="10" width="2" height="8" rx="0.6" className="fill-fg" />
      <rect x="14" y="7" width="2" height="11" rx="0.6" className="fill-accent" />
    </svg>
  );
}
