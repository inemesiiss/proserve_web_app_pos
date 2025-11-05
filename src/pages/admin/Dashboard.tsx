import { SideBar } from "@/components/admin/SideBar";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRef, useState } from "react";

// import { TrendingUp } from "lucide-react";
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
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

function AdminDashboard() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  // use persisted collapsed state to compute initial sidebar width and
  // update via callback from SideBar to avoid following animated width.
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const v = localStorage.getItem("sidebar_collapsed");
      return v === "1" ? 90 : 200;
    } catch (e) {
      return 200;
    }
  });

  // Chart
  const chartData = [
    { time: "6AM", value: 4230 },
    { time: "7AM", value: 3120 },
    { time: "8AM", value: 15500 },
    { time: "9AM", value: 23750 },
    { time: "10AM", value: 48600 },
    { time: "11AM", value: 19870 },
    { time: "12PM", value: 36700 },
    { time: "1PM", value: 41200 },
    { time: "2PM", value: 25400 },
    { time: "3PM", value: 17250 },
    { time: "4PM", value: 33000 },
    { time: "5PM", value: 29500 },
    { time: "6PM", value: 41000 },
  ];
  const chartConfig = {
    value: {
      label: "Amount",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const transactionData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      date: `Oct ${day}`,
      value: Math.floor(Math.random() * 201), // 0 to 200
    };
  });
  const transactionDataConfig = {
    value: {
      label: "Count",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const barChartData = [
    { name: "xxxx", value: 34 },
    { name: "xxxx", value: 120 },
    { name: "xxxx", value: 87 },
    { name: "xxxx", value: 5 },
    { name: "xxxx", value: 199 },
    { name: "xxxx", value: 143 },
    { name: "xxxx", value: 64 },
    { name: "xxxx", value: 23 },
    { name: "xxxx", value: 76 },
    { name: "xxxx", value: 180 },
  ];
  const barChartDataConfig = {
    value: {
      label: "Count",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const paymentData = [
    { name: "Cash", value: 16 },
    { name: "GCash", value: 10 },
    { name: "PayMaya", value: 25 },
    { name: "Card", value: 5 },
  ];
  const paymentDataConfig = {
    value: {
      label: "Count",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const pieChartData = [
    { name: "Cash", value: 55, color: "#00C49F" },
    { name: "GCash", value: 22, color: "#0088FE" },
    { name: "PayMaya", value: 8, color: "#FFBB28" },
    { name: "Card", value: 15, color: "#FF8042" },
  ];

  const pieChartConfig = {
    Cash: { label: "Cash", color: "var(--chart-1)" },
    GCash: { label: "GCash", color: "var(--chart-2)" },
    PayMaya: { label: "PayMaya", color: "var(--chart-3)" },
    Card: { label: "Card", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <>
      <SidebarProvider>
        <SideBar
          ref={sidebarRef}
          onCollapsedChange={(collapsed) =>
            setSidebarWidth(collapsed ? 90 : 200)
          }
        />
        <div
          className={`w-full h-screen `}
          style={{
            paddingLeft: `${sidebarWidth + 50}px`,
            paddingTop: "20px",
            paddingBottom: "10px",
          }}
        >
          <div className="flex flex-col gap-2 pr-10 pb-20">
            <div>
              <span className="font-bold text-xl">Analytic Dashboard</span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="border w-full px-4 rounded-2xl shadow-xs">
                <div className="p-4 ">
                  <span className="text-xl">Sales Summary</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 pt-2  gap-6">
                    <div className="bg-[#DE3B40FF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">Total Sales</p>
                      <p className="text-white font-bold text-3xl pt-2">
                        1200.00
                      </p>
                    </div>

                    <div className="bg-[#BCC1CAFF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">No. of Transactions</p>
                      <p className="text-white font-bold text-3xl pt-2">1</p>
                    </div>

                    <div className="bg-[#DE3B40FF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">
                        Average Transaction Value
                      </p>
                      <p className="text-white font-bold text-3xl pt-2">5</p>
                    </div>

                    <div className="bg-[#BCC1CAFF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">Total Discount</p>
                      <p className="text-white font-bold text-3xl pt-2">0</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 ">
                  <span className="text-xl">Sales by Channel</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 pt-2  gap-6">
                    <div className="bg-[#BCC1CAFF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">Gcash</p>
                      <p className="text-white font-bold text-3xl pt-2">0</p>
                    </div>

                    <div className="bg-[#DE3B40FF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">Paymaya</p>
                      <p className="text-white font-bold text-3xl pt-2">90</p>
                    </div>

                    <div className="bg-[#BCC1CAFF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">Visa</p>
                      <p className="text-white font-bold text-3xl pt-2">3</p>
                    </div>

                    <div className="bg-[#DE3B40FF] rounded-2xl p-4 py-6 shadow">
                      <p className="text-white text-xl">Mastercard</p>
                      <p className="text-white font-bold text-3xl pt-2">8</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border w-full px-4 rounded-2xl shadow-xs">
                <Card className="shadow-none border-none">
                  <CardHeader>
                    <span className="font-bold text-lg">Sales Report</span>
                    <div className="flex gap-4">
                      <div className="grid max-w-xs items-center gap-1 ">
                        <Label htmlFor="date">Date</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Today" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="c_week">
                                Current Week
                              </SelectItem>
                              <SelectItem value="l_Week">Last Week</SelectItem>
                              <SelectItem value="c_month">
                                Current Month
                              </SelectItem>
                              <SelectItem value="l_month">
                                Last Month
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom Date
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid max-w-xs items-center gap-1">
                        <Label>&nbsp;</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Hourly" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid  max-w-xs items-center gap-1">
                        <Label htmlFor="branch">Branch</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Branches" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="all">All Branches</SelectItem>
                              <SelectItem value="branch_1">Branch 1</SelectItem>
                              <SelectItem value="branch_2">Branch 2</SelectItem>
                              <SelectItem value="branch_3">Branch 3</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid  max-w-xs items-center gap-1">
                        <Label>&nbsp;</Label>
                        <Button className="bg-[#EA916EFF] hover:bg-[#ea8259]">
                          Go
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="">
                    <ChartContainer
                      config={chartConfig}
                      className="h-72 w-full"
                    >
                      <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) =>
                            `₱${(value / 1000).toFixed(0)}k`
                          }
                        />

                        <XAxis
                          dataKey="time"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                          dataKey="value"
                          type="monotone"
                          stroke="#22CCB2FF"
                          strokeWidth={2}
                          dot={{
                            fill: "#22CCB2FF",
                          }}
                          activeDot={{
                            r: 6,
                          }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                </Card>
              </div>

              <div className="border w-full px-4 rounded-2xl shadow-xs">
                <Card className="shadow-none border-none">
                  <CardHeader>
                    <span className="font-bold text-lg">
                      Transaction Count Report
                    </span>
                    <div className="flex gap-4">
                      <div className="grid max-w-xs items-center gap-1 ">
                        <Label htmlFor="date">Date</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Today" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="c_week">
                                Current Week
                              </SelectItem>
                              <SelectItem value="l_Week">Last Week</SelectItem>
                              <SelectItem value="c_month">
                                Current Month
                              </SelectItem>
                              <SelectItem value="l_month">
                                Last Month
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom Date
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid max-w-xs items-center gap-1">
                        <Label>&nbsp;</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Hourly" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid  max-w-xs items-center gap-1">
                        <Label htmlFor="branch">Branch</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Branches" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="all">All Branches</SelectItem>
                              <SelectItem value="branch_1">Branch 1</SelectItem>
                              <SelectItem value="branch_2">Branch 2</SelectItem>
                              <SelectItem value="branch_3">Branch 3</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid  max-w-xs items-center gap-1">
                        <Label>&nbsp;</Label>
                        <Button className="bg-[#EA916EFF] hover:bg-[#ea8259]">
                          Go
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="">
                    <ChartContainer
                      config={transactionDataConfig}
                      className="h-72 w-full"
                    >
                      <LineChart
                        accessibilityLayer
                        data={transactionData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value}
                        />

                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                          dataKey="value"
                          type="monotone"
                          stroke="#22CCB2FF"
                          strokeWidth={2}
                          dot={{
                            fill: "#22CCB2FF",
                          }}
                          activeDot={{
                            r: 6,
                          }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                </Card>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border w-full px-4 rounded-2xl shadow-xs col-span-2">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <span className="font-bold text-lg  text-center">
                        Top Product Transaction Count
                      </span>
                    </CardHeader>
                    <CardContent className="">
                      <ChartContainer
                        config={barChartDataConfig}
                        className="h-72 w-full"
                      >
                        <BarChart accessibilityLayer data={barChartData}>
                          <CartesianGrid vertical={false} />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tickFormatter={(value) => `${value}`}
                          />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar
                            dataKey="value"
                            // fill="var(--color-desktop)"
                            fill="#22CCB2FF"
                            radius={8}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                  </Card>
                </div>

                <div className="border w-full px-4 rounded-2xl shadow-xs">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <span className="font-bold text-lg  text-center">
                        Payment Type ( TC)
                      </span>
                    </CardHeader>
                    <CardContent className="">
                      <ChartContainer
                        config={paymentDataConfig}
                        className="h-72 w-full"
                      >
                        <BarChart accessibilityLayer data={paymentData}>
                          <CartesianGrid vertical={false} />

                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar
                            dataKey="value"
                            // fill="var(--color-desktop)"
                            fill="#22CCB2FF"
                            radius={8}
                            label={{
                              position: "top",
                              fill: "#000",
                              fontSize: 12,
                            }}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                  </Card>
                </div>

                <div className="border w-full px-4 rounded-2xl shadow-xs">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <span className="font-bold text-lg  text-center">
                        Payment Type ( Sales )
                      </span>
                    </CardHeader>
                    <CardContent className="">
                      <ChartContainer
                        config={pieChartConfig}
                        className="h-72 w-full"
                      >
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            // label
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <ChartLegend
                              content={<ChartLegendContent nameKey="name" />}
                              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                            />
                          </Pie>
                        </PieChart>
                        {/* <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                          />
                          <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                          />
                        </PieChart> */}
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default AdminDashboard;
