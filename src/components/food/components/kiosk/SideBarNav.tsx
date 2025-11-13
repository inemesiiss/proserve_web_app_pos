import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { label: "All", image: "/food/food/meal.png" },
  { label: "Chickens", image: "/food/food/chicken.png" },
  { label: "Pasta", image: "/food/food/spag.png" },
  { label: "Burgers", image: "/food/food/burger.png" },
  { label: "Fries", image: "/food/food/fries.png" },
  { label: "Beverages", image: "/food/food/drinks.png" },
  { label: "Desserts", image: "/food/food/dessert.png" },
];

interface FoodSidebarNavProps {
  onFilter: (category: string) => void;
}

export default function FoodSidebarNav({ onFilter }: FoodSidebarNavProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    onFilter(category);
  };

  return (
    <aside className="w-50 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 shadow-xl flex flex-col overflow-hidden h-full">
      {/* Modern Header */}
      <div className="p-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-black text-center mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pro
            </span>
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Pos
            </span>
          </h1>
          <p className="text-sm text-center text-gray-400 font-medium tracking-wider uppercase">
            Food Menu
          </p>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <div className="space-y-4">
          {items.map((item, index) => {
            const isActive = selectedCategory === item.label;
            return (
              <motion.button
                key={item.label}
                onClick={() => handleFilter(item.label)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "group relative w-full flex flex-col items-center gap-4 px-5 py-6 rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/40"
                    : "bg-white hover:bg-gray-50 shadow-md hover:shadow-lg"
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Content */}
                <div className="relative flex flex-col items-center gap-4 w-full">
                  {/* Image Container - Bigger */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-32 h-32 flex items-center justify-center rounded-2xl transition-all duration-300",
                      isActive
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-purple-50"
                    )}
                  >
                    <motion.img
                      src={item.image}
                      alt={item.label}
                      className="w-28 h-28 object-contain mix-blend-multiply"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Label - Bigger Text */}
                  <span
                    className={cn(
                      "text-xl font-bold transition-colors duration-300 text-center",
                      isActive
                        ? "text-white"
                        : "text-gray-700 group-hover:text-blue-600"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modern Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white"
      >
        <img
          src="/PROSERVERLOGO.png"
          alt="Proserv Logo"
          className="h-14 object-contain mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
        />
      </motion.div>
    </aside>
  );
}
