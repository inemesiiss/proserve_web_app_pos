import { useState } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Percent, Receipt } from "lucide-react";
import PinModal from "../../modals/food/PinDiscountModal";
import ManualDiscountModal from "../../modals/security/ManualDiscountModal";

export default function FoodOrderSummary() {
  const { meals, products, updateQty, toggleVoid, applyDiscount } =
    useFoodOrder();

  const [showPinModal, setShowPinModal] = useState(false);
  const [voidTarget, setVoidTarget] = useState<{
    id: number;
    type: "meal" | "product";
  } | null>(null);
  const [showManualDiscountModal, setShowManualDiscountModal] = useState(false);
  const [manualDiscountTarget, setManualDiscountTarget] = useState<{
    id: number;
    type: "meal" | "product";
    name: string;
    price: number;
    qty: number;
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

  const handleManualDiscountClick = (
    id: number,
    type: "meal" | "product",
    name: string,
    price: number,
    qty: number
  ) => {
    setManualDiscountTarget({ id, type, name, price, qty });
    setShowManualDiscountModal(true);
  };

  const handleApplyManualDiscount = (discountData: {
    type: "percentage" | "fixed";
    value: number;
    note: string;
  }) => {
    if (manualDiscountTarget) {
      // Apply manual discount to the item
      applyDiscount(
        manualDiscountTarget.id,
        manualDiscountTarget.type,
        discountData.type === "percentage" ? "percentage" : "manual",
        discountData.value,
        discountData.note
      );
      setShowManualDiscountModal(false);
      setManualDiscountTarget(null);
    }
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
            className={`flex justify-between items-start gap-4 border-b py-4 text-sm transition ${
              isVoided ? "opacity-50 line-through" : ""
            }`}
          >
            {/* Left Side */}
            <div className="flex-1 space-y-3">
              <div className="font-medium text-gray-800 text-base">
                {item.name}
              </div>

              {/* Qty Controls */}
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQty(item.id, item.type, item.qty - 1)}
                  disabled={isVoided}
                  className="h-8 w-8 p-0"
                >
                  <Minus size={14} />
                </Button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQty(item.id, item.type, item.qty + 1)}
                  disabled={isVoided}
                  className="h-8 w-8 p-0"
                >
                  <Plus size={14} />
                </Button>
              </div>

              {/* Discount Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={
                    isDiscounted && item.discount_type === "sc"
                      ? "default"
                      : "outline"
                  }
                  className={
                    isDiscounted && item.discount_type === "sc"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : ""
                  }
                  onClick={() => applyDiscount(item.id, item.type, "sc")}
                  disabled={isVoided}
                >
                  <Percent size={14} className="mr-1" />
                  PWD / Senior
                </Button>
                <Button
                  size="sm"
                  variant={
                    isDiscounted &&
                    (item.discount_type === "manual" ||
                      item.discount_type === "percentage")
                      ? "default"
                      : "outline"
                  }
                  className={
                    isDiscounted &&
                    (item.discount_type === "manual" ||
                      item.discount_type === "percentage")
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }
                  onClick={() =>
                    handleManualDiscountClick(
                      item.id,
                      item.type,
                      item.name,
                      item.price,
                      item.qty
                    )
                  }
                  disabled={isVoided}
                >
                  <Receipt size={14} className="mr-1" />
                  Manual
                </Button>
              </div>

              {/* Discount Display */}
              {discountAmt > 0 && (
                <div className="text-xs space-y-1 bg-red-50 border border-red-200 rounded-lg p-2">
                  <div className="text-red-600 font-medium">
                    Discount: ₱{discountAmt.toFixed(2)}
                    {item.discount_type === "sc" && " (PWD/Senior)"}
                    {item.discount_type === "percentage" &&
                      ` (${item.percentDiscount}%)`}
                    {item.discount_type === "manual" && " (Manual)"}
                  </div>
                  {item.discount_note && (
                    <div className="text-gray-600 italic">
                      Note: {item.discount_note}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-end gap-2 min-w-[100px]">
              <div className="font-bold text-gray-800 text-lg">
                ₱{finalPrice.toFixed(2)}
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md shadow-sm"
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

      {showManualDiscountModal && manualDiscountTarget && (
        <ManualDiscountModal
          isOpen={showManualDiscountModal}
          onClose={() => {
            setShowManualDiscountModal(false);
            setManualDiscountTarget(null);
          }}
          onApplyDiscount={handleApplyManualDiscount}
          itemName={manualDiscountTarget.name}
          itemPrice={manualDiscountTarget.price}
          itemQty={manualDiscountTarget.qty}
        />
      )}
    </div>
  );
}
