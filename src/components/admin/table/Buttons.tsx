import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onGo?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function ActionButtons({
  onGo,
  onDownload,
  onPrint,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        className="bg-blue-700 hover:bg-blue-800 text-white"
        onClick={onGo}
      >
        Go
      </Button>
      <Button variant="outline" onClick={onDownload}>
        Download CSV
      </Button>
      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={onPrint}
      >
        Print Report
      </Button>
    </div>
  );
}
