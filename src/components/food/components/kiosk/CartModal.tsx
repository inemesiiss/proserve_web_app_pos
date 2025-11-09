import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@/context/food/FoodOrderProvider";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: number, newQty: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onUpgradeDrink?: (
    id: number,
    type: "meal" | "product",
    toProductId: number
  ) => void;
  onUpgradeFries?: (
    id: number,
    type: "meal" | "product",
    toProductId: number
  ) => void;
  getAvailableUpgrades?: (item: OrderItem) => {
    drinks: {
      productId: number;
      name: string;
      price: number;
      additionalPrice: number;
    }[];
    fries: {
      productId: number;
      name: string;
      price: number;
      additionalPrice: number;
    }[];
  };
}

export default function CartModal({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onUpgradeDrink,
  onUpgradeFries,
  getAvailableUpgrades,
}: CartModalProps) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
            <div className="bg-white rounded-3xl shadow-2xl w-full h-[90vh] max-w-6xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Your Cart</h2>
                    <p className="text-blue-100 text-sm">
                      {totalItems} {totalItems === 1 ? "item" : "items"} in cart
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Add some delicious items to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => {
                      const availableUpgrades = getAvailableUpgrades?.(
                        item
                      ) ?? { drinks: [], fries: [] };
                      const hasUpgrades =
                        availableUpgrades.drinks.length > 0 ||
                        availableUpgrades.fries.length > 0;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-5">
                            {/* Item Image */}
                            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-bold text-gray-800 mb-1 truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                  {item.category}
                                </span>
                                {item.size && (
                                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                                    {item.size}
                                  </span>
                                )}
                              </div>
                              <p className="text-2xl font-black text-green-600">
                                ₱{item.price.toFixed(2)}
                              </p>
                              {item.upgrades && (
                                <div className="mt-2 space-y-1">
                                  {item.upgrades.drinkUpgrade && (
                                    <p className="text-xs text-blue-600 font-semibold">
                                      🥤 Upgraded Drink (+₱
                                      {item.upgrades.drinkUpgrade.addedPrice})
                                    </p>
                                  )}
                                  {item.upgrades.friesUpgrade && (
                                    <p className="text-xs text-orange-600 font-semibold">
                                      🍟 Upgraded Fries (+₱
                                      {item.upgrades.friesUpgrade.addedPrice})
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  onUpdateQuantity(
                                    item.id,
                                    Math.max(1, item.qty - 1)
                                  )
                                }
                                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors active:scale-95"
                              >
                                <Minus className="w-5 h-5 text-gray-700" />
                              </button>
                              <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                                {item.qty}
                              </span>
                              <button
                                onClick={() =>
                                  onUpdateQuantity(item.id, item.qty + 1)
                                }
                                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors active:scale-95"
                              >
                                <Plus className="w-5 h-5 text-white" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right min-w-[120px]">
                              <p className="text-sm text-gray-500 mb-1">
                                Subtotal
                              </p>
                              <p className="text-2xl font-black text-gray-800">
                                ₱{(item.price * item.qty).toFixed(2)}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors active:scale-95"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>

                          {/* Upgrade Options */}
                          {hasUpgrades && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                <ArrowUp className="w-4 h-4 text-blue-600" />
                                <p className="text-sm font-bold text-gray-700">
                                  Upgrade Your Order:
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {/* Drink Upgrades */}
                                {availableUpgrades.drinks.map((upgrade) => (
                                  <button
                                    key={upgrade.productId}
                                    onClick={() =>
                                      onUpgradeDrink?.(
                                        item.id,
                                        item.type,
                                        upgrade.productId
                                      )
                                    }
                                    disabled={
                                      item.upgrades?.drinkUpgrade
                                        ?.upgradedId === upgrade.productId
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                                      item.upgrades?.drinkUpgrade
                                        ?.upgradedId === upgrade.productId
                                        ? "bg-blue-600 text-white cursor-default"
                                        : "bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                                    }`}
                                  >
                                    🥤 {upgrade.name} (+₱
                                    {upgrade.additionalPrice})
                                    {item.upgrades?.drinkUpgrade?.upgradedId ===
                                      upgrade.productId && " ✓"}
                                  </button>
                                ))}

                                {/* Fries Upgrades */}
                                {availableUpgrades.fries.map((upgrade) => (
                                  <button
                                    key={upgrade.productId}
                                    onClick={() =>
                                      onUpgradeFries?.(
                                        item.id,
                                        item.type,
                                        upgrade.productId
                                      )
                                    }
                                    disabled={
                                      item.upgrades?.friesUpgrade
                                        ?.upgradedId === upgrade.productId
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                                      item.upgrades?.friesUpgrade
                                        ?.upgradedId === upgrade.productId
                                        ? "bg-orange-600 text-white cursor-default"
                                        : "bg-white border-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                                    }`}
                                  >
                                    🍟 {upgrade.name} (+₱
                                    {upgrade.additionalPrice})
                                    {item.upgrades?.friesUpgrade?.upgradedId ===
                                      upgrade.productId && " ✓"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer - Total & Checkout */}
              {items.length > 0 && (
                <div className="border-t-2 border-gray-200 bg-gray-50 px-8 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-600 text-lg mb-1">Total Amount</p>
                      <p className="text-5xl font-black text-gray-800">
                        ₱{totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Total Items</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {totalItems}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={onClose}
                      className="flex-1 h-16 text-xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      onClick={onCheckout}
                      className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
