import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  useGetSalesDashboardQuery,
  useGetMonthlySalesQuery,
  useGetWeeklySalesQuery,
} from "@/store/api/Reports";
import { toast } from "sonner";
import {
  DashboardFilterBar,
  MetricsCards,
  MonthlySalesChart,
  WeeklySalesChart,
  PaymentChannelsChart,
  HourlySalesChart,
  TopProductsSection,
  CashierPerformanceSection,
  SalesWidgets,
} from "@/components/dashboard";
import type { WidgetKey } from "@/components/dashboard";

// Get first and last day of the current month as YYYY-MM-DD
function getCurrentMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const format = (d: Date) => d.toISOString().split("T")[0];
  return { start: format(firstDay), end: format(lastDay) };
}

// Get the ISO week number for a given date
function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNum = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNum + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// Generate all weeks for a given year with start and end date labels
function generateWeeksForYear(year: number) {
  const weeks: { label: string; value: number; start: string; end: string }[] =
    [];
  const date = new Date(year, 0, 1);

  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  let weekNum = 1;
  while (date.getFullYear() <= year) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 6);

    if (start.getFullYear() > year) break;

    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    weeks.push({
      label: `Week ${weekNum} (${formatDate(start)} - ${formatDate(end)})`,
      value: weekNum,
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    });

    weekNum++;
    date.setDate(date.getDate() + 7);
  }

  return weeks;
}

function DashboardSales() {
  const currentYear = new Date().getFullYear();
  const currentWeek = getWeekNumber(new Date());
  const monthRange = useMemo(() => getCurrentMonthRange(), []);

  const [fromDate, setFromDate] = useState(monthRange.start);
  const [toDate, setToDate] = useState(monthRange.end);
  const [branch, setBranch] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedWeek, setSelectedWeek] = useState(currentWeek.toString());
  const [showByQty, setShowByQty] = useState(false);
  const [presetFilter, setPresetFilter] = useState("this-month");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetKey[]>([
    "this_month",
    "this_week",
    "today",
  ]);

  // Handle preset filter changes
  const handlePresetFilter = (preset: string) => {
    setPresetFilter(preset);
    const today = new Date();

    if (preset === "today") {
      const dateStr = today.toISOString().split("T")[0];
      setFromDate(dateStr);
      setToDate(dateStr);
    } else if (preset === "this-week") {
      const first = new Date(today);
      first.setDate(today.getDate() - today.getDay());
      const last = new Date(first);
      last.setDate(last.getDate() + 6);
      setFromDate(first.toISOString().split("T")[0]);
      setToDate(last.toISOString().split("T")[0]);
    } else if (preset === "this-month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setFromDate(firstDay.toISOString().split("T")[0]);
      setToDate(lastDay.toISOString().split("T")[0]);
    }
  };

  // Generate year options (last 5 years up to current)
  const yearOptions = useMemo(() => {
    const years: string[] = [];
    for (let y = currentYear; y >= currentYear - 4; y--) {
      years.push(y.toString());
    }
    return years;
  }, [currentYear]);

  // Generate weeks for the selected year
  const weeksOfYear = useMemo(
    () => generateWeeksForYear(parseInt(selectedYear)),
    [selectedYear],
  );

  // Reset week to 1 when year changes
  useEffect(() => {
    if (parseInt(selectedYear) === currentYear) {
      setSelectedWeek(currentWeek.toString());
    } else {
      setSelectedWeek("1");
    }
  }, [selectedYear, currentYear, currentWeek]);

  // Get branch ID from localStorage on mount
  useEffect(() => {
    const storedBranch = localStorage.getItem("branch");
    if (storedBranch) setBranch(storedBranch);
  }, []);

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isFetching: isDashboardFetching,
    refetch,
  } = useGetSalesDashboardQuery(
    branch
      ? { bid: parseInt(branch), start_date: fromDate, end_date: toDate }
      : { bid: 0, start_date: fromDate, end_date: toDate },
    { skip: !branch },
  );

  useEffect(() => {
    if (branch) refetch();
  }, [fromDate, toDate, refetch, branch]);

  // Selected week dates
  const selectedWeekDates = useMemo(() => {
    const week = weeksOfYear.find((w) => w.value === parseInt(selectedWeek));
    return week || { start: "", end: "" };
  }, [weeksOfYear, selectedWeek]);

  // Fetch monthly sales
  const {
    data: monthlyResponse,
    isLoading: isMonthlyLoading,
    isFetching: isMonthlyFetching,
    refetch: refetchMonthly,
  } = useGetMonthlySalesQuery(
    branch
      ? { bid: parseInt(branch), year: parseInt(selectedYear) }
      : { bid: 0, year: parseInt(selectedYear) },
    { skip: !branch },
  );

  // Fetch weekly sales
  const {
    data: weeklyResponse,
    isLoading: isWeeklyLoading,
    isFetching: isWeeklyFetching,
    refetch: refetchWeekly,
  } = useGetWeeklySalesQuery(
    branch && selectedWeekDates.start
      ? {
          bid: parseInt(branch),
          start_date: selectedWeekDates.start,
          end_date: selectedWeekDates.end,
        }
      : { bid: 0, start_date: "", end_date: "" },
    { skip: !branch || !selectedWeekDates.start },
  );

  // Refetch all (used by WebSocket)
  const refetchAll = useCallback(() => {
    if (branch) {
      refetch();
      refetchMonthly();
      refetchWeekly();
    }
  }, [branch, refetch, refetchMonthly, refetchWeekly]);

  // WebSocket listener for real-time updates
  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL;
    if (!WS_URL || !branch) return;

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => console.log("WebSocket connected (Dashboard)");

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const storedBranch = localStorage.getItem("branch");

          if (storedBranch && payload.branch_id === parseInt(storedBranch)) {
            console.log("Dashboard update received:", payload);
            refetchAll();

            if (payload.event === "created") {
              toast.success("New purchase recorded", { duration: 2000 });
            } else if (payload.event === "updated") {
              toast.info("Purchase updated", { duration: 2000 });
            } else if (payload.event === "deleted") {
              toast.warning("Purchase deleted", { duration: 2000 });
            }
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onerror = (error) => console.error("WebSocket error:", error);

      ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting...");
        setTimeout(() => {
          if (wsRef.current === ws) connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [branch, refetchAll]);

  // Derived data
  const metrics = dashboardData?.data || {
    num_of_sales: 0,
    cash_sales: 0,
    total_discount: 0,
    average_transaction_value: 0,
  };
  const monthlyData = monthlyResponse?.data || [];
  const weeklyData = weeklyResponse?.data || [];
  const hourlySalesData = dashboardData?.data?.hourly_sales || [];
  const topProducts = showByQty
    ? dashboardData?.data?.top_products_by_qty || []
    : dashboardData?.data?.top_products_by_sales || [];
  const topCashiers = dashboardData?.data?.top_cashiers || [];

  const widgetData = {
    this_month_sales: dashboardData?.data?.this_month_sales ?? 0,
    last_month_sales: dashboardData?.data?.last_month_sales ?? 0,
    month_pct_change: dashboardData?.data?.month_pct_change ?? 0,
    this_week_sales: dashboardData?.data?.this_week_sales ?? 0,
    last_week_sales: dashboardData?.data?.last_week_sales ?? 0,
    week_pct_change: dashboardData?.data?.week_pct_change ?? 0,
    today_sales: dashboardData?.data?.today_sales ?? 0,
    yesterday_sales: dashboardData?.data?.yesterday_sales ?? 0,
    today_pct_change: dashboardData?.data?.today_pct_change ?? 0,
  };

  // Loading states
  const dashboardLoading = isDashboardLoading || isDashboardFetching;
  const monthlyLoading = isMonthlyLoading || isMonthlyFetching;
  const weeklyLoading = isWeeklyLoading || isWeeklyFetching;

  return (
    <>
      <div className="w-full" style={{ padding: "20px", paddingTop: "30px" }}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-2xl">Sales Dashboard</h1>
          </div>

          {/* Sticky Filter Bar */}
          <DashboardFilterBar
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            presetFilter={presetFilter}
            handlePresetFilter={handlePresetFilter}
            setPresetFilter={setPresetFilter}
            isFilterExpanded={isFilterExpanded}
            setIsFilterExpanded={setIsFilterExpanded}
            visibleWidgets={visibleWidgets}
            setVisibleWidgets={setVisibleWidgets}
          />

          {/* Sales Widgets */}
          <SalesWidgets
            data={widgetData}
            isLoading={dashboardLoading}
            visibleWidgets={visibleWidgets}
          />

          {/* Metrics Cards */}
          <MetricsCards metrics={metrics} isLoading={dashboardLoading} />

          {/* Monthly Sales Chart */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <MonthlySalesChart
              monthlyData={monthlyData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              yearOptions={yearOptions}
              isLoading={monthlyLoading}
            />
          </div>

          {/* Weekly + Payment Channels Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            <WeeklySalesChart
              weeklyData={weeklyData}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              weeksOfYear={weeksOfYear}
              isLoading={weeklyLoading}
            />
            <PaymentChannelsChart isLoading={dashboardLoading} />
          </div>

          {/* Average Hourly Sales */}
          <HourlySalesChart
            hourlySalesData={hourlySalesData}
            isLoading={dashboardLoading}
          />

          {/* Top Products Chart + Table */}
          <TopProductsSection
            topProducts={topProducts}
            showByQty={showByQty}
            setShowByQty={setShowByQty}
            isLoading={dashboardLoading}
          />

          {/* Cashier Performance Chart + Table */}
          <CashierPerformanceSection
            topCashiers={topCashiers}
            isLoading={dashboardLoading}
          />
        </div>
      </div>
    </>
  );
}

export default DashboardSales;
