import { useState } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Percent } from "lucide-react";
import PinModal from "../modals/PinDiscountModal";

export default function FoodOrderSummary() {
  const { meals, products, updateQty, toggleVoid, applyDiscount } =
    useFoodOrder();

  const [showPinModal, setShowPinModal] = useState(false);
  const [voidTarget, setVoidTarget] = useState<{
    id: number;
    type: "meal" | "product";
  } | null>(null);

  const allItems = [
    ...meals.map((i) => ({ ...i, type: "meal" as const })),
    ...products.map((i) => ({ ...i, type: "product" as const })),
  ];

  const handleVoidClick = (id: number, type: "meal" | "product") => {
    setVoidTarget({ id, type });
    setShowPinModal(true);
  };

  const confirmVoid = () => {
    if (voidTarget) {
      toggleVoid(voidTarget.id, voidTarget.type);
    }
    setShowPinModal(false);
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

      {allItems.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No items in order.</p>
      )}

      {allItems.map((item) => {
        const isVoided = item.isVoid;
        const isDiscounted = item.isDiscount;
        const discountAmt = item.itemTotalDiscount ?? 0;
        const finalPrice = item.price * item.qty - discountAmt;

        return (
          <div
            key={item.id}
            className={`flex justify-between items-center border-b py-2 text-sm transition ${
              isVoided ? "opacity-50 line-through" : ""
            }`}
          >
            {/* Left Side */}
            <div className="flex-1">
              <div className="font-medium text-gray-800">{item.name}</div>

              {/* Qty Controls */}
              <div className="flex items-center gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQty(item.id, item.type, item.qty - 1)}
                  disabled={isVoided}
                >
                  <Minus size={14} />
                </Button>
                <span className="w-6 text-center">{item.qty}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQty(item.id, item.type, item.qty + 1)}
                  disabled={isVoided}
                >
                  <Plus size={14} />
                </Button>
              </div>

              {/* Discount Button */}
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant={isDiscounted ? "default" : "outline"}
                  className={isDiscounted ? "bg-green-600 text-white" : ""}
                  onClick={() => applyDiscount(item.id, item.type, "sc")}
                  disabled={isVoided}
                >
                  <Percent size={14} className="mr-1" />
                  {isDiscounted
                    ? `${item.discount_type?.toUpperCase()}`
                    : "PWD / Senior"}
                </Button>
              </div>

              {/* Discount Display */}
              {discountAmt > 0 && (
                <div className="text-xs text-red-600 mt-1">
                  Discount: ₱{discountAmt.toFixed(2)}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-end">
              <div className="font-semibold text-gray-700">
                ₱{finalPrice.toFixed(2)}
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="mt-1 flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm"
                onClick={() => handleVoidClick(item.id, item.type)}
              >
                <Trash2 size={14} />
                <span className="text-xs font-medium">Void</span>
              </Button>
            </div>
          </div>
        );
      })}

      {showPinModal && (
        <PinModal
          onConfirm={confirmVoid}
          onCancel={() => setShowPinModal(false)}
        />
      )}
    </div>
  );
}
