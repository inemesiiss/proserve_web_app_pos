import {
  BookText,
  Package,
  Users,
  ClipboardList,
  FileText,
} from "lucide-react";

export const reportNavs = [
  {
    label: "Reports",
    path: "/bm/reports",
    icon: <FileText className="w-6 h-6" />,
    subPaths: [
      {
        label: "Sales and TC",
        path: "/bm/reports/transaction",
        icon: <BookText className="w-6 h-6" />,
      },
      {
        label: "Inventory",
        path: "/bm/reports/inventory",
        icon: <Package className="w-6 h-6" />,
      },
      {
        label: "Product Report",
        path: "/bm/reports/product",
        icon: <ClipboardList className="w-6 h-6" />,
      },
      {
        label: "Attendance",
        path: "/bm/reports/attendance",
        icon: <Users className="w-6 h-6" />,
      },
    ],
  },
  {
    label: "Promotions",
    path: "/admin/reports",
    icon: <FileText className="w-6 h-6" />,
    subPaths: [],
  },
];
