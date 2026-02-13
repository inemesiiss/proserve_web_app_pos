import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import ChartLoading from "./ChartLoading";

interface PaymentChannelsChartProps {
  isLoading: boolean;
}

const channelData = [
  { name: "Cash", value: 35, fill: "#06b6d4" },
  { name: "GCash", value: 25, fill: "#8b5cf6" },
  { name: "PayMaya", value: 30, fill: "#ec4899" },
  { name: "Card", value: 10, fill: "#f59e0b" },
];

export default function PaymentChannelsChart({
  isLoading,
}: PaymentChannelsChartProps) {
  if (isLoading) {
    return <ChartLoading height={300} />;
  }

  return (
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
  );
}
