import { Card, CardContent } from "@/components/ui/card";

interface MetricsData {
  num_of_sales: number;
  cash_sales: number;
  total_discount: number;
  average_transaction_value: number;
}

interface MetricsCardsProps {
  metrics: MetricsData;
  isLoading: boolean;
}

function MetricSkeleton() {
  return (
    <Card className="bg-white shadow-sm animate-pulse">
      <CardContent className="p-4">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-7 w-20 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
}

export default function MetricsCards({
  metrics,
  isLoading,
}: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Cash Sales",
      value: `₱${(metrics.cash_sales / 1000).toFixed(1)}k`,
      color: "text-gray-900",
    },
    {
      label: "No. of Transactions",
      value: metrics.num_of_sales.toString(),
      color: "text-blue-600",
    },
    {
      label: "Cashless Sales",
      value: "₱0.00",
      color: "text-gray-900",
    },
    {
      label: "Average Transaction Value",
      value: `₱${metrics.average_transaction_value.toFixed(2)}`,
      color: "text-gray-900",
    },
    {
      label: "Total Discount",
      value: `₱${(metrics.total_discount / 1000).toFixed(1)}k`,
      color: "text-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 font-medium">
              {card.label}
            </div>
            <div className={`text-2xl font-bold ${card.color} mt-2`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
