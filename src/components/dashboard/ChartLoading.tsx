import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ChartLoadingProps {
  height?: number;
}

export default function ChartLoading({ height = 300 }: ChartLoadingProps) {
  return (
    <Card className="bg-white shadow-sm animate-pulse">
      <CardHeader>
        <div className="h-5 w-40 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <div
          className="bg-gray-100 rounded flex items-center justify-center"
          style={{ height }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
