import { cn } from "@/lib/utils";

const logo = "/images/logo_control.png";

export function LogoMark({ className }: { className?: string }) {
  return <img src={logo} alt="" width={239} height={218} className={cn("h-10 w-auto", className)} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#inicio" className={cn("flex items-center gap-2.5", className)} aria-label="Control Consultoria — início">
      <LogoMark />
      <span className="font-display text-xl font-bold leading-none sm:text-2xl">
        Control <span className="text-leaf">Consultoria</span>
      </span>
    </a>
  );
}
