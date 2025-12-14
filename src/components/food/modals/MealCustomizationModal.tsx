import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/function/reusables/reuseables";

interface MealVariance {
  compositionId: number; // Add composition ID for independent tracking
  label: string; // Generic label from the composition name
  options: {
    id: string;
    name: string;
    calculated_price: number; // Price modifier for this variant
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
        // Use compositionId as the key instead of type
        const defaultOption = variance.options.find((opt) => opt.isDefault);
        if (defaultOption) {
          defaults[variance.compositionId.toString()] = defaultOption.id;
        } else if (variance.options.length > 0) {
          defaults[variance.compositionId.toString()] = variance.options[0].id;
        }
      });
      setSelectedOptions(defaults);
    }
  }, [isOpen, meal]);

  if (!meal) return null;

  const handleOptionSelect = (compositionId: number, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [compositionId.toString()]: optionId,
    }));
  };

  const calculateTotalPrice = () => {
    // Ensure base_price is a number
    let total =
      typeof meal.base_price === "string"
        ? parseFloat(meal.base_price)
        : meal.base_price;

    meal.variances?.forEach((variance) => {
      // Use compositionId instead of type
      const selectedId = selectedOptions[variance.compositionId.toString()];
      const selectedOption = variance.options.find(
        (opt) => opt.id === selectedId
      );
      if (selectedOption) {
        // Ensure calculated_price is a number
        const priceModifier =
          typeof selectedOption.calculated_price === "string"
            ? parseFloat(selectedOption.calculated_price)
            : selectedOption.calculated_price;
        total += priceModifier;
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
        // Use compositionId instead of type
        const selectedId = selectedOptions[variance.compositionId.toString()];
        const selectedOption = variance.options.find(
          (opt) => opt.id === selectedId
        );
        return {
          compositionId: variance.compositionId,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {meal.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Base: {formatCurrency(meal.base_price)}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
          {meal.variances && meal.variances.length > 0 ? (
            <div className="space-y-4">
              {meal.variances.map((variance) => (
                <div
                  key={`composition-${variance.compositionId}`}
                  className="space-y-2"
                >
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {variance.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {variance.options.map((option) => {
                      const isSelected =
                        selectedOptions[variance.compositionId.toString()] ===
                        option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() =>
                            handleOptionSelect(
                              variance.compositionId,
                              option.id
                            )
                          }
                          className={`
                            p-2 border-2 rounded cursor-pointer transition-all text-sm
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() =>
                                  handleOptionSelect(
                                    variance.compositionId,
                                    option.id
                                  )
                                }
                                className="w-3 h-3 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="text-xs font-medium text-gray-900 dark:text-white">
                                {option.name}
                              </span>
                            </div>
                            {option.calculated_price > 0 && (
                              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                +{formatCurrency(option.calculated_price)}
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
            <div className="text-center text-gray-500 py-4 text-sm">
              No options available.
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="border-t px-4 py-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between gap-3">
            <div className="text-base font-bold text-gray-900 dark:text-white">
              Total: {formatCurrency(totalPrice)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 h-9 px-4 text-sm"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
