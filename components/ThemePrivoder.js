"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const stored = localStorage.getItem("difa-theme");
    setTheme(stored || "system");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (t) => {
      const isDark =
        t === "dark" ||
        (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply(theme);
    localStorage.setItem("difa-theme", theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => theme === "system" && apply("system");
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
