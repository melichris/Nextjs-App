"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

const listeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    listeners.forEach((listener) => listener());
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md p-2 text-ink-muted hover:text-ink hover:bg-surface transition"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
