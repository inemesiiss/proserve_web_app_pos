import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error";
}

const variantClasses: Record<string, string> = {
  default:
    "bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-transparent",
  secondary:
    "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 border-transparent",
  success: "bg-green-500 text-white border-transparent",
  warning: "bg-yellow-400 text-gray-900 border-transparent",
  error: "bg-red-500 text-white border-transparent",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export default Badge;
