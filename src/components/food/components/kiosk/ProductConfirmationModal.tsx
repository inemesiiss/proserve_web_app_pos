import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Product } from "@/data/food/products";

interface ProductConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (product: Product, quantity: number) => void;
}

export default function ProductConfirmationModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: ProductConfirmationModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const totalPrice = product.price * quantity;

  const handleConfirm = () => {
    onConfirm(product, quantity);
    setQuantity(1); // Reset quantity
    onClose();
  };

  const handleCancel = () => {
    setQuantity(1); // Reset quantity
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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Add to Cart</h2>
                    <p className="text-blue-100 text-sm">Confirm your order</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Product Info */}
                <div className="flex items-start gap-6 mb-8 bg-gray-50 rounded-2xl p-6">
                  <div className="w-32 h-32 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-3xl font-black text-green-600 mb-3">
                      ₱{product.price.toFixed(2)}
                    </p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Select Quantity
                  </h4>
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Minus className="w-7 h-7 text-gray-700" />
                    </button>
                    <span className="text-5xl font-black text-gray-800 w-24 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Plus className="w-7 h-7 text-white" />
                    </button>
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-lg mb-1">Total Amount</p>
                      <p className="text-5xl font-black text-gray-800">
                        ₱{totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Items</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {quantity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleCancel}
                    className="flex-1 h-16 text-xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg"
                  >
                    Confirm & Add
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
