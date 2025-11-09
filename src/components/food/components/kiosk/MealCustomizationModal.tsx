import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Meal } from "@/data/food/products";
import { menuData } from "@/data/food/products";

interface MealCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal | null;
  onConfirm: (customizedMeal: {
    meal: Meal;
    quantity: number;
    drinkUpgrade?: { productId: number; addedPrice: number };
    friesUpgrade?: { productId: number; addedPrice: number };
  }) => void;
}

export default function MealCustomizationModal({
  isOpen,
  onClose,
  meal,
  onConfirm,
}: MealCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedDrinkUpgrade, setSelectedDrinkUpgrade] = useState<
    number | null
  >(null);
  const [selectedFriesUpgrade, setSelectedFriesUpgrade] = useState<
    number | null
  >(null);

  if (!meal) return null;

  // Check if meal has regular drink or fries
  const hasRegularDrink = meal.product_ids.includes(8); // Regular Drink ID
  const hasRegularFries = meal.product_ids.includes(5); // Regular Fries ID

  // Get upgrade options
  const drinkUpgrades = hasRegularDrink
    ? menuData.upgrades.drinks
        .map((upgrade) => {
          const product = menuData.products.find(
            (p) => p.id === upgrade.to_product_id
          );
          return product
            ? { ...product, additionalPrice: upgrade.additional_price }
            : null;
        })
        .filter(Boolean)
    : [];

  const friesUpgrades = hasRegularFries
    ? menuData.upgrades.fries
        .map((upgrade) => {
          const product = menuData.products.find(
            (p) => p.id === upgrade.to_product_id
          );
          return product
            ? { ...product, additionalPrice: upgrade.additional_price }
            : null;
        })
        .filter(Boolean)
    : [];

  // Calculate total price
  let totalPrice = meal.base_price * quantity;

  if (selectedDrinkUpgrade) {
    const drinkUpgrade = drinkUpgrades.find(
      (u) => u?.id === selectedDrinkUpgrade
    );
    if (drinkUpgrade) {
      totalPrice += drinkUpgrade.additionalPrice * quantity;
    }
  }

  if (selectedFriesUpgrade) {
    const friesUpgrade = friesUpgrades.find(
      (u) => u?.id === selectedFriesUpgrade
    );
    if (friesUpgrade) {
      totalPrice += friesUpgrade.additionalPrice * quantity;
    }
  }

  const handleConfirm = () => {
    const drinkUpgrade = selectedDrinkUpgrade
      ? drinkUpgrades.find((u) => u?.id === selectedDrinkUpgrade)
      : null;
    const friesUpgrade = selectedFriesUpgrade
      ? friesUpgrades.find((u) => u?.id === selectedFriesUpgrade)
      : null;

    onConfirm({
      meal,
      quantity,
      drinkUpgrade: drinkUpgrade
        ? {
            productId: drinkUpgrade.id,
            addedPrice: drinkUpgrade.additionalPrice,
          }
        : undefined,
      friesUpgrade: friesUpgrade
        ? {
            productId: friesUpgrade.id,
            addedPrice: friesUpgrade.additionalPrice,
          }
        : undefined,
    });

    // Reset state
    setQuantity(1);
    setSelectedDrinkUpgrade(null);
    setSelectedFriesUpgrade(null);
    onClose();
  };

  const handleCancel = () => {
    setQuantity(1);
    setSelectedDrinkUpgrade(null);
    setSelectedFriesUpgrade(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Customize Your Meal</h2>
                    <p className="text-green-100 text-sm">
                      Upgrade and personalize your order
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Meal Info */}
                <div className="flex items-start gap-6 mb-8 bg-gray-50 rounded-2xl p-6">
                  <div className="w-32 h-32 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {meal.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Base Price: ₱{meal.base_price.toFixed(2)}
                    </p>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      {meal.category}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Quantity
                  </h4>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Minus className="w-6 h-6 text-gray-700" />
                    </button>
                    <span className="text-4xl font-black text-gray-800 w-20 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Plus className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Drink Upgrades */}
                {drinkUpgrades.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      🥤 Upgrade Your Drink
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Regular Option */}
                      <button
                        onClick={() => setSelectedDrinkUpgrade(null)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedDrinkUpgrade === null
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-bold text-gray-800">Regular</p>
                          <p className="text-sm text-gray-600">
                            No extra charge
                          </p>
                          {selectedDrinkUpgrade === null && (
                            <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                          )}
                        </div>
                      </button>

                      {/* Upgrade Options */}
                      {drinkUpgrades.map((upgrade: any) => (
                        <button
                          key={upgrade.id}
                          onClick={() => setSelectedDrinkUpgrade(upgrade.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedDrinkUpgrade === upgrade.id
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="text-center">
                            <p className="font-bold text-gray-800">
                              {upgrade.name}
                            </p>
                            <p className="text-sm text-green-600 font-semibold">
                              +₱{upgrade.additionalPrice}
                            </p>
                            {selectedDrinkUpgrade === upgrade.id && (
                              <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fries Upgrades */}
                {friesUpgrades.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      🍟 Upgrade Your Fries
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Regular Option */}
                      <button
                        onClick={() => setSelectedFriesUpgrade(null)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedFriesUpgrade === null
                            ? "border-orange-600 bg-orange-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-bold text-gray-800">Regular</p>
                          <p className="text-sm text-gray-600">
                            No extra charge
                          </p>
                          {selectedFriesUpgrade === null && (
                            <Check className="w-5 h-5 text-orange-600 mx-auto mt-2" />
                          )}
                        </div>
                      </button>

                      {/* Upgrade Options */}
                      {friesUpgrades.map((upgrade: any) => (
                        <button
                          key={upgrade.id}
                          onClick={() => setSelectedFriesUpgrade(upgrade.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedFriesUpgrade === upgrade.id
                              ? "border-orange-600 bg-orange-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="text-center">
                            <p className="font-bold text-gray-800">
                              {upgrade.name}
                            </p>
                            <p className="text-sm text-green-600 font-semibold">
                              +₱{upgrade.additionalPrice}
                            </p>
                            {selectedFriesUpgrade === upgrade.id && (
                              <Check className="w-5 h-5 text-orange-600 mx-auto mt-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Total & Actions */}
              <div className="border-t-2 border-gray-200 bg-gray-50 px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-600 text-lg mb-1">Total Price</p>
                    <p className="text-5xl font-black text-gray-800">
                      ₱{totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Quantity</p>
                    <p className="text-3xl font-bold text-green-600">
                      {quantity}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={handleCancel}
                    className="flex-1 h-16 text-xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
