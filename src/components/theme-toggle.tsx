"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

/* خواندن/گوش‌دادن به تم به‌عنوان یک «external store» (به‌جای useState+useEffect)
   تا از مقداردهی state داخل effect پرهیز شود و مشکل هایدریشن هم نداشته باشیم. */
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function notifyThemeChange() {
  for (const listener of listeners) listener();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("nova-theme", next);
    } catch {
      /* ignore */
    }
    notifyThemeChange();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "تغییر به تم روشن" : "تغییر به تم تیره"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted transition-all duration-300 hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5" strokeWidth={1.8} />
      ) : (
        <Moon className="h-4.5 w-4.5" strokeWidth={1.8} />
      )}
    </button>
  );
}
