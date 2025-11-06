/*
 * DARK MODE & THEMING SYSTEM - COMPLETE GUIDE
 * ============================================
 *
 * FEATURES:
 * ---------
 * ✅ Custom primary/secondary colors (API-driven or defaults)
 * ✅ Dark/Light mode with automatic system preference detection
 * ✅ Manual theme toggle with settings panel
 * ✅ No color flash on page load
 * ✅ Persistent user preferences (localStorage)
 * ✅ Smooth transitions between modes
 *
 * DARK MODE COMPONENTS:
 * ---------------------
 *
 * 1. Full Settings Toggle (Recommended for settings page):
 * ```tsx
 * import { ThemeToggle } from "@/components/reusables/ThemeToggle";
 *
 * <ThemeToggle />
 * // Shows: Light / Dark / System options in a popover
 * ```
 *
 * 2. Quick Toggle (Recommended for navbar):
 * ```tsx
 * import { QuickThemeToggle } from "@/components/reusables/QuickThemeToggle";
 *
 * <QuickThemeToggle />
 * // Simple sun/moon icon button that toggles between light/dark
 * ```
 *
 * DARK MODE STYLING:
 * ------------------
 *
 * 1. Using Tailwind dark: prefix:
 * ```tsx
 * <div className="bg-white dark:bg-gray-900">
 *   <h1 className="text-gray-900 dark:text-white">Title</h1>
 *   <p className="text-gray-600 dark:text-gray-300">Description</p>
 *   <div className="border-gray-200 dark:border-gray-700">Card</div>
 * </div>
 * ```
 *
 * 2. Common Dark Mode Patterns:
 * ```tsx
 * // Backgrounds
 * bg-white dark:bg-gray-900
 * bg-gray-50 dark:bg-gray-800
 * bg-gray-100 dark:bg-gray-700
 *
 * // Text
 * text-gray-900 dark:text-white
 * text-gray-700 dark:text-gray-200
 * text-gray-600 dark:text-gray-300
 * text-gray-500 dark:text-gray-400
 *
 * // Borders
 * border-gray-200 dark:border-gray-700
 * border-gray-300 dark:border-gray-600
 *
 * // Hover states
 * hover:bg-gray-100 dark:hover:bg-gray-800
 * hover:text-gray-900 dark:hover:text-white
 * ```
 *
 * 3. Using Theme Hook:
 * ```tsx
 * import { useTheme } from "@/context/ThemeProvider";
 *
 * function MyComponent() {
 *   const { mode, setMode, resolvedMode } = useTheme();
 *
 *   // mode: "light" | "dark" | "system" (user's preference)
 *   // resolvedMode: "light" | "dark" (actual active mode)
 *
 *   return (
 *     <div>
 *       <p>Preference: {mode}</p>
 *       <p>Active: {resolvedMode}</p>
 *
 *       <button onClick={() => setMode("light")}>Light</button>
 *       <button onClick={() => setMode("dark")}>Dark</button>
 *       <button onClick={() => setMode("system")}>System</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * PRIMARY/SECONDARY COLOR USAGE:
 * -------------------------------
 *
 * These colors work in BOTH light and dark modes!
 *
 * 1. CSS Classes:
 * ```tsx
 * <span className="text-primary">Primary Text</span>
 * <span className="text-secondary">Secondary Text</span>
 * <div className="bg-primary text-white">Primary Background</div>
 * <div className="bg-secondary text-white">Secondary Background</div>
 * <div className="bg-primary/10">10% opacity</div>
 * <div className="border-primary">Primary Border</div>
 * ```
 *
 * 2. CSS Variables:
 * ```tsx
 * <div style={{
 *   backgroundColor: 'var(--color-primary)',
 *   color: 'white'
 * }}>
 *   Custom styled element
 * </div>
 * ```
 *
 * 3. Dynamic Colors from Hook:
 * ```tsx
 * const { colors } = useTheme();
 *
 * <div style={{ color: colors.primary }}>
 *   Programmatic styling
 * </div>
 * ```
 *
 * API INTEGRATION:
 * ----------------
 *
 * Edit src/context/ThemeProvider.tsx to connect your API:
 * ```tsx
 * const response = await fetch("/api/theme/colors");
 * ```
 *
 * Expected API Response:
 * ```json
 * {
 *   "primary": "#3b82f6",
 *   "secondary": "#22c55e"
 * }
 * ```
 *
 * HOW IT WORKS:
 * -------------
 *
 * 1. App starts → ThemeProvider initializes
 * 2. Load saved theme mode from localStorage ("light"/"dark"/"system")
 * 3. If "system", detect browser preference via media query
 * 4. Apply dark/light class to <html> element
 * 5. Load cached colors from localStorage → Apply instantly
 * 6. Fetch fresh colors from API → Update if different
 * 7. Listen for system theme changes → Auto-update if mode is "system"
 *
 * NO COLOR FLASH because:
 * - CSS variables defined in index.css with defaults
 * - Cached colors applied before first render
 * - Loading screen shown during initial API fetch
 * - Dark mode class applied immediately from localStorage
 *
 * COMPLETE EXAMPLE:
 * -----------------
 */

import { useTheme } from "@/context/ThemeProvider";
import { ThemeToggle } from "@/components/reusables/ThemeToggle";
import { QuickThemeToggle } from "@/components/reusables/QuickThemeToggle";

export function CompleteThemeExample() {
  const { colors, mode, resolvedMode } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header with theme toggles */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="text-primary">Pro</span>
            <span className="text-secondary">Pos</span>
          </h1>

          <div className="flex items-center gap-2">
            <QuickThemeToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Theme info card */}
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Theme
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                Mode: <span className="font-medium capitalize">{mode}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Active:{" "}
                <span className="font-medium capitalize">{resolvedMode}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Primary: <span className="font-medium">{colors.primary}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Secondary:{" "}
                <span className="font-medium">{colors.secondary}</span>
              </p>
            </div>
          </div>

          {/* Primary colored card */}
          <div className="p-6 bg-primary/10 border-2 border-primary rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Primary Themed Card
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              This card uses the primary color theme
            </p>
          </div>

          {/* Secondary colored card */}
          <div className="p-6 bg-secondary/10 border-2 border-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Secondary Themed Card
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              This card uses the secondary color theme
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Neutral Button
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
