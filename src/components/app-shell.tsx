import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Mark } from "@/components/mark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Brief" },
  { to: "/floor", label: "Floor" },
  { to: "/architecture", label: "Architecture" },
  { to: "/economics", label: "Economics" },
  { to: "/dashboards", label: "Dashboards" },
  { to: "/guardrails", label: "Guardrails" },
  { to: "/decision", label: "Decision" },
] as const;

export function AppShell({
  children,
  flush,
}: {
  children: ReactNode;
  flush?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <Mark />
            <span className="min-w-0">
              <span className="block font-mono text-xs tracking-[0.18em] text-muted">
                EMBIFI
              </span>
              <span className="block truncate text-sm font-medium leading-none">
                Sales Desk
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    active ? "bg-raised text-fg" : "text-muted hover:bg-raised hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-faint sm:inline">v0.3 · review</span>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-md text-fg shadow-[var(--shadow-border)] xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-30 bg-bg pt-14 xl:hidden">
          <nav className="flex flex-col gap-1 px-6 py-8" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 font-serif text-3xl",
                  pathname === item.to ? "text-fg" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <main
        className={cn(
          flush
            ? "lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden"
            : "mx-auto max-w-7xl px-4 py-10 sm:py-14",
        )}
      >
        {children}
      </main>
    </div>
  );
}
