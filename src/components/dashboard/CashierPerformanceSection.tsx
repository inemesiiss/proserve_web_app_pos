import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import ChartLoading from "./ChartLoading";

interface TopCashier {
  fullname: string;
  total_sales: number;
  num_transactions: number;
}

interface CashierPerformanceSectionProps {
  topCashiers: TopCashier[];
  isLoading: boolean;
}

export default function CashierPerformanceSection({
  topCashiers,
  isLoading,
}: CashierPerformanceSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        <ChartLoading height={300} />
        <ChartLoading height={300} />
      </div>
    );
  }

  const series = [
    {
      name: "Total Sales",
      data: topCashiers.map((d) => d.total_sales),
    },
    {
      name: "Transactions",
      data: topCashiers.map((d) => d.num_transactions),
    },
  ];

  const options = {
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
    <div className="grid grid-cols-2 gap-6">
      {/* Chart */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Cashier Performance Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart options={options} series={series} type="bar" height={300} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Cashier Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">
                    Cashier Name
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    Transaction Count
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    Sales Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCashiers.map((cashier, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 text-gray-800">
                      {cashier.fullname}
                    </td>
                    <td className="text-right py-3 px-3 font-medium text-gray-900">
                      {cashier.num_transactions}
                    </td>
                    <td className="text-right py-3 px-3 font-medium text-gray-900">
                      ₱{(cashier.total_sales || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
