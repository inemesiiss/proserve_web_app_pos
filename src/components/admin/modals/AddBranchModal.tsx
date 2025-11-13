import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BranchFormData) => void;
}

interface BranchFormData {
  clientName: string;
  branchCode: string;
  branchName: string;
  address: string;
  department: string;
}

export default function AddBranchModal({
  isOpen,
  onClose,
  onSubmit,
}: AddBranchModalProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    clientName: "",
    branchCode: "",
    branchName: "",
    address: "",
    department: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      clientName: "",
      branchCode: "",
      branchName: "",
      address: "",
      department: "",
    });
    onClose();
  };

  const handleChange = (field: keyof BranchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Add New Branch
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Client Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="clientName"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Client Name
                  </Label>
                  <Select
                    value={formData.clientName}
                    onValueChange={(value) => handleChange("clientName", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brent-gas">Brent Gas</SelectItem>
                      <SelectItem value="onetech">Onetech</SelectItem>
                      <SelectItem value="aristocrat">Aristocrat</SelectItem>
                      <SelectItem value="globe">Globe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Code */}
                <div className="space-y-2">
                  <Label
                    htmlFor="branchCode"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Branch Code
                  </Label>
                  <Input
                    id="branchCode"
                    type="text"
                    placeholder="e.g., 001"
                    value={formData.branchCode}
                    onChange={(e) => handleChange("branchCode", e.target.value)}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Branch Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="branchName"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Branch Name
                  </Label>
                  <Input
                    id="branchName"
                    type="text"
                    placeholder="e.g., Branch 1"
                    value={formData.branchName}
                    onChange={(e) => handleChange("branchName", e.target.value)}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="e.g., Lot 8 Block 8 Abraza"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label
                    htmlFor="department"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleChange("department", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Add Branch
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
