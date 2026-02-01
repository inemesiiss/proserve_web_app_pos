import {
  BookText,
  Package,
  Users,
  ClipboardList,
  DollarSign,
} from "lucide-react";

export const reportNavs = [
  {
    label: "Analytic Dashboard",
    path: "/bm/dashboard-sales",

    icon: <BookText className="w-6 h-6" />,
  },
  // {
  //   label: "Sales Collection",
  //   path: "/bm/reports/sales",
  //   icon: <BookText className="w-6 h-6" />,
  // },
  {
    label: "Sales & Transactions",
    path: "/bm/reports/transaction",
    icon: <DollarSign className="w-6 h-6" />,
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
  // {
  //   label: "Discount & Promotions",
  //   path: "/bm/reports/discount-promotion",
  //   icon: <Users className="w-6 h-6" />,
  // },
];
