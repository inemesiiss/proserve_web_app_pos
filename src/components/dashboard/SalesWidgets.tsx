import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export type WidgetKey = "this_month" | "this_week" | "today";

export interface WidgetData {
  this_month_sales: number;
  last_month_sales: number;
  month_pct_change: number;
  this_week_sales: number;
  last_week_sales: number;
  week_pct_change: number;
  today_sales: number;
  yesterday_sales: number;
  today_pct_change: number;
}

interface SalesWidgetsProps {
  data: WidgetData;
  isLoading: boolean;
  visibleWidgets: WidgetKey[];
}

function WidgetSkeleton() {
  return (
    <Card className="bg-white shadow-md rounded-2xl animate-pulse">
      <CardContent className="p-6">
        <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
        <div className="h-9 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-36 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface SingleWidgetProps {
  label: string;
  value: number;
  pctChange: number;
  comparisonLabel: string;
}

function SingleWidget({
  label,
  value,
  pctChange,
  comparisonLabel,
}: SingleWidgetProps) {
  const isPositive = pctChange >= 0;

  return (
    <Card className="bg-white shadow-md rounded-2xl border-0 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="text-sm text-gray-500 font-medium mb-2">{label}</div>
        <div className="text-3xl font-bold text-gray-900 mb-3">
          {formatCurrency(value)}
        </div>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? "+" : ""}
            {pctChange.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">{comparisonLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SalesWidgets({
  data,
  isLoading,
  visibleWidgets,
}: SalesWidgetsProps) {
  if (visibleWidgets.length === 0) return null;

  const widgetConfigs: Record<
    WidgetKey,
    { label: string; value: number; pctChange: number; comparisonLabel: string }
  > = {
    this_month: {
      label: "This Month Sales",
      value: data.this_month_sales,
      pctChange: data.month_pct_change,
      comparisonLabel: "vs last month",
    },
    this_week: {
      label: "This Week Sales",
      value: data.this_week_sales,
      pctChange: data.week_pct_change,
      comparisonLabel: "vs last week",
    },
    today: {
      label: "Today's Sales",
      value: data.today_sales,
      pctChange: data.today_pct_change,
      comparisonLabel: "vs yesterday",
    },
  };

  const cols =
    visibleWidgets.length === 1
      ? "grid-cols-1"
      : visibleWidgets.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  if (isLoading) {
    return (
      <div className={`grid ${cols} gap-6`}>
        {visibleWidgets.map((key) => (
          <WidgetSkeleton key={key} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${cols} gap-6`}>
      {visibleWidgets.map((key) => {
        const config = widgetConfigs[key];
        return <SingleWidget key={key} {...config} />;
      })}
    </div>
  );
}
