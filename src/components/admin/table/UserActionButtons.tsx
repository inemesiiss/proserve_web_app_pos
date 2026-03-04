import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UserActionButtonsProps {
  title: string;
  onAddUser?: () => void;
  onImportCSV?: () => void;
}

export default function UserActionButtons({
  onAddUser,
  title,
  // onImportCSV,
}: UserActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        className="bg-green-500 hover:bg-green-600 text-white"
        onClick={onAddUser}
      >
        <Plus className="w-4 h-4 mr-2" />
        {title}
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
