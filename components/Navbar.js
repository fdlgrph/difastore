"use client";
import { useState } from "react";
import { Moon, Sun, Monitor, Store, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const cycleTheme = () => {
    const next = { light: "dark", dark: "system", system: "light" }[theme];
    setTheme(next);
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <Store className="w-6 h-6 text-indigo-600" /> Difa Store
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/" className="hover:text-indigo-600">Home</a>
          <a href="/#products" className="hover:text-indigo-600">Products</a>
          <a href="/track-order" className="hover:text-indigo-600">Track Order</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title={`Theme: ${theme}`}
          >
            <ThemeIcon className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <a href="/" onClick={() => setOpen(false)}>Home</a>
          <a href="/#products" onClick={() => setOpen(false)}>Products</a>
          <a href="/track-order" onClick={() => setOpen(false)}>Track Order</a>
        </div>
      )}
    </nav>
  );
}
