import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Chart from "react-apexcharts";
import ChartLoading from "./ChartLoading";

interface WeekOption {
  label: string;
  value: number;
  start: string;
  end: string;
}

interface WeeklySalesChartProps {
  weeklyData: { label: string; total_sales: number }[];
  selectedWeek: string;
  setSelectedWeek: (v: string) => void;
  weeksOfYear: WeekOption[];
  isLoading: boolean;
}

export default function WeeklySalesChart({
  weeklyData,
  selectedWeek,
  setSelectedWeek,
  weeksOfYear,
  isLoading,
}: WeeklySalesChartProps) {
  if (isLoading) {
    return <ChartLoading height={300} />;
  }

  const options = {
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

  const series = [
    { name: "Sales", data: weeklyData.map((d) => d.total_sales) },
  ];

  return (
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
        <Chart options={options} series={series} type="bar" height={300} />
      </CardContent>
    </Card>
  );
}
