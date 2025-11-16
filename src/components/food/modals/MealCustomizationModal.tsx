import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";

interface MealVariance {
  type: "drink" | "fries" | "side";
  label: string;
  options: {
    id: string;
    name: string;
    price: number;
    isDefault?: boolean;
  }[];
}

interface MealCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: {
    id: number;
    name: string;
    base_price: number;
    image: string;
    category: string;
    variances?: MealVariance[];
  } | null;
  onConfirm: (customization: any) => void;
}

export default function MealCustomizationModal({
  isOpen,
  onClose,
  meal,
  onConfirm,
}: MealCustomizationModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Initialize default selections when modal opens or meal changes
  useEffect(() => {
    if (isOpen && meal?.variances) {
      const defaults: Record<string, string> = {};
      meal.variances.forEach((variance) => {
        const defaultOption = variance.options.find((opt) => opt.isDefault);
        if (defaultOption) {
          defaults[variance.type] = defaultOption.id;
        } else if (variance.options.length > 0) {
          defaults[variance.type] = variance.options[0].id;
        }
      });
      setSelectedOptions(defaults);
    }
  }, [isOpen, meal]);

  if (!meal) return null;

  const handleOptionSelect = (type: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [type]: optionId,
    }));
  };

  const calculateTotalPrice = () => {
    let total = meal.base_price;
    meal.variances?.forEach((variance) => {
      const selectedId = selectedOptions[variance.type];
      const selectedOption = variance.options.find(
        (opt) => opt.id === selectedId
      );
      if (selectedOption) {
        total += selectedOption.price;
      }
    });
    return total;
  };

  const handleConfirm = () => {
    const customization = {
      meal,
      selectedOptions,
      totalPrice: calculateTotalPrice(),
      customizationDetails: meal.variances?.map((variance) => {
        const selectedId = selectedOptions[variance.type];
        const selectedOption = variance.options.find(
          (opt) => opt.id === selectedId
        );
        return {
          type: variance.type,
          label: variance.label,
          selected: selectedOption,
        };
      }),
    };
    onConfirm(customization);
    onClose();
  };

  const totalPrice = calculateTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-[680px] max-h-[85vh] flex flex-col relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={24} />
            </button>

            {/* Scrollable Content */}
            <div
              className="overflow-y-auto pr-2 -mr-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {meal.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Base Price: ₱{meal.base_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              {meal.variances && meal.variances.length > 0 ? (
                <div className="space-y-6">
                  {meal.variances.map((variance) => (
                    <div key={variance.type}>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        {variance.label}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {variance.options.map((option) => {
                          const isSelected =
                            selectedOptions[variance.type] === option.id;
                          return (
                            <div
                              key={option.id}
                              onClick={() =>
                                handleOptionSelect(variance.type, option.id)
                              }
                              className={`
                                p-3 border-2 rounded-lg cursor-pointer transition-all
                                ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleOptionSelect(variance.type, option.id)
                                    }
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="text-sm font-medium text-gray-900">
                                    {option.name}
                                  </span>
                                </div>
                                {option.price > 0 && (
                                  <span className="text-sm font-semibold text-green-600">
                                    +₱{option.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8 text-sm">
                  No customization options available.
                </div>
              )}

              {/* Total Preview */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Total Price:
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    ₱{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="flex gap-3 pt-4 border-t mt-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 h-12 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
