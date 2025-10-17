import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  size?: string;
  type: "ticket" | "snack";
  image?: string;
}

interface OrderSummary {
  tickets: OrderItem[];
  snacks: OrderItem[];
}

interface OrderContextType {
  order: OrderSummary;
  addItem: (item: OrderItem) => void;
  removeItem: (id: string, type: "ticket" | "snack") => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<OrderSummary>({ tickets: [], snacks: [] });

  const addItem = (item: OrderItem) => {
    setOrder((prev) => {
      const group = item.type === "ticket" ? "tickets" : "snacks";
      const existing = prev[group].find((i) => i.id === item.id);

      // ✅ If item exists, just update quantity
      if (existing) {
        return {
          ...prev,
          [group]: prev[group].map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
          ),
        };
      }

      // ✅ Otherwise, add new item
      return { ...prev, [group]: [...prev[group], item] };
    });
  };

  const removeItem = (id: string, type: "ticket" | "snack") => {
    setOrder((prev) => ({
      ...prev,
      [type === "ticket" ? "tickets" : "snacks"]: prev[
        type === "ticket" ? "tickets" : "snacks"
      ].filter((i) => i.id !== id),
    }));
  };

  const clearOrder = () => setOrder({ tickets: [], snacks: [] });

  return (
    <OrderContext.Provider value={{ order, addItem, removeItem, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
