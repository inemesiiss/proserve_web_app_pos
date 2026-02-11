import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Chart from "react-apexcharts";
import {
  useGetSalesDashboardQuery,
  useGetMonthlySalesQuery,
  useGetWeeklySalesQuery,
} from "@/store/api/Reports";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

  // Move to the first Monday of the year
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  let weekNum = 1;
  while (date.getFullYear() <= year) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 6);

    // Stop if the week starts in the next year
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
  const [cashier, setCashier] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  // Monthly chart year filter
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Weekly chart week filter
  const [selectedWeek, setSelectedWeek] = useState(currentWeek.toString());

  // Toggle between top products by sales or by quantity (default: sales)
  const [showByQty, setShowByQty] = useState(false);

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

  // Reset week to 1 when year changes (avoids invalid week)
  useEffect(() => {
    if (parseInt(selectedYear) === currentYear) {
      setSelectedWeek(currentWeek.toString());
    } else {
      setSelectedWeek("1");
    }
  }, [selectedYear, currentYear, currentWeek]);

  // Get branch ID from localStorage on component mount
  useEffect(() => {
    const storedBranch = localStorage.getItem("branch");
    if (storedBranch) {
      setBranch(storedBranch);
    }
  }, []);

  // Fetch dashboard data using RTK Query
  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useGetSalesDashboardQuery(
    branch
      ? {
          bid: parseInt(branch),
          start_date: fromDate,
          end_date: toDate,
        }
      : { bid: 0, start_date: fromDate, end_date: toDate },
    { skip: !branch },
  );

  // Refetch when dates change
  useEffect(() => {
    if (branch) {
      refetch();
    }
  }, [fromDate, toDate, refetch, branch]);

  // Get the selected week's start and end dates for the weekly query
  const selectedWeekDates = useMemo(() => {
    const week = weeksOfYear.find((w) => w.value === parseInt(selectedWeek));
    return week || { start: "", end: "" };
  }, [weeksOfYear, selectedWeek]);

  // Fetch monthly sales by year
  const { data: monthlyResponse, refetch: refetchMonthly } =
    useGetMonthlySalesQuery(
      branch
        ? { bid: parseInt(branch), year: parseInt(selectedYear) }
        : { bid: 0, year: parseInt(selectedYear) },
      { skip: !branch },
    );

  // Fetch weekly sales by selected week date range
  const { data: weeklyResponse, refetch: refetchWeekly } =
    useGetWeeklySalesQuery(
      branch && selectedWeekDates.start
        ? {
            bid: parseInt(branch),
            start_date: selectedWeekDates.start,
            end_date: selectedWeekDates.end,
          }
        : { bid: 0, start_date: "", end_date: "" },
      { skip: !branch || !selectedWeekDates.start },
    );

  // Refetch all dashboard data (used by WebSocket)
  const refetchAll = useCallback(() => {
    if (branch) {
      refetch();
      refetchMonthly();
      refetchWeekly();
    }
  }, [branch, refetch, refetchMonthly, refetchWeekly]);

  // WebSocket listener for real-time purchase updates
  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL;
    if (!WS_URL || !branch) return;

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected (Dashboard)");
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const storedBranch = localStorage.getItem("branch");

          // Only update if the event belongs to the current branch
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

      ws.onerror = (error) => {
        console.error("WebSocket error (Dashboard):", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected (Dashboard), reconnecting...");
        // Reconnect after 3 seconds
        setTimeout(() => {
          if (wsRef.current === ws) {
            connect();
          }
        }, 3000);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [branch, refetchAll]);

  const metrics = dashboardData?.data || {
    num_of_sales: 0,
    cash_sales: 0,
    total_discount: 0,
    average_transaction_value: 0,
  };

  // Monthly sales from API
  const monthlyData = monthlyResponse?.data || [];

  // Weekly sales from API
  const weeklyData = weeklyResponse?.data || [];

  // Average hourly sales from API
  const hourlySalesData = dashboardData?.data?.hourly_sales || [];

  // Channel pie data
  const channelData = [
    { name: "Cash", value: 35, fill: "#06b6d4" },
    { name: "GCash", value: 25, fill: "#8b5cf6" },
    { name: "PayMaya", value: 30, fill: "#ec4899" },
    { name: "Card", value: 10, fill: "#f59e0b" },
  ];

  // Top products from API, toggled by sales or quantity
  const topProducts = showByQty
    ? dashboardData?.data?.top_products_by_qty || []
    : dashboardData?.data?.top_products_by_sales || [];

  // Top cashiers from API
  const topCashiers = dashboardData?.data?.top_cashiers || [];

  const monthlyChartOptions = {
    chart: { type: "line" as const, toolbar: { show: true } },
    xaxis: { categories: monthlyData.map((d) => d.label) },
    yaxis: {
      labels: {
        formatter: (val: number) => `₱${val.toLocaleString()}`,
      },
    },
    stroke: { curve: "smooth" as const, width: 2 },
    colors: ["#0891b2"],
    tooltip: {
      y: { formatter: (val: number) => `₱${val.toLocaleString()}` },
    },
  };

  const weeklySeries = [
    {
      name: "Sales",
      data: weeklyData.map((d) => d.total_sales),
    },
  ];

  const weeklyChartOptions = {
    chart: { type: "bar" as const, toolbar: { show: true } },
    xaxis: { categories: weeklyData.map((d) => d.label) },
    yaxis: {
      labels: {
        formatter: (val: number) => `₱${val.toLocaleString()}`,
      },
    },
    colors: ["#7c3aed"],
    tooltip: {
      y: { formatter: (val: number) => `₱${val.toLocaleString()}` },
    },
  };

  const hourlySeries = [
    {
      name: "Avg Sales",
      data: hourlySalesData.map((d) => d.avg_sales),
    },
  ];

  const hourlyChartOptions = {
    chart: { type: "area" as const, toolbar: { show: true } },
    xaxis: { categories: hourlySalesData.map((d) => d.label) },
    yaxis: {
      labels: {
        formatter: (val: number) => `₱${val.toFixed(2)}`,
      },
    },
    stroke: { curve: "smooth" as const, width: 2 },
    colors: ["#0891b2"],
    tooltip: {
      y: {
        formatter: (val: number) => `₱${val.toFixed(2)}`,
      },
    },
  };

  const monthlySeries = [
    {
      name: "Sales",
      data: monthlyData.map((d) => d.total_sales),
    },
  ];

  // Product chart: show sales amount or quantity based on toggle
  const productRankingSeries = [
    {
      name: showByQty ? "Quantity" : "Sales",
      data: topProducts.map((d) => (showByQty ? d.total_qty : d.total_sales)),
    },
  ];

  const productRankingOptions = {
    chart: { type: "bar" as const, toolbar: { show: true } },
    xaxis: {
      categories: topProducts.map(
        (d) => d.branch_prod__prod_name || "Unknown Product",
      ),
    },
    yaxis: {
      labels: {
        formatter: (val: number) =>
          showByQty ? val.toString() : `₱${(val / 1000).toFixed(0)}k`,
      },
    },
    colors: ["#6366f1"],
  };

  // Cashier chart: shows total sales with transaction count in tooltip
  const cashierPerformanceSeries = [
    {
      name: "Total Sales",
      data: topCashiers.map((d) => d.total_sales),
    },
    {
      name: "Transactions",
      data: topCashiers.map((d) => d.num_transactions),
    },
  ];

  const cashierPerformanceOptions = {
    chart: { type: "bar" as const, toolbar: { show: true } },
    xaxis: {
      categories: topCashiers.map((d) => d.fullname),
    },
    yaxis: [
      {
        title: { text: "Total Sales" },
        labels: {
          formatter: (val: number) => `₱${(val / 1000).toFixed(0)}k`,
        },
      },
      {
        opposite: true,
        title: { text: "Transactions" },
        labels: {
          formatter: (val: number) => val.toFixed(0),
        },
      },
    ],
    colors: ["#ef4444", "#3b82f6"],
  };

  return (
    <>
      <div className="w-full" style={{ padding: "20px", paddingTop: "100px" }}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-bold text-2xl">Sales Dashboard</h1>
            </div>
          </div>

          {/* Sticky Filter Bar */}
          <div className="fixed top-15 left-73 right-0 z-50 w-[80%] bg-white shadow-md border-b border-gray-200 rounded-lg">
            <div className="px-6 py-5 max-w-full">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {/* <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Branch
                  </label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      <SelectItem value="branch1">Branch 1</SelectItem>
                      <SelectItem value="branch2">Branch 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                {/* <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Cashier
                  </label>
                  <Select value={cashier} onValueChange={setCashier}>
                    <SelectTrigger className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
                      <SelectValue placeholder="Select Cashier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cashiers</SelectItem>
                      <SelectItem value="cashier1">Cashier 1</SelectItem>
                      <SelectItem value="cashier2">Cashier 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  Cash Sales
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  ₱{(metrics.cash_sales / 1000).toFixed(1)}k
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  No. of Transactions
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  {metrics.num_of_sales}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  Cashless Sales
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  ₱0.00
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  Average Transaction Value
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  ₱{metrics.average_transaction_value.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  Total Discount
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  ₱{(metrics.total_discount / 1000).toFixed(1)}k
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 w-full">
            {/* Monthly Sales with Year Filter */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Monthly Sales</CardTitle>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px] border border-gray-300 rounded-lg text-sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Chart
                  options={monthlyChartOptions}
                  series={monthlySeries}
                  type="line"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
          {/* Weekly and Channel Charts Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Weekly Sales with Week Filter */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-lg">Weekly Sales</CardTitle>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-lg text-sm">
                    <SelectValue placeholder="Select Week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeksOfYear.map((w) => (
                      <SelectItem key={w.value} value={w.value.toString()}>
                        {w.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Chart
                  options={weeklyChartOptions}
                  series={weeklySeries}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Channel Pie Chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Payment Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={{
                    chart: { type: "donut" as const },
                    labels: channelData.map((d) => d.name),
                    colors: channelData.map((d) => d.fill),
                    legend: { position: "bottom" as const },
                  }}
                  series={channelData.map((d) => d.value)}
                  type="donut"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Average Hourly Sales Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Average Hourly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={hourlyChartOptions}
                series={hourlySeries}
                type="area"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Product and Cashier Performance Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Products with Sales/Qty toggle */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Top Performing Products
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showByQty"
                    checked={showByQty}
                    onCheckedChange={(checked) =>
                      setShowByQty(checked === true)
                    }
                  />
                  <Label htmlFor="showByQty" className="text-sm cursor-pointer">
                    Show by Quantity
                  </Label>
                </div>
              </CardHeader>
              <CardContent>
                <Chart
                  options={productRankingOptions}
                  series={productRankingSeries}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Cashier Performance - sales and transaction count */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Cashier Performance Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={cashierPerformanceOptions}
                  series={cashierPerformanceSeries}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardSales;
