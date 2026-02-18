import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WidgetKey } from "./SalesWidgets";

// Format date to readable format (e.g., "Jan 1")
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface DashboardFilterBarProps {
  fromDate: string;
  toDate: string;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
  presetFilter: string;
  handlePresetFilter: (preset: string) => void;
  setPresetFilter: (v: string) => void;
  isFilterExpanded: boolean;
  setIsFilterExpanded: (v: boolean) => void;
  visibleWidgets: WidgetKey[];
  setVisibleWidgets: (v: WidgetKey[]) => void;
}

// const WIDGET_OPTIONS: { key: WidgetKey; label: string }[] = [
//   { key: "this_month", label: "This Month Sales" },
//   { key: "this_week", label: "This Week Sales" },
//   { key: "today", label: "Today's Sales" },
// ];

export default function DashboardFilterBar({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  presetFilter,
  handlePresetFilter,
  setPresetFilter,
  isFilterExpanded,
  setIsFilterExpanded,
  // visibleWidgets,
  // setVisibleWidgets,
}: DashboardFilterBarProps) {
  const presets = [
    { key: "today", label: "Today" },
    { key: "this-week", label: "This Week" },
    { key: "this-month", label: "This Month" },
  ];

  return (
    <div className="fixed top-15 left-185 right-0 z-50 w-[50%] bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border-b-2 border-blue-200 rounded-b-2xl transition-all duration-300">
      {/* Header with Toggle Button */}
      <div className="px-8 py-4 flex items-center justify-between border-b border-blue-100">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Date Range Filter
          </h3>
          <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {formatDateShort(fromDate)} - {formatDateShort(toDate)}
          </span>
        </div>
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="p-2 hover:bg-white rounded-lg transition-all duration-200"
        >
          {isFilterExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Expandable Content */}
      {isFilterExpanded && (
        <div className="px-8 py-6 max-w-full">
          {/* Preset Filter Buttons */}
          <div className="mb-5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
              Quick Filters
            </label>
            <div className="flex gap-3">
              {presets.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePresetFilter(p.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    presetFilter === p.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:shadow-md"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Widget Toggles */}
          {/* <div className="mb-5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
              Widgets
            </label>
            <div className="flex gap-4">
              {WIDGET_OPTIONS.map((w) => {
                const checked = visibleWidgets.includes(w.key);
                return (
                  <label
                    key={w.key}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 select-none ${
                      checked
                        ? "bg-blue-50 border-2 border-blue-400 text-blue-700"
                        : "bg-white border border-gray-300 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setVisibleWidgets(
                            visibleWidgets.filter((k) => k !== w.key),
                          );
                        } else {
                          setVisibleWidgets([...visibleWidgets, w.key]);
                        }
                      }}
                      className="accent-blue-600 w-4 h-4"
                    />
                    {w.label}
                  </label>
                );
              })}
            </div>
          </div> */}

          {/* Custom Date Range */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
              Custom Date Range
            </label>
            <div className="grid grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  From Date
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPresetFilter("");
                  }}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  To Date
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPresetFilter("");
                  }}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
