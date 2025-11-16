"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import Header from "@/components/food/components/cashier/Header";
import FoodSidebarNav from "@/components/food/components/cashier/SideBarNav";
import { menuData } from "@/data/food/products";
import MealCustomizationModal from "@/components/food/modals/MealCustomizationModal";
// Removed DeviceSettingsModal and Settings import

export default function FoodTransactionPage() {
  const { addItem } = useFoodOrder();
  const [selectedSize] = useState<Record<number, string>>({});
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  // Removed showDeviceSettings state

  // ✅ Filter logic for meals and products
  const filteredMeals = useMemo(() => {
    if (filteredCategory === "All") return menuData.meals;
    return menuData.meals.filter((meal) => meal.category === filteredCategory);
  }, [filteredCategory]);

  const filteredProducts = useMemo(() => {
    if (filteredCategory === "All") return menuData.products;
    return menuData.products.filter(
      (product) => product.category === filteredCategory
    );
  }, [filteredCategory]);

  // ✅ Handle add to cart for either product or meal
  const handleAdd = (item: any, type: "meal" | "product") => {
    // Check if meal has variances - open customization modal
    if (type === "meal" && item.variances && item.variances.length > 0) {
      setSelectedMeal(item);
      setShowCustomizationModal(true);
    } else {
      // Add directly to cart if no variances
      addItem({
        id: item.id,
        name: item.name,
        qty: 1,
        price: item.base_price || item.price,
        size: selectedSize[item.id] || "Regular",
        type,
        image: item.image,
        category: item.category,
      });
    }
  };

  const handleCustomizationConfirm = (customization: any) => {
    addItem({
      id: customization.meal.id,
      name: customization.meal.name,
      qty: 1,
      price: customization.totalPrice,
      size: "Customized",
      type: "meal",
      image: customization.meal.image,
      category: customization.meal.category,
      customization: customization.customizationDetails,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 🧭 Sidebar Navigation */}
      <FoodSidebarNav onFilter={setFilteredCategory} />

      {/* Settings Button removed, now handled in layout */}

      {/* 🍔 Main Content */}
      <motion.div
        className="flex-1 ml-[150px] w-full max-w-7xl mx-auto p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Header headerText="🍔 Food Menu" to="/food/main" showSettings={true} />
        {/* 
        <h1 className="text-xl font-semibold text-gray-700 mb-6">
          Showing: <span className="text-blue-600">{filteredCategory}</span>
        </h1> */}

        {/* ==== 🥡 MEALS SECTION ==== */}
        {filteredMeals.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Meals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-20 h-20 object-cover rounded-full mb-2 border border-gray-300"
                  />
                  <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                    <div className="text-sm font-bold text-gray-800 text-center">
                      {meal.nickname}
                    </div>
                    <div className="text-sm text-gray-700 font-semibold">
                      ₱{meal.base_price.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAdd(meal, "meal")}
                    className="w-full bg-gray-600 text-white hover:bg-green-700 h-8 text-xs mt-auto"
                  >
                    Add Meal
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ==== 🍟 ALA CARTE SECTION ==== */}
        {filteredProducts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Ala Carte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-full mb-2 border border-gray-300"
                  />
                  <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                    <div className="text-sm font-bold text-gray-800 text-center">
                      {product.nickname}
                    </div>
                    <div className="text-sm text-gray-700 font-semibold">
                      ₱{product.price.toFixed(2)}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAdd(product, "product")}
                    className="w-full bg-gray-600 text-white hover:bg-green-700 h-8 text-xs mt-auto"
                  >
                    Add Item
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 🧃 No results */}
        {filteredMeals.length === 0 && filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No items found in <strong>{filteredCategory}</strong>
          </div>
        )}
      </motion.div>

      {/* Device Settings Modal removed, now handled in layout */}

      {/* Meal Customization Modal */}
      <MealCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        meal={selectedMeal}
        onConfirm={handleCustomizationConfirm}
      />
    </div>
  );
}
