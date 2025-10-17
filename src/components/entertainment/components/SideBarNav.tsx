import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, ChevronLeft } from "lucide-react";

const items = [
  { label: "Tickets", path: "/cinema/tickets", image: "/images/ticket.png" },
  { label: "Snack", path: "/cinema/snacks", image: "/images/popcorn.png" },
];

export default function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: collapsed ? 150 : 150 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
                 shadow-lg flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-gray-700"
          ></motion.h3>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {collapsed ? (
            <Menu className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* ✅ Scrollable Section (scrolls but invisible scrollbar) */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-4">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl p-3 transition-all",
                isActive
                  ? "bg-blue-100 border border-blue-400 shadow-inner"
                  : "hover:bg-gray-100"
              )}
            >
              <motion.img
                src={item.image}
                alt={item.label}
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-blue-600" : "text-gray-700"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
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
            <img
              src="/PROSERVERLOGO.png"
              alt="Proserv Logo"
              className="h-12 md:h-16 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
