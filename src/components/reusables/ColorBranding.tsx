import { useMemo } from "react";

// Convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Get luminance
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Check if color is dark
function isDarkColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return getLuminance(r, g, b) < 0.5;
}

// Custom hook to determine contrasting text color
export function useColorBranding(bgColor: string): string {
  return useMemo(() => {
    if (!bgColor) return "#000";
    return isDarkColor(bgColor) ? "#fff" : "#000";
  }, [bgColor]);
}
