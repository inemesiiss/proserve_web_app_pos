import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, ChevronLeft } from "lucide-react";

const items = [
  { label: "Child", image: "/indoor/child.png" },
  // { label: "Meals", image: "/food/food/meal.png" },
  { label: "Adult", image: "/indoor/adult.png" },
];

interface FoodSidebarNavProps {
  onFilter: (category: string) => void;
}

export default function IndoorSidebarNav({ onFilter }: FoodSidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    onFilter(category);
  };

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
          >
            Menu
          </motion.h3>
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

      {/* ✅ Scrollable Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-4">
        {items.map((item) => {
          const isActive = selectedCategory === item.label;
          return (
            <motion.button
              key={item.label}
              onClick={() => handleFilter(item.label)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 w-full rounded-xl p-3 transition-all",
                isActive
                  ? "bg-blue-100 border border-blue-400 shadow-inner"
                  : "hover:bg-gray-100"
              )}
            >
              <div
                className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-xl",
                  isActive ? "bg-blue-50" : "bg-gray-50"
                )}
              >
                <motion.img
                  src={item.image}
                  alt={item.label}
                  className="w-12 h-12 object-contain mix-blend-multiply drop-shadow-md"
                />
              </div>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "text-sm font-medium text-center",
                    isActive ? "text-blue-600" : "text-gray-700"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
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
              className="h-12 md:h-16 object-contain mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
