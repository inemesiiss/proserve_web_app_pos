import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface AccountActionButtonsProps {
  onAddAccount?: () => void;
  onImportCSV?: () => void;
}

export default function AccountActionButtons({
  onAddAccount,
  onImportCSV,
}: AccountActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        className="bg-green-500 hover:bg-green-600 text-white"
        onClick={onAddAccount}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Account
      </Button>
      {/* <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onImportCSV}
      >
        <Upload className="w-4 h-4 mr-2" />
        Import CSV
      </Button> */}
    </div>
  );
}
