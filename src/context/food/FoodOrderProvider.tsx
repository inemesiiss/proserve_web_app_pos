import { menuData } from "@/data/food/products";
import type { Product, Meal } from "@/data/food/products";
import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";

export interface OrderItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  image: string;
  size?: string;
  category?: string;
  type: "meal" | "product";
  variation?: string;

  // --- New fields ---
  isVoid?: boolean;
  isDiscount?: boolean;
  itemTotalDiscount?: number;
  percentDiscount?: number;
  discount_type?: "pwd" | "sc";
}

interface FoodOrderContextType {
  meals: OrderItem[];
  products: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: number, type: "meal" | "product") => void;
  clearOrder: () => void;
  getMealDetails: (meal: Meal) => Product[];
  getProduct: (id: number) => Product | undefined;

  // --- Totals ---
  subTotal: number;
  totalDiscount: number;
  grandTotal: number;

  // --- Update helpers ---
  toggleVoid: (id: number, type: "meal" | "product") => void;
  updateQty: (id: number, type: "meal" | "product", qty: number) => void;
  applyDiscount: (
    id: number,
    type: "meal" | "product",
    discountType: "pwd" | "sc"
  ) => void;
}

const FoodOrderContext = createContext<FoodOrderContextType | undefined>(
  undefined
);

export const FoodOrderProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<OrderItem[]>([]);

  // --- Core Add Function ---
  const addItem = (item: OrderItem) => {
    const setGroup = item.type === "meal" ? setMeals : setProducts;
    const group = item.type === "meal" ? meals : products;

    const existing = group.find(
      (i) => i.id === item.id && i.variation === item.variation
    );

    if (existing) {
      setGroup(
        group.map((i) =>
          i.id === item.id && i.variation === item.variation
            ? { ...i, qty: i.qty + item.qty }
            : i
        )
      );
    } else {
      setGroup([...group, { ...item, isVoid: false, isDiscount: false }]);
    }
  };

  // --- Remove by ID (hard delete) ---
  const removeItem = (id: number, type: "meal" | "product") => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;
    setGroup(group.filter((i) => i.id !== id));
  };

  // --- Clear All ---
  const clearOrder = () => {
    setMeals([]);
    setProducts([]);
  };

  // --- Get Meal Details ---
  const getMealDetails = (meal: Meal): Product[] => {
    return meal.product_ids
      .map((id) => menuData.products.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  };

  const getProduct = (id: number) => menuData.products.find((p) => p.id === id);

  // --- Toggle void flag ---
  const toggleVoid = (id: number, type: "meal" | "product") => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;
    setGroup(group.map((i) => (i.id === id ? { ...i, isVoid: !i.isVoid } : i)));
  };

  // --- Update qty (min 1) ---
  const updateQty = (id: number, type: "meal" | "product", qty: number) => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;
    setGroup(
      group.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  // --- Apply discount (PWD/SC) ---
  const applyDiscount = (
    id: number,
    type: "meal" | "product",
    discountType: "pwd" | "sc"
  ) => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;

    setGroup(
      group.map((i) => {
        if (i.id !== id) return i;

        // Discount is 20% less VAT (12%)
        const basePrice = i.price * i.qty;
        const discounted = (basePrice * 0.8) / 1.12; // 20% off less 12% VAT
        const discountAmount = basePrice - discounted;

        return {
          ...i,
          isDiscount: true,
          discount_type: discountType,
          percentDiscount: 20,
          itemTotalDiscount: discountAmount,
        };
      })
    );
  };

  // --- Totals calculation ---
  const { subTotal, totalDiscount, grandTotal } = useMemo(() => {
    const allItems = [...meals, ...products];

    const validItems = allItems.filter((i) => !i.isVoid);

    const subTotal = validItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    const totalDiscount = validItems.reduce(
      (sum, i) => sum + (i.itemTotalDiscount ?? 0),
      0
    );

    const grandTotal = subTotal - totalDiscount;

    return { subTotal, totalDiscount, grandTotal };
  }, [meals, products]);

  return (
    <FoodOrderContext.Provider
      value={{
        meals,
        products,
        addItem,
        removeItem,
        clearOrder,
        getMealDetails,
        getProduct,
        toggleVoid,
        updateQty,
        applyDiscount,
        subTotal,
        totalDiscount,
        grandTotal,
      }}
    >
      {children}
    </FoodOrderContext.Provider>
  );
};

export const useFoodOrder = () => {
  const ctx = useContext(FoodOrderContext);
  if (!ctx)
    throw new Error("useFoodOrder must be used within FoodOrderProvider");
  return ctx;
};
