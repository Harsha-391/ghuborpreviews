"use client";

import React, { createContext, useContext } from "react";

// The site is light-only. This module keeps the old hook API so existing
// callers (admin, product page) compile, but there is no state, no effect and
// no <html> class mutation any more.
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const noop = () => {};
const LIGHT: ThemeContextType = { theme: "light", toggleTheme: noop, setTheme: noop };

const ThemeContext = createContext<ThemeContextType>(LIGHT);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
