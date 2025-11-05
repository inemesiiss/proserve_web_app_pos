import { BookText, Package, Users, ClipboardList } from "lucide-react";

export const reportNavs = [
  {
    label: "Sales and TC",
    path: "/admin/reports/transaction",
    icon: <BookText className="w-6 h-6" />,
  },
  {
    label: "Inventory",
    path: "/admin/reports/inventory",
    icon: <Package className="w-6 h-6" />,
  },
  {
    label: "Product Report",
    path: "/admin/reports/product",
    icon: <ClipboardList className="w-6 h-6" />,
  },
  {
    label: "Attendance",
    path: "/admin/reports/attendance",
    icon: <Users className="w-6 h-6" />,
  },
];
