import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface ProductActionButtonsProps {
  onAddProduct?: () => void;
  onImportCSV?: () => void;
}

export default function ProductActionButtons({
  onAddProduct,
  onImportCSV,
}: ProductActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        className="bg-green-500 hover:bg-green-600 text-white"
        onClick={onAddProduct}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </Button>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onImportCSV}
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Excel
      </Button>
    </div>
  );
}
