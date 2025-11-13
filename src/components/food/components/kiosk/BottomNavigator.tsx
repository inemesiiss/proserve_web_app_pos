import { motion } from "framer-motion";
import { Home, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigatorProps {
  cartItemCount: number;
  totalPrice: number;
  onHomeClick: () => void;
  onCartClick: () => void;
}

export default function BottomNavigator({
  cartItemCount,
  totalPrice,
  onHomeClick,
  onCartClick,
}: BottomNavigatorProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Home Button - Left Side */}
          <motion.button
            onClick={onHomeClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg transition-all duration-200 min-w-[200px]"
          >
            <Home className="w-7 h-7" />
            <span className="text-xl font-bold">Home</span>
          </motion.button>

          {/* Cart Button - Right Side */}
          <motion.button
            onClick={onCartClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center justify-between gap-6 px-8 py-5 rounded-2xl shadow-lg transition-all duration-200 flex-1 max-w-2xl",
              cartItemCount > 0
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
            disabled={cartItemCount === 0}
          >
            {/* Cart Icon with Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart className="w-8 h-8" />
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white"
                  >
                    {cartItemCount}
                  </motion.div>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold opacity-90">
                  {cartItemCount === 0
                    ? "Cart is Empty"
                    : `${cartItemCount} ${
                        cartItemCount === 1 ? "Item" : "Items"
                      }`}
                </span>
                {cartItemCount > 0 && (
                  <span className="text-xs opacity-75">
                    Click to view order
                  </span>
                )}
              </div>
            </div>

            {/* Total Price */}
            {cartItemCount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-end"
              >
                <span className="text-sm font-medium opacity-90">Total</span>
                <span className="text-2xl font-black">
                  ₱{totalPrice.toFixed(2)}
                </span>
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
