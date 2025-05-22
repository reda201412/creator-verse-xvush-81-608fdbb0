
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define our own ThemeProviderProps type instead of importing from next-themes
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  enableSystem?: boolean;
  themes?: string[];
  forcedTheme?: string;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
