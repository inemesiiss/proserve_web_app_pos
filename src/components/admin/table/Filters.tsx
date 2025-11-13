import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ClientFilter from "./ClientFilter";

interface FiltersBarProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  showSearch?: boolean;
  showClientFilter?: boolean;
}

export default function FiltersBar({
  onFilterChange,
  showSearch = true,
  showClientFilter = true,
}: FiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Client Filter */}
      {showClientFilter && (
        <ClientFilter onValueChange={(v) => onFilterChange?.({ client: v })} />
      )}

      <Select onValueChange={(v) => onFilterChange?.({ date: v })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Filter Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => onFilterChange?.({ branch: v })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="makati">Makati</SelectItem>
          <SelectItem value="ortigas">Ortigas</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => onFilterChange?.({ agent: v })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Agents" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="agent1">Agent 1</SelectItem>
          <SelectItem value="agent2">Agent 2</SelectItem>
        </SelectContent>
      </Select>

      {showSearch && (
        <div className="ml-auto">
          <Input placeholder="Search" className="w-[200px]" />
        </div>
      )}
    </div>
  );
}
