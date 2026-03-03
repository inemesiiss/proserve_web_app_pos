import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface YesNoDropdownProps {
  title: string;
  val: string;
  func: (e: string) => void;
}

function YesNoDropdown({ title, val, func }: YesNoDropdownProps) {
  return (
    <div className="grid max-w-lg items-center gap-1 ">
      <Label htmlFor="date">{title}</Label>
      <Select value={val} onValueChange={(e) => func(e)}>
        <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
          <SelectValue placeholder="Show" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Show</SelectItem>
          <SelectItem value="2">Hide</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default YesNoDropdown;
