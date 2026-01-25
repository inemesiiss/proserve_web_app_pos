import { useState } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Percent } from "lucide-react";
import ManualDiscountModal from "../../modals/security/ManualDiscountModal";
import PwdScCardModal from "../../modals/security/PwdScCardModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FoodOrderSummary() {
  const { meals, products, updateQty, toggleVoid, applyDiscount } =
    useFoodOrder();

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{
    id: number;
    type: "meal" | "product";
    name: string;
    index: number;
    instanceKey?: string;
  } | null>(null);
  const [showManualDiscountModal, setShowManualDiscountModal] = useState(false);
  const [manualDiscountTarget, setManualDiscountTarget] = useState<{
    id: number;
    type: "meal" | "product";
    name: string;
    price: number;
    qty: number;
    instanceKey?: string;
  } | null>(null);
  const [showPwdScModal, setShowPwdScModal] = useState(false);
  const [pwdScTarget, setPwdScTarget] = useState<{
    id: number;
    type: "meal" | "product";
    instanceKey?: string;
  } | null>(null);

  const allItems = [
    ...meals.map((i) => ({ ...i, type: "meal" as const })),
    ...products.map((i) => ({ ...i, type: "product" as const })),
  ];

  const handleRemoveClick = (
    id: number,
    type: "meal" | "product",
    name: string,
    index: number,
    instanceKey?: string,
  ) => {
    setRemoveTarget({ id, type, name, index, instanceKey });
    setShowRemoveConfirm(true);
  };

  const confirmRemove = () => {
    if (removeTarget) {
      // Toggle void on the specific instance using instanceKey
      toggleVoid(
        removeTarget.id,
        removeTarget.type,
        undefined,
        removeTarget.instanceKey,
      );
    }
    setShowRemoveConfirm(false);
    setRemoveTarget(null);
  };

  // const handleManualDiscountClick = (
  //   id: number,
  //   type: "meal" | "product",
  //   name: string,
  //   price: number,
  //   qty: number,
  //   instanceKey?: string,
  // ) => {
  //   setManualDiscountTarget({ id, type, name, price, qty, instanceKey });
  //   setShowManualDiscountModal(true);
  // };

  const handleApplyManualDiscount = (discountData: {
    type: "percentage" | "fixed";
    value: number;
    note: string;
  }) => {
    if (manualDiscountTarget) {
      // Apply manual discount to the specific item using instanceKey
      applyDiscount(
        manualDiscountTarget.id,
        manualDiscountTarget.type,
        discountData.type === "percentage" ? "percentage" : "manual",
        discountData.value,
        discountData.note,
        manualDiscountTarget.instanceKey,
      );
      setShowManualDiscountModal(false);
      setManualDiscountTarget(null);
    }
  };

  const handlePwdScClick = (
    id: number,
    type: "meal" | "product",
    instanceKey?: string,
  ) => {
    setPwdScTarget({ id, type, instanceKey });
    setShowPwdScModal(true);
  };

  const handlePwdScVerified = (data: {
    cardNumber: string;
    name?: string;
    expiryDate: string;
    discountId: number;
    discountCode: string;
    discountPercentage: number;
  }) => {
    if (pwdScTarget) {
      // Apply SC/PWD discount to specific item using instanceKey
      const note = `${data.discountCode} Card: ${data.cardNumber}${
        data.name ? ` | Name: ${data.name}` : ""
      } | Exp: ${data.expiryDate}`;
      applyDiscount(
        pwdScTarget.id,
        pwdScTarget.type,
        data.discountCode.toLowerCase() as "pwd" | "sc",
        data.discountPercentage,
        note,
        pwdScTarget.instanceKey,
        data.discountId,
      );
      setShowPwdScModal(false);
      setPwdScTarget(null);
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

      {allItems.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No items in order.</p>
      )}

      {allItems.map((item, index) => {
        const isVoided = item.isVoid;
        const isDiscounted = item.isDiscount;
        const discountAmt = item.itemTotalDiscount ?? 0;
        const finalPrice = item.price * item.qty - discountAmt;

        return (
          <div
            key={`${item.id}-${item.type}-${index}`}
            className={`flex justify-between items-start gap-3 border-b py-3 text-sm transition ${
              isVoided ? "opacity-50 line-through" : ""
            }`}
          >
            {/* Left Side */}
            <div className="flex-1 space-y-2">
              <div className="font-medium text-gray-800 text-sm">
                {item.name}
              </div>

              {/* Variance/Composition Details - Always show for meals (type=meal), show when customized for products */}
              {item.customization && item.customization.length > 0 && (
                <div className="text-xs text-gray-600 space-y-0.5 bg-gray-50 rounded px-2 py-1.5">
                  {item.customization.map((custom, idx) => {
                    // Use calculated_price (the price modifier) instead of price
                    const priceModifier =
                      custom.selected?.calculated_price ??
                      custom.selected?.price ??
                      0;
                    const priceNum =
                      typeof priceModifier === "string"
                        ? parseFloat(priceModifier)
                        : priceModifier;
                    return (
                      <div key={idx} className="flex items-center gap-1">
                        {/* <span className="font-medium text-gray-700">
                          {custom.label}:
                        </span> */}
                        <span>1x {custom.selected?.name}</span>
                        {priceNum > 0 && (
                          <span className="text-green-600 font-medium">
                            (+₱{priceNum.toFixed(2)})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Qty Controls & Discount Buttons - Aligned */}
              <div className="flex items-start justify-between gap-3">
                {/* Qty Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQty(
                        item.id,
                        item.type,
                        item.qty - 1,
                        item.instanceKey,
                      )
                    }
                    disabled={isVoided}
                    className="h-7 w-7 p-0"
                  >
                    <Minus size={12} />
                  </Button>
                  <span className="w-6 text-center font-medium text-sm">
                    {item.qty}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQty(
                        item.id,
                        item.type,
                        item.qty + 1,
                        item.instanceKey,
                      )
                    }
                    disabled={isVoided}
                    className="h-7 w-7 p-0"
                  >
                    <Plus size={12} />
                  </Button>
                </div>

                {/* Price Display */}
                <div className="font-bold text-gray-800 text-base">
                  ₱{finalPrice.toFixed(2)}
                </div>
              </div>

              {/* Discount Display - Compact */}
              {discountAmt > 0 && (
                <div className="text-xs bg-red-50 border border-red-200 rounded px-2 py-1">
                  <div className="text-red-600 font-medium">
                    -₱{discountAmt.toFixed(2)}
                    {item.discount_type === "sc" && " (PWD/Senior)"}
                    {item.discount_type === "percentage" &&
                      ` (${item.percentDiscount}%)`}
                    {item.discount_type === "manual" && " (Manual)"}
                  </div>
                  {item.discount_note && (
                    <div className="text-gray-600 text-xs">
                      {item.discount_note}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side - Buttons Only */}
            <div className="flex flex-col gap-1.5">
              <Button
                size="sm"
                variant={
                  isDiscounted && item.discount_type === "sc"
                    ? "default"
                    : "outline"
                }
                className={
                  isDiscounted && item.discount_type === "sc"
                    ? "bg-green-600 text-white hover:bg-green-700 h-7 text-xs px-2"
                    : "h-7 text-xs px-2"
                }
                onClick={() =>
                  handlePwdScClick(item.id, item.type, item.instanceKey)
                }
                disabled={isVoided}
              >
                <Percent size={12} className="mr-1" />
                SC/PWD
              </Button>
              {/* <Button
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
                    ? "bg-blue-600 text-white hover:bg-blue-700 h-7 text-xs px-2"
                    : "h-7 text-xs px-2"
                }
                onClick={() =>
                  handleManualDiscountClick(
                    item.id,
                    item.type,
                    item.name,
                    item.price,
                    item.qty,
                    item.instanceKey,
                  )
                }
                disabled={isVoided}
              >
                <Receipt size={12} className="mr-1" />
                Other Disc
              </Button> */}
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white h-7 text-xs px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  handleRemoveClick(
                    item.id,
                    item.type,
                    item.name,
                    index,
                    item.instanceKey,
                  )
                }
                disabled={isVoided}
              >
                <Trash2 size={12} />
                Remove
              </Button>
            </div>
          </div>
        );
      })}

      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{removeTarget?.name}</strong> from the order? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {showPwdScModal && (
        <PwdScCardModal
          isOpen={showPwdScModal}
          onClose={() => {
            setShowPwdScModal(false);
            setPwdScTarget(null);
          }}
          onSuccess={handlePwdScVerified}
        />
      )}
    </div>
  );
}
