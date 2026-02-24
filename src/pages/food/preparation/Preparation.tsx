import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Timer,
  AlertTriangle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// ============================================================
// TYPES - Replace with API types when kitchen endpoints exist
// ============================================================

interface KitchenOrderItem {
  id: number;
  productName: string;
  quantity: number;
  customization?: string; // e.g. "No onion, Extra cheese"
  notes?: string;
}

interface KitchenOrder {
  id: number;
  orderNum: string;
  invoiceNum: string;
  cashierName: string;
  items: KitchenOrderItem[];
  status: "pending" | "preparing" | "completed" | "cancelled";
  createdAt: string; // ISO timestamp
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  estimatedMinutes?: number; // preparation time estimate
}

type FilterStatus = "all" | "pending" | "preparing" | "completed" | "cancelled";

// ============================================================
// MOCK DATA - Remove when connected to real API
// ============================================================

const MOCK_ORDERS: KitchenOrder[] = [
  {
    id: 1,
    orderNum: "ORD-001",
    invoiceNum: "POS-58768011",
    cashierName: "Amanda Lopez",
    items: [
      {
        id: 1,
        productName: "Chicken Meal",
        quantity: 2,
        customization: "Extra rice",
      },
      { id: 2, productName: "Coke Float", quantity: 2 },
    ],
    status: "pending",
    createdAt: dayjs().subtract(3, "minute").toISOString(),
    estimatedMinutes: 10,
  },
  {
    id: 2,
    orderNum: "ORD-002",
    invoiceNum: "POS-55765971",
    cashierName: "Amanda Lopez",
    items: [
      { id: 3, productName: "Burger Steak", quantity: 1 },
      { id: 4, productName: "Fries Regular", quantity: 1 },
      { id: 5, productName: "Iced Tea", quantity: 1 },
    ],
    status: "preparing",
    createdAt: dayjs().subtract(8, "minute").toISOString(),
    estimatedMinutes: 15,
  },
  {
    id: 3,
    orderNum: "ORD-003",
    invoiceNum: "POS-97436923",
    cashierName: "John Reyes",
    items: [
      {
        id: 6,
        productName: "Spaghetti",
        quantity: 3,
        customization: "No cheese",
      },
    ],
    status: "pending",
    createdAt: dayjs().subtract(1, "minute").toISOString(),
    estimatedMinutes: 12,
  },
  {
    id: 4,
    orderNum: "ORD-004",
    invoiceNum: "POS-33556271",
    cashierName: "John Reyes",
    items: [
      { id: 7, productName: "Pork Sisig", quantity: 1 },
      { id: 8, productName: "Rice", quantity: 2 },
    ],
    status: "completed",
    createdAt: dayjs().subtract(25, "minute").toISOString(),
    completedAt: dayjs().subtract(10, "minute").toISOString(),
    estimatedMinutes: 15,
  },
  {
    id: 5,
    orderNum: "ORD-005",
    invoiceNum: "POS-11223344",
    cashierName: "Amanda Lopez",
    items: [
      { id: 9, productName: "Fish Fillet", quantity: 1, notes: "Well done" },
    ],
    status: "cancelled",
    createdAt: dayjs().subtract(20, "minute").toISOString(),
    cancelledAt: dayjs().subtract(18, "minute").toISOString(),
    cancelReason: "Customer changed mind",
    estimatedMinutes: 12,
  },
];

// ============================================================
// CANCEL REASON MODAL
// ============================================================

function CancelReasonModal({
  isOpen,
  onClose,
  onConfirm,
  orderNum,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderNum: string;
}) {
  const [reason, setReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presetReasons = [
    "Customer changed mind",
    "Item out of stock",
    "Wrong order placed",
    "Customer left",
    "Duplicate order",
  ];

  const handleConfirm = () => {
    const finalReason = selectedPreset || reason.trim();
    if (!finalReason) return;
    onConfirm(finalReason);
    setReason("");
    setSelectedPreset(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-[480px] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Cancel Order</h3>
              <p className="text-sm text-gray-500">
                Provide a reason for cancelling {orderNum}
              </p>
            </div>
          </div>

          {/* Preset Reasons */}
          <div className="space-y-2 mb-4">
            {presetReasons.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSelectedPreset(preset);
                  setReason("");
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                  selectedPreset === preset
                    ? "border-red-500 bg-red-50 text-red-700 font-medium"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Custom Reason */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Or type a custom reason:
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder="Enter reason..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Go Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedPreset && !reason.trim()}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Cancel
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// ORDER CARD COMPONENT
// ============================================================

function OrderCard({
  order,
  onMarkPreparing,
  onMarkCompleted,
  onCancel,
}: {
  order: KitchenOrder;
  onMarkPreparing: (id: number) => void;
  onMarkCompleted: (id: number) => void;
  onCancel: (id: number) => void;
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = dayjs().diff(dayjs(order.createdAt), "minute");
      setElapsedMinutes(diff);
    };
    update();
    const interval = setInterval(update, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const isOverdue =
    order.estimatedMinutes !== undefined &&
    elapsedMinutes > order.estimatedMinutes &&
    (order.status === "pending" || order.status === "preparing");

  const statusConfig = {
    pending: {
      color: "border-yellow-400 bg-yellow-50",
      badge: "bg-yellow-100 text-yellow-800",
      label: "Pending",
      icon: <Clock size={14} />,
    },
    preparing: {
      color: "border-blue-400 bg-blue-50",
      badge: "bg-blue-100 text-blue-800",
      label: "Preparing",
      icon: <ChefHat size={14} />,
    },
    completed: {
      color: "border-green-400 bg-green-50/50",
      badge: "bg-green-100 text-green-800",
      label: "Completed",
      icon: <CheckCircle2 size={14} />,
    },
    cancelled: {
      color: "border-red-300 bg-red-50/50",
      badge: "bg-red-100 text-red-800",
      label: "Cancelled",
      icon: <XCircle size={14} />,
    },
  };

  const config = statusConfig[order.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-xl border-2 ${config.color} p-4 shadow-sm hover:shadow-md transition-shadow ${
        order.status === "completed" || order.status === "cancelled"
          ? "opacity-70"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 text-lg">
            {order.orderNum}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.badge}`}
          >
            {config.icon}
            {config.label}
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isOverdue ? "text-red-600" : "text-gray-500"
          }`}
        >
          {isOverdue && <AlertTriangle size={12} />}
          <Timer size={12} />
          <span>
            {elapsedMinutes}m
            {order.estimatedMinutes ? ` / ${order.estimatedMinutes}m` : ""}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500 mb-3 flex gap-3">
        <span>{order.invoiceNum}</span>
        <span>•</span>
        <span>{order.cashierName}</span>
        <span>•</span>
        <span>{dayjs(order.createdAt).format("hh:mm A")}</span>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-sm">
            <span className="font-bold text-gray-700 w-6 text-right shrink-0">
              {item.quantity}×
            </span>
            <div className="flex-1">
              <span className="text-gray-800 font-medium">
                {item.productName}
              </span>
              {item.customization && (
                <p className="text-xs text-orange-600 mt-0.5">
                  ↳ {item.customization}
                </p>
              )}
              {item.notes && (
                <p className="text-xs text-blue-600 italic mt-0.5">
                  Note: {item.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Reason */}
      {order.status === "cancelled" && order.cancelReason && (
        <div className="bg-red-100 rounded-lg px-3 py-2 mb-3 text-xs text-red-700">
          <span className="font-semibold">Reason:</span> {order.cancelReason}
        </div>
      )}

      {/* Completed Info */}
      {order.status === "completed" && order.completedAt && (
        <div className="bg-green-100 rounded-lg px-3 py-2 mb-3 text-xs text-green-700">
          Completed at {dayjs(order.completedAt).format("hh:mm A")} (
          {dayjs(order.completedAt).diff(dayjs(order.createdAt), "minute")}m)
        </div>
      )}

      {/* Actions */}
      {(order.status === "pending" || order.status === "preparing") && (
        <div className="flex gap-2 pt-2 border-t border-gray-200/50">
          {order.status === "pending" && (
            <Button
              size="sm"
              onClick={() => onMarkPreparing(order.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs h-9"
            >
              <ChefHat size={14} className="mr-1" />
              Start Preparing
            </Button>
          )}

          {order.status === "preparing" && (
            <Button
              size="sm"
              onClick={() => onMarkCompleted(order.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs h-9"
            >
              <CheckCircle2 size={14} className="mr-1" />
              Mark Completed
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancel(order.id)}
            className="rounded-lg text-xs h-9 border-red-200 text-red-600 hover:bg-red-50"
          >
            <XCircle size={14} className="mr-1" />
            Cancel
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// MAIN PREPARATION PAGE
// ============================================================

export default function PreparationPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [cancelTarget, setCancelTarget] = useState<KitchenOrder | null>(null);

  // TODO: Replace with real API call
  // const { data: ordersData } = useGetKitchenOrdersQuery({ branchId, status: filter });

  const handleMarkPreparing = useCallback((orderId: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "preparing" as const } : o,
      ),
    );
    // TODO: Call API -> PATCH /api/kitchen/orders/{id}/status { status: "preparing" }
  }, []);

  const handleMarkCompleted = useCallback((orderId: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            }
          : o,
      ),
    );
    // TODO: Call API -> PATCH /api/kitchen/orders/{id}/status { status: "completed" }
  }, []);

  const handleCancel = useCallback(
    (orderId: number) => {
      const order = orders.find((o) => o.id === orderId);
      if (order) setCancelTarget(order);
    },
    [orders],
  );

  const handleConfirmCancel = useCallback(
    (reason: string) => {
      if (!cancelTarget) return;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelTarget.id
            ? {
                ...o,
                status: "cancelled" as const,
                cancelledAt: new Date().toISOString(),
                cancelReason: reason,
              }
            : o,
        ),
      );
      setCancelTarget(null);
      // TODO: Call API -> PATCH /api/kitchen/orders/{id}/cancel { reason }
    },
    [cancelTarget],
  );

  const handleRefresh = () => {
    // TODO: Refetch from API
    setOrders([...MOCK_ORDERS]);
  };

  // Count by status
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Sort: pending first, then preparing, completed, cancelled
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const priority = { pending: 0, preparing: 1, completed: 2, cancelled: 3 };
    return priority[a.status] - priority[b.status];
  });

  const filterTabs: { key: FilterStatus; label: string; color: string }[] = [
    { key: "all", label: "All", color: "bg-gray-100 text-gray-700" },
    {
      key: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      key: "preparing",
      label: "Preparing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      key: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <ChefHat size={22} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Kitchen Preparation
              </h1>
              <p className="text-xs text-gray-500">
                {dayjs().format("MMMM DD, YYYY")} &middot;{" "}
                {counts.pending + counts.preparing} active orders
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-lg gap-1.5"
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-4">
          <Filter size={14} className="text-gray-400" />
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.key
                  ? `${tab.color} ring-2 ring-offset-1 ring-gray-300`
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({counts[tab.key]})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-6">
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ChefHat size={64} strokeWidth={1} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">No orders</p>
            <p className="text-sm mt-1">
              {filter === "all"
                ? "Waiting for incoming orders..."
                : `No ${filter} orders right now`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {sortedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkPreparing={handleMarkPreparing}
                  onMarkCompleted={handleMarkCompleted}
                  onCancel={handleCancel}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cancel Reason Modal */}
      <CancelReasonModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        orderNum={cancelTarget?.orderNum || ""}
      />
    </div>
  );
}
