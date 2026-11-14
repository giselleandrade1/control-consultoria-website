import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Light/dark switch; the choice is saved on the device (dark is the default). */
export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("control-theme", next ? "light" : "dark");
    } catch {
      /* storage unavailable: the choice lasts until reload */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Ativar tema escuro" : "Ativar tema claro"}
      title={light ? "Tema escuro" : "Tema claro"}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-leaf hover:text-leaf",
        className,
      )}
    >
      {light ? <Moon className="h-5 w-5" aria-hidden /> : <Sun className="h-5 w-5" aria-hidden />}
    </button>
  );
}
