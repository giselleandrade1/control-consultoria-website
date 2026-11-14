import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Pill label + Playfair title (highlighted words in green) + optional subtitle. */
export function SectionTitle({
  pill,
  children,
  sub,
  center = true,
  className,
}: {
  pill: string;
  children: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      <span className="pill">{pill}</span>
      <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">{children}</h2>
      {sub && <p className="mt-4 text-lg text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

export function Hl({ children }: { children: ReactNode }) {
  return <span className="text-leaf">{children}</span>;
}

/** Full-bleed photo behind a section, under the brand indigo overlay. */
export function PhotoBackdrop({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      <div className="overlay-photo absolute inset-0" />
    </div>
  );
}
