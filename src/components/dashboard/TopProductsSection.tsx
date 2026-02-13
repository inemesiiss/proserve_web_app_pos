import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Chart from "react-apexcharts";
import ChartLoading from "./ChartLoading";

interface TopProduct {
  branch_prod__prod_name: string | null;
  total_sales: number;
  total_qty: number;
}

interface TopProductsSectionProps {
  topProducts: TopProduct[];
  showByQty: boolean;
  setShowByQty: (v: boolean) => void;
  isLoading: boolean;
}

export default function TopProductsSection({
  topProducts,
  showByQty,
  setShowByQty,
  isLoading,
}: TopProductsSectionProps) {
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
      name: showByQty ? "Quantity" : "Sales",
      data: topProducts.map((d) => (showByQty ? d.total_qty : d.total_sales)),
    },
  ];

  const options = {
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

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Chart */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Top Performing Products</CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              id="showByQty"
              checked={showByQty}
              onCheckedChange={(checked) => setShowByQty(checked === true)}
            />
            <Label htmlFor="showByQty" className="text-sm cursor-pointer">
              Show by Quantity
            </Label>
          </div>
        </CardHeader>
        <CardContent>
          <Chart options={options} series={series} type="bar" height={300} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            {showByQty ? "Top Products by Quantity" : "Top Products by Sales"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    {showByQty ? "Quantity Sold" : "Sales Amount"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 text-gray-800">
                      {product.branch_prod__prod_name || "Unknown Product"}
                    </td>
                    <td className="text-right py-3 px-3 font-medium text-gray-900">
                      {showByQty
                        ? product.total_qty
                        : `₱${(product.total_sales || 0).toLocaleString()}`}
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
