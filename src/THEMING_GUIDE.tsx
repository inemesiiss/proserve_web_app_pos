/*
 * CENTRALIZED THEMING SYSTEM - USAGE GUIDE
 * =========================================
 *
 * This system allows you to:
 * 1. Use default colors (blue-500 and green-500 from login)
 * 2. Load custom colors from API on app start
 * 3. Cache colors in localStorage for instant loading
 * 4. Show loading screen only on first load (no color flash)
 *
 * SETUP:
 * ------
 * Already done in App.tsx:
 * ```tsx
 * <ThemeProvider>
 *   <YourApp />
 * </ThemeProvider>
 * ```
 *
 * USAGE IN COMPONENTS:
 * --------------------
 *
 * 1. Using CSS Classes (Recommended):
 * ```tsx
 * <span className="text-primary">Primary Color Text</span>
 * <span className="text-secondary">Secondary Color Text</span>
 * <div className="bg-primary">Primary Background</div>
 * <div className="bg-secondary">Secondary Background</div>
 * <div className="bg-primary/10">Primary with 10% opacity</div>
 * <button className="hover:bg-primary">Hover effect</button>
 * ```
 *
 * 2. Using the Theme Hook (Dynamic):
 * ```tsx
 * import { useTheme } from "@/context/ThemeProvider";
 *
 * function MyComponent() {
 *   const { colors, setColors, isLoading } = useTheme();
 *
 *   return (
 *     <div>
 *       <div style={{ color: colors.primary }}>Custom styled</div>
 *       <button onClick={() => setColors({
 *         primary: '#ff0000',
 *         secondary: '#00ff00'
 *       })}>
 *         Change Colors
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * 3. Using CSS Variables Directly:
 * ```tsx
 * <div style={{ backgroundColor: 'var(--color-primary)' }}>
 *   Direct CSS variable
 * </div>
 * ```
 *
 * API INTEGRATION:
 * ----------------
 * Update the API endpoint in ThemeProvider.tsx:
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
 * FLOW:
 * -----
 * 1. App starts → Shows ThemeLoadingScreen
 * 2. Check localStorage for cached colors → Apply immediately if found
 * 3. Fetch from API → Update colors if different
 * 4. Save to localStorage → Hide loading screen
 * 5. If API fails → Use cached or default colors
 *
 * NO COLOR FLASH because:
 * - Loading screen shown while fetching
 * - Cached colors applied instantly
 * - Default colors in CSS (index.css) match login page
 *
 * AVAILABLE UTILITIES:
 * --------------------
 * Text colors:
 * - text-primary
 * - text-secondary
 * - hover:text-primary
 * - hover:text-secondary
 *
 * Backgrounds:
 * - bg-primary
 * - bg-secondary
 * - bg-primary/10 (10% opacity)
 * - bg-primary/20 (20% opacity)
 * - bg-secondary/10
 * - bg-secondary/20
 * - hover:bg-primary
 * - hover:bg-secondary
 *
 * Borders:
 * - border-primary
 * - border-secondary
 */

// Example Component
import { useTheme } from "@/context/ThemeProvider";

export function ExampleThemedComponent() {
  const { colors } = useTheme();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        <span className="text-primary">Primary</span> and{" "}
        <span className="text-secondary">Secondary</span> Colors
      </h1>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-primary text-white rounded hover:opacity-90">
          Primary Button
        </button>
        <button className="px-4 py-2 bg-secondary text-white rounded hover:opacity-90">
          Secondary Button
        </button>
      </div>

      <div className="p-4 bg-primary/10 border-2 border-primary rounded">
        Primary themed card
      </div>

      <div className="p-4 bg-secondary/10 border-2 border-secondary rounded">
        Secondary themed card
      </div>

      <div className="text-sm text-gray-600">
        Current colors: Primary: {colors.primary}, Secondary: {colors.secondary}
      </div>
    </div>
  );
}
