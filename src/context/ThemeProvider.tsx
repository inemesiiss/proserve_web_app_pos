import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import ThemeLoadingScreen from "@/components/reusables/ThemeLoadingScreen";

type ThemeMode = "light" | "dark" | "system";

interface ThemeColors {
  primary: string;
  secondary: string;
  primaryRgb?: string;
  secondaryRgb?: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  isLoading: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default colors from your login page
const DEFAULT_COLORS: ThemeColors = {
  primary: "#3b82f6", // blue-500
  secondary: "#22c55e", // green-500
  primaryRgb: "59, 130, 246",
  secondaryRgb: "34, 197, 94",
};

// Convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
    result[3],
    16,
  )}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColorsState] = useState<ThemeColors>(DEFAULT_COLORS);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme-mode");
    return (saved as ThemeMode) || "system";
  });
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Resolve system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolvedMode = () => {
      if (mode === "system") {
        setResolvedMode(mediaQuery.matches ? "dark" : "light");
      } else {
        setResolvedMode(mode);
      }
    };

    updateResolvedMode();

    // Listen for system theme changes
    mediaQuery.addEventListener("change", updateResolvedMode);
    return () => mediaQuery.removeEventListener("change", updateResolvedMode);
  }, [mode]);

  // Apply dark/light mode to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedMode);
  }, [resolvedMode]);

  // Apply colors to CSS variables
  const applyColors = (themeColors: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", themeColors.primary);
    root.style.setProperty("--color-secondary", themeColors.secondary);
    root.style.setProperty(
      "--color-primary-rgb",
      themeColors.primaryRgb || hexToRgb(themeColors.primary),
    );
    root.style.setProperty(
      "--color-secondary-rgb",
      themeColors.secondaryRgb || hexToRgb(themeColors.secondary),
    );
  };

  // Fetch colors from API
  useEffect(() => {
    const fetchThemeColors = async () => {
      try {
        // Check localStorage first (cached from previous session)
        const cachedColors = localStorage.getItem("theme-colors");
        if (cachedColors) {
          const parsed = JSON.parse(cachedColors);
          setColorsState(parsed);
          applyColors(parsed);
          setIsLoading(false);
        }

        // Then fetch from API
        // Replace with your actual API endpoint
        const response = await fetch("/api/theme/colors");
        const contentType = response.headers.get("content-type");

        if (response.ok && contentType?.includes("application/json")) {
          const data = await response.json();
          const newColors: ThemeColors = {
            primary: data.primary || DEFAULT_COLORS.primary,
            secondary: data.secondary || DEFAULT_COLORS.secondary,
            primaryRgb:
              data.primaryRgb ||
              hexToRgb(data.primary || DEFAULT_COLORS.primary),
            secondaryRgb:
              data.secondaryRgb ||
              hexToRgb(data.secondary || DEFAULT_COLORS.secondary),
          };

          setColorsState(newColors);
          applyColors(newColors);
          localStorage.setItem("theme-colors", JSON.stringify(newColors));
        } else {
          // API failed, use defaults
          if (!cachedColors) {
            applyColors(DEFAULT_COLORS);
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme colors:", error);
        // Use cached or defaults
        if (!localStorage.getItem("theme-colors")) {
          applyColors(DEFAULT_COLORS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemeColors();
  }, []);

  const setColors = (newColors: ThemeColors) => {
    const colorsWithRgb = {
      ...newColors,
      primaryRgb: newColors.primaryRgb || hexToRgb(newColors.primary),
      secondaryRgb: newColors.secondaryRgb || hexToRgb(newColors.secondary),
    };
    setColorsState(colorsWithRgb);
    applyColors(colorsWithRgb);
    localStorage.setItem("theme-colors", JSON.stringify(colorsWithRgb));
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  return (
    <ThemeContext.Provider
      value={{ colors, setColors, isLoading, mode, setMode, resolvedMode }}
    >
      {isLoading ? <ThemeLoadingScreen /> : children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
