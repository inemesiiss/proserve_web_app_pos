"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import Header from "@/components/entertainment/components/Header";
import FoodSidebarNav from "@/components/food/components/SideBarNav";
import { menuData } from "@/data/food/products";

export default function FoodTransactionPage() {
  const { addItem } = useFoodOrder();
  const [selectedSize] = useState<Record<number, string>>({});
  const [filteredCategory, setFilteredCategory] = useState("All");

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
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 🧭 Sidebar Navigation */}
      <FoodSidebarNav onFilter={setFilteredCategory} />

      {/* 🍔 Main Content */}
      <motion.div
        className="flex-1 ml-[150px] w-full max-w-7xl mx-auto p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Header headerText="🍔 Food Menu" to="/food" />
        {/* 
        <h1 className="text-xl font-semibold text-gray-700 mb-6">
          Showing: <span className="text-blue-600">{filteredCategory}</span>
        </h1> */}

        {/* ==== 🥡 MEALS SECTION ==== */}
        {filteredMeals.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🍱 Meals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition-all p-4 flex flex-col items-center justify-between text-center h-[340px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-24 h-24 object-cover rounded-full mb-3 border border-gray-300"
                  />
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold text-gray-800 mb-1">
                      {meal.name}
                    </div>
                    {/* <div className="text-gray-600 mb-2">{meal.category}</div> */}
                    <div className="text-gray-700 font-semibold mb-3">
                      ₱{meal.base_price.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAdd(meal, "meal")}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🍔 Ala Carte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition-all p-4 flex flex-col items-center justify-between text-center h-[340px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-full mb-3 border border-gray-300"
                  />
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold text-gray-800 mb-1">
                      {product.name}
                    </div>
                    {/* <div className="text-gray-600 mb-2">{product.category}</div> */}
                    <div className="text-gray-700 font-semibold mb-3">
                      ₱{product.price.toFixed(2)}
                    </div>

                    {/* Optional Upgrade dropdown */}
                    {/* {product.upgradable && (
                      <select
                        className="border rounded-lg w-full p-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500"
                        value={selectedSize[product.id] || "Regular"}
                        onChange={(e) =>
                          setSelectedSize({
                            ...selectedSize,
                            [product.id]: e.target.value,
                          })
                        }
                      >
                        <option value="Regular">Regular</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    )} */}
                  </div>

                  <Button
                    onClick={() => handleAdd(product, "product")}
                    className="w-full bg-green-600 text-white hover:bg-green-700"
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
    </div>
  );
}
