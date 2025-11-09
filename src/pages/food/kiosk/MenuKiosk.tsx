"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { menuData } from "@/data/food/products";
import type { Meal, Product } from "@/data/food/products";
import FoodSidebarNav from "@/components/food/components/kiosk/SideBarNav";
import BottomNavigator from "@/components/food/components/kiosk/BottomNavigator";
import CartModal from "@/components/food/components/kiosk/CartModal";
import MealCustomizationModal from "@/components/food/components/kiosk/MealCustomizationModal";
import ProductConfirmationModal from "@/components/food/components/kiosk/ProductConfirmationModal";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KioskMenuPage() {
  const {
    addItem,
    meals,
    products,
    updateQty,
    removeItem,
    grandTotal,
    upgradeDrink,
    upgradeFries,
    getAvailableUpgrades,
  } = useFoodOrder();
  const [selectedSize] = useState<Record<number, string>>({});
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

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

  // Combine meals and products for cart
  const allCartItems = useMemo(
    () => [...meals, ...products],
    [meals, products]
  );

  // Calculate cart totals
  const cartItemCount = allCartItems.reduce(
    (sum: number, item: any) => sum + item.qty,
    0
  );

  // ✅ Open confirmation/customization modal
  const handleAdd = (item: any, type: "meal" | "product") => {
    if (type === "meal") {
      setSelectedMeal(item);
      setIsMealModalOpen(true);
    } else {
      setSelectedProduct(item);
      setIsProductModalOpen(true);
    }
  };

  // Handle meal customization confirmation
  const handleMealConfirm = (customizedMeal: {
    meal: Meal;
    quantity: number;
    drinkUpgrade?: { productId: number; addedPrice: number };
    friesUpgrade?: { productId: number; addedPrice: number };
  }) => {
    const { meal, quantity, drinkUpgrade, friesUpgrade } = customizedMeal;

    // Calculate final price with upgrades
    let finalPrice = meal.base_price;
    if (drinkUpgrade) finalPrice += drinkUpgrade.addedPrice;
    if (friesUpgrade) finalPrice += friesUpgrade.addedPrice;

    // Add to cart with upgrades
    addItem({
      id: meal.id,
      name: meal.name,
      qty: quantity,
      price: finalPrice,
      basePrice: meal.base_price,
      size: selectedSize[meal.id] || "Regular",
      type: "meal",
      image: meal.image,
      category: meal.category,
      mealProductIds: meal.product_ids,
      upgrades: {
        drinkUpgrade: drinkUpgrade
          ? {
              originalId: 8,
              upgradedId: drinkUpgrade.productId,
              addedPrice: drinkUpgrade.addedPrice,
            }
          : undefined,
        friesUpgrade: friesUpgrade
          ? {
              originalId: 5,
              upgradedId: friesUpgrade.productId,
              addedPrice: friesUpgrade.addedPrice,
            }
          : undefined,
      },
    });
  };

  // Handle product confirmation
  const handleProductConfirm = (product: Product, quantity: number) => {
    addItem({
      id: product.id,
      name: product.name,
      qty: quantity,
      price: product.price,
      basePrice: product.price,
      size: selectedSize[product.id] || "Regular",
      type: "product",
      image: product.image,
      category: product.category,
    });
  };

  const handleHomeClick = () => {
    navigate("/kiosk/home");
  };

  const handleUpdateQuantity = (id: number, newQty: number) => {
    const item = allCartItems.find((i) => i.id === id);
    if (item) {
      updateQty(id, item.type, newQty);
    }
  };

  const handleRemoveItem = (id: number) => {
    const item = allCartItems.find((i) => i.id === id);
    if (item) {
      removeItem(id, item.type);
    }
  };

  const handleCheckout = () => {
    setIsCartModalOpen(false);
    // Navigate to checkout or payment page
    console.log("Proceeding to checkout with items:", allCartItems);
  };

  // Reusable Card Component for symmetry
  const ProductCard = ({ item, type, index, buttonColor }: any) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-200"
    >
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
          <span className="text-xs font-semibold text-gray-700">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Container - Consistent padding and spacing */}
      <div className="p-6 flex flex-col min-h-[200px]">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
          {item.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            ₱{(item.base_price || item.price).toFixed(2)}
          </span>
        </div>

        {/* Add Button - Consistent size */}
        <Button
          onClick={() => handleAdd(item, type)}
          className={`w-full h-14 text-lg font-bold ${buttonColor} text-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-auto`}
        >
          <Plus className="w-5 h-5" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"
    >
      {/* 🧭 Sidebar Navigation */}
      <FoodSidebarNav onFilter={setFilteredCategory} />
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Header - Stays at Top */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="px-6 py-6 lg:px-10 lg:py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-black text-gray-800 mb-3">
                Our Menu
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-lg lg:text-xl text-gray-600">Browsing:</p>
                <span className="px-4 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-lg">
                  {filteredCategory}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scrollable Content */}
        <motion.div
          className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10 no-scrollbar"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ==== 🥡 MEALS SECTION ==== */}
          {filteredMeals.length > 0 && (
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <h2 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">
                  Meal Combos
                </h2>
                <p className="text-gray-500 text-base">
                  Complete meals with sides and drinks
                </p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMeals.map((meal, index) => (
                  <ProductCard
                    key={meal.id}
                    item={meal}
                    type="meal"
                    index={index}
                    buttonColor="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ==== 🍟 ALA CARTE SECTION ==== */}
          {filteredProducts.length > 0 && (
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <h2 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">
                  Ala Carte
                </h2>
                <p className="text-gray-500 text-base">
                  Individual items and sides
                </p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    item={product}
                    type="product"
                    index={index}
                    buttonColor="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  />
                ))}
              </div>
            </section>
          )}

          {/* 🧃 No results - Modern Empty State */}
          {filteredMeals.length === 0 && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-6xl">🔍</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-700 mb-3">
                No items found
              </h3>
              <p className="text-xl text-gray-500 mb-2">
                in <strong className="text-gray-700">{filteredCategory}</strong>
              </p>
              <p className="text-lg text-gray-400">
                Try selecting a different category from the sidebar
              </p>
            </motion.div>
          )}

          {/* Add padding at bottom for the navigator */}
          <div className="h-32"></div>
        </motion.div>
      </div>

      {/* Bottom Navigator */}
      <BottomNavigator
        cartItemCount={cartItemCount}
        totalPrice={grandTotal}
        onHomeClick={handleHomeClick}
        onCartClick={() => setIsCartModalOpen(true)}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        items={allCartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onUpgradeDrink={upgradeDrink}
        onUpgradeFries={upgradeFries}
        getAvailableUpgrades={getAvailableUpgrades}
      />

      {/* Meal Customization Modal */}
      <MealCustomizationModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        meal={selectedMeal}
        onConfirm={handleMealConfirm}
      />

      {/* Product Confirmation Modal */}
      <ProductConfirmationModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onConfirm={handleProductConfirm}
      />
    </motion.div>
  );
}
