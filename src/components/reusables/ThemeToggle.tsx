import { useTheme } from "@/context/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { mode, setMode, resolvedMode } = useTheme();

  const themes = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Theme Settings
          </p>
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = mode === theme.value;

            return (
              <button
                key={theme.value}
                onClick={() => setMode(theme.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{theme.label}</span>
                {isActive && <div className="h-2 w-2 rounded-full bg-white" />}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current:{" "}
              <span className="font-medium capitalize">{resolvedMode}</span>
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
