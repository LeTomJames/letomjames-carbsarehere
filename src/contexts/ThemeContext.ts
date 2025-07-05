import { createContext } from "react";

type ColorScheme = "light" | "dark";

export interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
