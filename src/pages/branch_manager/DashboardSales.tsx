import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

function DashboardSales() {
  const [fromDate, setFromDate] = useState("2026-02-01");
  const [toDate, setToDate] = useState("2026-02-03");
  const [branch, setBranch] = useState("");
  const [cashier, setCashier] = useState("");

  // Monthly data
  const monthlyData = [
    { month: "January", value: 45000 },
    { month: "February", value: 52000 },
    { month: "March", value: 48000 },
    { month: "April", value: 61000 },
    { month: "May", value: 55000 },
    { month: "June", value: 67000 },
    { month: "July", value: 72000 },
    { month: "August", value: 68000 },
    { month: "September", value: 75000 },
    { month: "October", value: 82000 },
    { month: "November", value: 88000 },
    { month: "December", value: 95000 },
  ];

  // Weekly data
  const weeklyData = [
    { name: "Sun", value: 85000 },
    { name: "Mon", value: 165000 },
    { name: "Tue", value: 155000 },
    { name: "Wed", value: 175000 },
    { name: "Thu", value: 125000 },
    { name: "Fri", value: 145000 },
    { name: "Sat", value: 45000 },
  ];

  // Hourly data
  const hourlyData = [
    { time: "6AM", value: 12000 },
    { time: "8AM", value: 32000 },
    { time: "10AM", value: 58000 },
    { time: "12PM", value: 78000 },
    { time: "2PM", value: 65000 },
    { time: "4PM", value: 52000 },
    { time: "6PM", value: 45000 },
    { time: "8PM", value: 38000 },
    { time: "10PM", value: 25000 },
  ];

  // Channel pie data
  const channelData = [
    { name: "Cash", value: 35, fill: "#06b6d4" },
    { name: "GCash", value: 25, fill: "#8b5cf6" },
    { name: "PayMaya", value: 30, fill: "#ec4899" },
    { name: "Card", value: 10, fill: "#f59e0b" },
  ];

  const monthlyChartConfig = {
    value: {
      label: "Sales",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const weeklyChartConfig = {
    value: {
      label: "Sales",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const hourlyChartConfig = {
    value: {
      label: "Sales",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <div
        className="w-full h-screen "
        style={{
          padding: "20px",
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-bold text-2xl">Sales Dashboard</h1>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">From Date:</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">To Date:</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Branch:</label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="border rounded px-3 py-2">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="branch1">Branch 1</SelectItem>
                    <SelectItem value="branch2">Branch 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Cashier:</label>
                <Select value={cashier} onValueChange={setCashier}>
                  <SelectTrigger className="border rounded px-3 py-2">
                    <SelectValue placeholder="Select Cashier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cashiers</SelectItem>
                    <SelectItem value="cashier1">Cashier 1</SelectItem>
                    <SelectItem value="cashier2">Cashier 2</SelectItem>
                  </SelectContent>
                </Select>
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
                  ₱0.00
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  No. of Transactions
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-2">0</div>
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
                  ₱0.00
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  Total Discount
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  ₱0.00
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 w-full">
            {/* Monthly Chart - Full Width */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Monthly</CardTitle>
              </CardHeader>
              <CardContent className="h-72 w-full flex">
                <ChartContainer config={monthlyChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                        width={50}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly and Channel Charts Side by Side */}
            <div className="grid grid-cols-2 gap-6">
              {/* Weekly Chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly</CardTitle>
                </CardHeader>
                <CardContent className="h-72 w-full flex">
                  <ChartContainer config={weeklyChartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) =>
                            `${(value / 1000).toFixed(0)}k`
                          }
                          width={50}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="var(--chart-2)" radius={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Channel Pie Chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Channel</CardTitle>
                </CardHeader>
                <CardContent className="h-72 flex">
                  <ChartContainer
                    config={{
                      Cash: { label: "Cash", color: "#06b6d4" },
                      GCash: { label: "GCash", color: "#8b5cf6" },
                      PayMaya: { label: "PayMaya", color: "#ec4899" },
                      Card: { label: "Card", color: "#f59e0b" },
                    }}
                  >
                    <PieChart width={300} height={280}>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Chart - Full Width */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Hourly</CardTitle>
              </CardHeader>
              <CardContent className="h-72 w-full flex">
                <ChartContainer config={hourlyChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={hourlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                        width={50}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardSales;
