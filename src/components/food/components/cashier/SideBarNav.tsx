import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, ChevronLeft } from "lucide-react";
import { useGetCategoriesQuery } from "@/store/api/Transaction";

const DEFAULT_ITEMS = [{ id: 0, label: "All", image: "/food/food/meal.png" }];

interface FoodSidebarNavProps {
  onFilter: (categoryId: number | null, categoryLabel: string) => void;
}

export default function FoodSidebarNav({ onFilter }: FoodSidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const clientId = parseInt(localStorage.getItem("client") ?? "0");

  const { data: categoriesData = [] } = useGetCategoriesQuery(clientId);

  const items = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return [
        DEFAULT_ITEMS[0],
        ...categoriesData.map((cat) => ({
          id: cat.id,
          label: cat.name,
          // image: `/food/food/${cat.name.toLowerCase()}.png`,
        })),
      ];
    }
    return DEFAULT_ITEMS;
  }, [categoriesData]);

  const handleFilter = (categoryId: number, categoryLabel: string) => {
    setSelectedCategory(categoryLabel);
    onFilter(categoryId === 0 ? null : categoryId, categoryLabel);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 150 : 150 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
                 shadow-lg flex flex-col overflow-hidden"
    >
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

      <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-4">
        {items.map((item) => {
          const isActive = selectedCategory === item.label;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleFilter(item.id, item.label)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 w-full rounded-xl p-3 transition-all",
                isActive
                  ? "bg-blue-100 border border-blue-400 shadow-inner"
                  : "hover:bg-gray-100",
              )}
            >
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "text-sm font-medium text-center",
                    isActive ? "text-blue-600" : "text-gray-700",
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

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
