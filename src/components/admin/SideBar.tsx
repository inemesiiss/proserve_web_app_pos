"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  // BookText,
  Building2,
  Combine,
  MonitorStop,
  User,
  Package,
  Menu,
  ChevronLeft,
} from "lucide-react";
import Logo from "@/assets/PROSERVELOGO.png";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
  subPaths?: Array<{
    label: string;
    path: string;
    icon?: React.ReactNode;
  }>;
};

interface SideBarProps extends React.ComponentPropsWithoutRef<"aside"> {
  navs?: NavItem[];
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const SideBar = React.forwardRef<HTMLDivElement, SideBarProps>(
  (props, ref) => {
    const { navs: propsNavs, className, onCollapsedChange } = props;
    const location = useLocation();
    const [collapsed, setCollapsed] = React.useState<boolean>(() => {
      try {
        const v = localStorage.getItem("sidebar_collapsed");
        return v === "1";
      } catch (e) {
        return false;
      }
    });
    const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

    const defaultNavs: NavItem[] = [
      {
        label: "Dashboard",
        path: "/bm/dashboard",
        icon: <LayoutDashboard className="w-6 h-6" />,
      },
      // {
      //   label: "Reports",
      //   path: "/admin/reports",
      //   icon: <BookText className="w-6 h-6" />,
      // },
      {
        label: "Account",
        path: "/bm/accounts",
        icon: <Building2 className="w-6 h-6" />,
      },
      {
        label: "Branch",
        path: "/bm/branch",
        icon: <Combine className="w-6 h-6" />,
      },
      {
        label: "Terminal",
        path: "/bm/terminal",
        icon: <MonitorStop className="w-6 h-6" />,
      },
      {
        label: "User",
        path: "/bm/users",
        icon: <User className="w-6 h-6" />,
      },
      {
        label: "Product",
        path: "/bm/product",
        icon: <Package className="w-6 h-6" />,
      },
    ];

    const navs = propsNavs ?? defaultNavs;

    const isActive = (link?: string): boolean => {
      if (!link) return false;
      const linkPath = link.split("?")[0];
      return location.pathname === linkPath;
    };

    const isParentActive = (link?: string): boolean => {
      if (!link) return false;
      const linkPath = link.split("?")[0];
      return location.pathname.startsWith(linkPath);
    };

    const toggleOpen = (key: string) =>
      setOpenMap((s) => ({ ...s, [key]: !s[key] }));

    const asideClass = cn(
      "fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg flex flex-col overflow-hidden",
      className
    );

    return (
      <motion.aside
        ref={ref}
        animate={{ width: collapsed ? 90 : 200 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={asideClass}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-gray-700 dark:text-gray-200"
            >
              <div className="flex justify-center mt-6">
                <img src={Logo} alt="App Logo" className="w-36 h-auto" />
              </div>
            </motion.h3>
          )}
          <button
            onClick={() => {
              setCollapsed((s) => {
                const next = !s;
                try {
                  localStorage.setItem("sidebar_collapsed", next ? "1" : "0");
                } catch (e) {}
                // notify parent (if provided)
                try {
                  onCollapsedChange?.(next);
                } catch (e) {}
                return next;
              });
            }}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {collapsed ? (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Scrollable Nav Section */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-3">
          {navs.map((item) => {
            const active = isActive(item.path);
            const parentActive = isParentActive(item.path);
            const hasChildren =
              Array.isArray(item.subPaths) && item.subPaths.length > 0;
            const isOpen = !!openMap[item.label];

            return (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {hasChildren ? (
                  <div
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-lg transition-all",
                      parentActive
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-transparent"
                    )}
                  >
                    <button
                      onClick={() => toggleOpen(item.label)}
                      className="flex items-center gap-3 w-full text-left"
                      aria-expanded={isOpen}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-md p-2",
                          parentActive
                            ? "bg-indigo-50 dark:bg-indigo-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        )}
                      >
                        {item.icon}
                      </div>

                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="text-sm"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    {!collapsed && (
                      <button
                        onClick={() => toggleOpen(item.label)}
                        className={cn(
                          "p-1 rounded",
                          isOpen
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-400 dark:text-gray-500"
                        )}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <ChevronLeft
                          className={cn(
                            "w-4 h-4 transition-transform",
                            isOpen && "rotate-90"
                          )}
                        />
                      </button>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={cn(
                      "flex items-center gap-3 w-full p-3 rounded-lg transition-all",
                      active
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-md p-2",
                        active
                          ? "bg-indigo-50 dark:bg-indigo-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      )}
                    >
                      {item.icon}
                    </div>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}

                {/* children */}
                <AnimatePresence>
                  {hasChildren && isOpen && !collapsed && (
                    <motion.div
                      className="pl-10 mt-1 space-y-1 overflow-hidden"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                        opacity: { duration: 0.2 },
                      }}
                    >
                      {item.subPaths!.map((sub, index) => {
                        const subActive = isActive(sub.path);
                        return (
                          <motion.div
                            key={sub.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.05,
                              duration: 0.2,
                              ease: "easeOut",
                            }}
                          >
                            <Link
                              to={sub.path || "#"}
                              className={cn(
                                "flex items-center gap-2 w-full p-2 rounded text-sm transition-all duration-200",
                                subActive
                                  ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                              )}
                            >
                              {sub.icon && (
                                <span className="flex-shrink-0 w-4 h-4">
                                  {sub.icon}
                                </span>
                              )}
                              <span>{sub.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400"
            >
              © 2025 ProServe Admin
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    );
  }
);

SideBar.displayName = "SideBar";
