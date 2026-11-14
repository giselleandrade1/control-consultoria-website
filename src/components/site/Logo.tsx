import { cn } from "@/lib/utils";
import logo from "@/assets/logo_control.png.asset.json";

export function LogoMark({ className }: { className?: string }) {
  return <img src={logo.url} alt="" width={239} height={218} className={cn("h-10 w-auto", className)} />;
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
