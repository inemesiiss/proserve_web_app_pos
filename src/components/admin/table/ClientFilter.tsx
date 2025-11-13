import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFilterProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Mock client data - replace with actual data from API/database
const clients = [
  { id: "all", name: "All Clients" },
  { id: "client-1", name: "ABC Corporation" },
  { id: "client-2", name: "XYZ Company" },
  { id: "client-3", name: "Tech Solutions Inc" },
  { id: "client-4", name: "Global Enterprises" },
  { id: "client-5", name: "Prime Industries" },
  { id: "client-6", name: "Metro Business Group" },
];

export default function ClientFilter({
  value,
  onValueChange,
  placeholder = "All Clients",
  className = "w-[160px]",
}: ClientFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
