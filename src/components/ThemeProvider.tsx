import React, { useState, useEffect } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ThemeContext } from "../contexts/ThemeContext";

type ColorScheme = "light" | "dark";

const theme = createTheme({
  primaryColor: "blue",
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    // Get saved theme from localStorage or default to light
    const saved = localStorage.getItem("mantine-color-scheme");
    return (saved as ColorScheme) || "light";
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("mantine-color-scheme", colorScheme);
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        <Notifications />
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};
