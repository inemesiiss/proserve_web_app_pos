import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ClientFilter from "./ClientFilter";
import { useGetBranchUsersQuery } from "@/store/api/User";

interface FiltersBarProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  showSearch?: boolean;
  showClientFilter?: boolean;
  showBranchUserFilter?: boolean;
  branchId?: number;
}

// Helper: compute start_date and end_date from quick filter
const getDateRange = (
  quickFilter: string,
): { start_date: string; end_date: string } => {
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0]; // YYYY-MM-DD

  switch (quickFilter) {
    case "today":
      return { start_date: formatDate(today), end_date: formatDate(today) };
    case "week": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      return {
        start_date: formatDate(startOfWeek),
        end_date: formatDate(today),
      };
    }
    case "month": {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        start_date: formatDate(startOfMonth),
        end_date: formatDate(today),
      };
    }
    default:
      return { start_date: "", end_date: "" };
  }
};

export default function FiltersBar({
  onFilterChange,
  showSearch = false,
  showClientFilter = true,
  showBranchUserFilter = false,
  branchId,
}: FiltersBarProps) {
  // Filter state
  const [selectedCashier, setSelectedCashier] = useState<string>("");
  const [dateFilterType, setDateFilterType] = useState<"quick" | "custom">(
    "quick",
  );
  const [dateQuickFilter, setDateQuickFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch branch users
  const { data: branchUsers = [] } = useGetBranchUsersQuery(
    { branchId: branchId || 0, role: "cashier" },
    { skip: !branchId || !showBranchUserFilter },
  );

  // Handle Go button click - collect all filters and return to parent
  const handleApplyFilters = () => {
    const filters: Record<string, any> = {};

    // Add cashier filter (branch user id)
    if (selectedCashier) {
      filters.cashier = Number(selectedCashier);
    }

    // Add date filter - always resolve to start_date / end_date
    if (dateFilterType === "quick" && dateQuickFilter) {
      const { start_date, end_date } = getDateRange(dateQuickFilter);
      filters.start_date = start_date;
      filters.end_date = end_date;
    } else if (dateFilterType === "custom" && startDate && endDate) {
      filters.start_date = startDate;
      filters.end_date = endDate;
    }

    onFilterChange?.(filters);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Client Filter */}
      {showClientFilter && (
        <ClientFilter onValueChange={(v) => onFilterChange?.({ client: v })} />
      )}

      {/* Branch User / Cashier Filter */}
      {showBranchUserFilter && (
        <Select value={selectedCashier} onValueChange={setSelectedCashier}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Users" />
          </SelectTrigger>
          <SelectContent>
            {branchUsers.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Date Filter */}
      <div className="flex gap-2 items-center">
        <Select
          value={dateFilterType}
          onValueChange={(v) => setDateFilterType(v as "quick" | "custom")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Date Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quick">Quick Filter</SelectItem>
            <SelectItem value="custom">Date Range</SelectItem>
          </SelectContent>
        </Select>

        {dateFilterType === "quick" ? (
          <Select value={dateQuickFilter} onValueChange={setDateQuickFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-[150px]"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="w-[150px]"
            />
          </div>
        )}
      </div>

      {/* Go Button */}
      <Button onClick={handleApplyFilters} className="ml-2">
        Go
      </Button>
    </div>
  );
}
