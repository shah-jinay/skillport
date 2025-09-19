import { useEffect, useState } from "react";

/**
 * ThemeToggle
 * Persists theme in localStorage, syncs with prefers-color-scheme,
 * toggles a "dark" class on <html>.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("sp-theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("sp-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("sp-theme", "light");
    }
  }, [dark]);

  return (
    <button
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 shadow-sm"
      onClick={() => setDark(v => !v)}
      aria-label="Toggle theme"
      type="button"
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
