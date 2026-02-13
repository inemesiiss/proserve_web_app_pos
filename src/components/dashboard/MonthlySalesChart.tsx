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

interface MonthlySalesChartProps {
  monthlyData: { label: string; total_sales: number }[];
  selectedYear: string;
  setSelectedYear: (v: string) => void;
  yearOptions: string[];
  isLoading: boolean;
}

export default function MonthlySalesChart({
  monthlyData,
  selectedYear,
  setSelectedYear,
  yearOptions,
  isLoading,
}: MonthlySalesChartProps) {
  if (isLoading) {
    return <ChartLoading height={300} />;
  }

  const options = {
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

  const series = [
    { name: "Sales", data: monthlyData.map((d) => d.total_sales) },
  ];

  return (
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
        <Chart options={options} series={series} type="line" height={300} />
      </CardContent>
    </Card>
  );
}
