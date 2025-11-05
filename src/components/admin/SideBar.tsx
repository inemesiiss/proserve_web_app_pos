"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookText,
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
        path: "/admin/dashboard",
        icon: <LayoutDashboard className="w-6 h-6" />,
      },
      {
        label: "Reports",
        path: "/admin/reports",
        icon: <BookText className="w-6 h-6" />,
      },
      {
        label: "Account",
        path: "/admin/account",
        icon: <Building2 className="w-6 h-6" />,
      },
      {
        label: "Branch",
        path: "/admin/branch",
        icon: <Combine className="w-6 h-6" />,
        subPaths: [
          { label: "Add Branch", path: "/admin/branch/add" },
          { label: "Manage Branch", path: "/admin/branch/manage" },
        ],
      },
      {
        label: "Terminal",
        path: "/admin/terminal",
        icon: <MonitorStop className="w-6 h-6" />,
      },
      {
        label: "User",
        path: "/admin/users",
        icon: <User className="w-6 h-6" />,
      },
      {
        label: "Product",
        path: "/admin/product",
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
      "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col overflow-hidden",
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
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-gray-700"
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
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {collapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
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
            const isOpen = !!openMap[item.label] || parentActive;

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
                        ? "bg-indigo-100 text-indigo-600 border border-indigo-300"
                        : "hover:bg-gray-100 text-gray-700 border border-transparent"
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
                          parentActive ? "bg-indigo-50" : "bg-gray-50"
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
                          isOpen ? "text-indigo-600" : "text-gray-400"
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
                        ? "bg-indigo-100 text-indigo-600 border border-indigo-300"
                        : "hover:bg-gray-100 text-gray-700 border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-md p-2",
                        active ? "bg-indigo-50" : "bg-gray-50"
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
                {hasChildren && isOpen && !collapsed && (
                  <div className="pl-10 mt-1 space-y-1">
                    {item.subPaths!.map((sub) => {
                      const subActive = isActive(sub.path);
                      return (
                        <Link
                          key={sub.label}
                          to={sub.path || "#"}
                          className={cn(
                            "block w-full p-2 rounded text-sm",
                            subActive
                              ? "bg-indigo-50 text-indigo-600"
                              : "hover:bg-gray-100 text-gray-700"
                          )}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
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
              className="p-4 border-t border-gray-200 text-xs text-center text-gray-500"
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
