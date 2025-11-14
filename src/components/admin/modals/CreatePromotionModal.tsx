import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function CreatePromotionModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePromotionModalProps) {
  const [discountName, setDiscountName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [hasDuration, setHasDuration] = useState("");
  const [hasTimeDuration, setHasTimeDuration] = useState("");
  const [hasMinimum, setHasMinimum] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [perItemApplicationTypes, setPerItemApplicationTypes] = useState("");
  const [hasLimitedQty, setHasLimitedQty] = useState(false);
  const [appliesTo, setAppliesTo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      discountName,
      discountCode,
      hasDuration,
      hasTimeDuration,
      hasMinimum,
      discountType,
      applicationType,
      perItemApplicationTypes,
      hasLimitedQty,
      appliesTo,
    };
    onSubmit?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Discount/Promotion
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountName">Promo/Discount Name</Label>
              <Input
                id="discountName"
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
                placeholder="Enter discount name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountCode">Alias/Promo Code</Label>
              <Input
                id="discountCode"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter promo code"
                required
              />
            </div>
          </div>

          {/* Discount Application Type */}
          <div className="space-y-2">
            <Label>Discount Application Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="1"
                  checked={applicationType === "1"}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Whole Purchase</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="2"
                  checked={applicationType === "2"}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Per Item</span>
              </label>
            </div>
          </div>

          {/* Per Item Application Types */}
          {applicationType === "2" && (
            <div className="space-y-2 ml-6 p-4 bg-gray-50 rounded-lg">
              <Label>Per item or Categories?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value=""
                    checked={perItemApplicationTypes === ""}
                    onChange={(e) => setPerItemApplicationTypes(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="1"
                    checked={perItemApplicationTypes === "1"}
                    onChange={(e) => setPerItemApplicationTypes(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Per Item</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="2"
                    checked={perItemApplicationTypes === "2"}
                    onChange={(e) => setPerItemApplicationTypes(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Per Product/Bundle Categories</span>
                </label>
              </div>
            </div>
          )}

          {/* Discount Type */}
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="1"
                  checked={discountType === "1"}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Fixed Amount</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="2"
                  checked={discountType === "2"}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Percentage</span>
              </label>
            </div>
          </div>

          {/* Discount Amount/Percentage */}
          {discountType === "2" && (
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                placeholder="Enter percentage"
                min="0"
                max="100"
              />
            </div>
          )}
          {discountType === "1" && (
            <div className="space-y-2">
              <Label htmlFor="fixAmount">Fixed Amount (₱)</Label>
              <Input
                id="fixAmount"
                type="number"
                placeholder="Enter fixed amount"
                min="0"
              />
            </div>
          )}

          {/* Permanent Promo */}
          <div className="space-y-2">
            <Label>Is this a permanent promo/discount?</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value=""
                  checked={hasDuration === ""}
                  onChange={(e) => setHasDuration(e.target.value)}
                  className="w-4 h-4"
                />
                <span>No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="1"
                  checked={hasDuration === "1"}
                  onChange={(e) => setHasDuration(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          {/* Duration Dates */}
          {hasDuration !== "" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="datetime-local" />
              </div>
            </div>
          )}

          {/* Time Duration */}
          <div className="space-y-2">
            <Label>Does this promo have specific time?</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value=""
                  checked={hasTimeDuration === ""}
                  onChange={(e) => setHasTimeDuration(e.target.value)}
                  className="w-4 h-4"
                />
                <span>None</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="1"
                  checked={hasTimeDuration === "1"}
                  onChange={(e) => setHasTimeDuration(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          {/* Time Range */}
          {hasTimeDuration !== "" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" />
              </div>
            </div>
          )}

          {/* Minimum Requirements */}
          <div className="space-y-2">
            <Label>
              Does this promo have a minimum spend or minimum quantity?
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value=""
                  checked={hasMinimum === ""}
                  onChange={(e) => setHasMinimum(e.target.value)}
                  className="w-4 h-4"
                />
                <span>None</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="1"
                  checked={hasMinimum === "1"}
                  onChange={(e) => setHasMinimum(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Minimum Spend</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="0"
                  checked={hasMinimum === "0"}
                  onChange={(e) => setHasMinimum(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Minimum Quantity</span>
              </label>
            </div>
          </div>

          {hasMinimum === "1" && (
            <div className="space-y-2">
              <Label htmlFor="minimumSpend">Minimum Spend Amount (₱)</Label>
              <Input
                id="minimumSpend"
                type="number"
                placeholder="Enter minimum spend"
                min="0"
              />
            </div>
          )}
          {hasMinimum === "0" && (
            <div className="space-y-2">
              <Label htmlFor="minimumQty">Minimum Quantity</Label>
              <Input
                id="minimumQty"
                type="number"
                placeholder="Enter minimum quantity"
                min="0"
              />
            </div>
          )}

          {/* Applies To */}
          <div className="space-y-2">
            <Label htmlFor="appliesTo">Applies To</Label>
            <Select value={appliesTo} onValueChange={setAppliesTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="specific_item">Specific Item</SelectItem>
                <SelectItem value="specific_category">
                  Specific Category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limited Quantity */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasLimitedQty}
                onChange={(e) => setHasLimitedQty(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Applies Limited Quantity?</span>
            </label>
          </div>

          {hasLimitedQty && (
            <div className="space-y-2">
              <Label htmlFor="qtyPerBranch">Quantity Per Branch</Label>
              <Input
                id="qtyPerBranch"
                type="number"
                placeholder="Enter quantity per branch"
                min="0"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Discount
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
