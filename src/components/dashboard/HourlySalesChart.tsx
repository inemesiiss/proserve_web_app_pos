import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import ChartLoading from "./ChartLoading";

interface HourlySalesChartProps {
  hourlySalesData: { label: string; avg_sales: number }[];
  isLoading: boolean;
}

export default function HourlySalesChart({
  hourlySalesData,
  isLoading,
}: HourlySalesChartProps) {
  if (isLoading) {
    return <ChartLoading height={300} />;
  }

  const options = {
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

  const series = [
    { name: "Avg Sales", data: hourlySalesData.map((d) => d.avg_sales) },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Average Hourly Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={series} type="area" height={300} />
      </CardContent>
    </Card>
  );
}
