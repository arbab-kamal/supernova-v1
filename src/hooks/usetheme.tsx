import { useEffect, useState } from "react";
import { themes } from "@/lib/constant";

export type ThemeType = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem("theme") as ThemeType) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = themes[theme];

    Object.entries(selectedTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
