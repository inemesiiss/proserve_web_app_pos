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
  discount_type?: "pwd" | "sc" | "manual" | "percentage";
  discount_note?: string;

  // --- Customization details for meals with variances ---
  customization?: {
    type: string;
    label: string;
    selected:
      | {
          id: string;
          name: string;
          price: number;
          isDefault?: boolean;
        }
      | undefined;
  }[];

  // --- Upgrade tracking ---
  upgrades?: {
    drinkUpgrade?: {
      originalId: number;
      upgradedId: number;
      addedPrice: number;
    };
    friesUpgrade?: {
      originalId: number;
      upgradedId: number;
      addedPrice: number;
    };
  };
  basePrice?: number; // Original price before upgrades
  mealProductIds?: number[]; // For meal items, track component product IDs
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
  orderTotalDiscount: number;
  grandTotal: number;

  // --- Order Total Discount ---
  applyOrderTotalDiscount: (discountData: {
    discountCategory: "voucher" | "sc-pwd" | "manual";
    type: "percentage" | "fixed";
    value: number;
    code?: string;
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    note: string;
  }) => void;
  removeOrderTotalDiscount: () => void;
  orderTotalDiscountInfo: {
    discountCategory: "voucher" | "sc-pwd" | "manual";
    type: "percentage" | "fixed";
    value: number;
    code?: string;
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    note: string;
  } | null;

  // --- Update helpers ---
  toggleVoid: (id: number, type: "meal" | "product") => void;
  updateQty: (id: number, type: "meal" | "product", qty: number) => void;
  applyDiscount: (
    id: number,
    type: "meal" | "product",
    discountType: "pwd" | "sc" | "manual" | "percentage",
    value?: number,
    note?: string
  ) => void;

  // --- Upgrade helpers ---
  upgradeDrink: (
    id: number,
    type: "meal" | "product",
    toProductId: number
  ) => void;
  upgradeFries: (
    id: number,
    type: "meal" | "product",
    toProductId: number
  ) => void;
  getAvailableUpgrades: (item: OrderItem) => {
    drinks: {
      productId: number;
      name: string;
      price: number;
      additionalPrice: number;
    }[];
    fries: {
      productId: number;
      name: string;
      price: number;
      additionalPrice: number;
    }[];
  };
}

const FoodOrderContext = createContext<FoodOrderContextType | undefined>(
  undefined
);

export const FoodOrderProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<OrderItem[]>([]);
  const [orderTotalDiscountInfo, setOrderTotalDiscountInfo] = useState<{
    discountCategory: "voucher" | "sc-pwd" | "manual";
    type: "percentage" | "fixed";
    value: number;
    code?: string;
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    note: string;
  } | null>(null);

  // --- Core Add Function ---
  const addItem = (item: OrderItem) => {
    const setGroup = item.type === "meal" ? setMeals : setProducts;
    const group = item.type === "meal" ? meals : products;

    // Always create a new instance - no automatic stacking
    // User can adjust qty manually with +/- buttons
    setGroup([...group, { ...item, isVoid: false, isDiscount: false }]);
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
    setOrderTotalDiscountInfo(null);
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

  // --- Apply discount (PWD/SC/Manual) ---
  const applyDiscount = (
    id: number,
    type: "meal" | "product",
    discountType: "pwd" | "sc" | "manual" | "percentage",
    value?: number,
    note?: string
  ) => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;

    setGroup(
      group.map((i) => {
        if (i.id !== id) return i;

        const basePrice = i.price * i.qty;
        let discountAmount = 0;
        let percentDiscount = 0;

        if (discountType === "pwd" || discountType === "sc") {
          // Discount is 20% less VAT (12%)
          const discounted = (basePrice * 0.8) / 1.12; // 20% off less 12% VAT
          discountAmount = basePrice - discounted;
          percentDiscount = 20;
        } else if (discountType === "percentage" && value) {
          // Manual percentage discount
          percentDiscount = value;
          discountAmount = (basePrice * value) / 100;
        } else if (discountType === "manual" && value) {
          // Manual fixed amount discount
          discountAmount = value;
          percentDiscount = (value / basePrice) * 100;
        }

        return {
          ...i,
          isDiscount: true,
          discount_type: discountType,
          percentDiscount: percentDiscount,
          itemTotalDiscount: discountAmount,
          discount_note: note,
        };
      })
    );
  };

  // --- Apply order total discount ---
  const applyOrderTotalDiscount = (discountData: {
    discountCategory: "voucher" | "sc-pwd" | "manual";
    type: "percentage" | "fixed";
    value: number;
    code?: string;
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    note: string;
  }) => {
    setOrderTotalDiscountInfo(discountData);
  };

  // --- Remove order total discount ---
  const removeOrderTotalDiscount = () => {
    setOrderTotalDiscountInfo(null);
  };

  // --- Get available upgrades for an item ---
  const getAvailableUpgrades = (item: OrderItem) => {
    const result = { drinks: [] as any[], fries: [] as any[] };

    // For meals, check if they contain regular drinks or fries
    if (item.type === "meal" && item.mealProductIds) {
      const hasRegularDrink = item.mealProductIds.includes(8); // Regular Drink ID
      const hasRegularFries = item.mealProductIds.includes(5); // Regular Fries ID

      if (hasRegularDrink || item.upgrades?.drinkUpgrade) {
        menuData.upgrades.drinks.forEach((upgrade) => {
          const product = menuData.products.find(
            (p) => p.id === upgrade.to_product_id
          );
          if (product) {
            result.drinks.push({
              productId: product.id,
              name: product.name,
              price: product.price,
              additionalPrice: upgrade.additional_price,
            });
          }
        });
      }

      if (hasRegularFries || item.upgrades?.friesUpgrade) {
        menuData.upgrades.fries.forEach((upgrade) => {
          const product = menuData.products.find(
            (p) => p.id === upgrade.to_product_id
          );
          if (product) {
            result.fries.push({
              productId: product.id,
              name: product.name,
              price: product.price,
              additionalPrice: upgrade.additional_price,
            });
          }
        });
      }
    }

    // For individual products
    if (item.type === "product") {
      if (item.id === 8) {
        // Regular Drink
        menuData.upgrades.drinks.forEach((upgrade) => {
          const product = menuData.products.find(
            (p) => p.id === upgrade.to_product_id
          );
          if (product) {
            result.drinks.push({
              productId: product.id,
              name: product.name,
              price: product.price,
              additionalPrice: upgrade.additional_price,
            });
          }
        });
      }
      if (item.id === 5) {
        // Regular Fries
        menuData.upgrades.fries.forEach((upgrade) => {
          const product = menuData.products.find(
            (p) => p.id === upgrade.to_product_id
          );
          if (product) {
            result.fries.push({
              productId: product.id,
              name: product.name,
              price: product.price,
              additionalPrice: upgrade.additional_price,
            });
          }
        });
      }
    }

    return result;
  };

  // --- Upgrade drink ---
  const upgradeDrink = (
    id: number,
    type: "meal" | "product",
    toProductId: number
  ) => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;

    setGroup(
      group.map((item) => {
        if (item.id !== id) return item;

        const upgrade = menuData.upgrades.drinks.find(
          (u) => u.to_product_id === toProductId
        );
        if (!upgrade) return item;

        const newProduct = menuData.products.find((p) => p.id === toProductId);
        if (!newProduct) return item;

        // Store base price on first upgrade
        const basePrice = item.basePrice ?? item.price;

        // Calculate new price
        let newPrice = basePrice;

        // Remove old drink upgrade price if exists
        if (item.upgrades?.drinkUpgrade) {
          newPrice -= item.upgrades.drinkUpgrade.addedPrice;
        }

        // Add new upgrade price
        newPrice += upgrade.additional_price;

        return {
          ...item,
          basePrice,
          price: newPrice,
          upgrades: {
            ...item.upgrades,
            drinkUpgrade: {
              originalId: 8,
              upgradedId: toProductId,
              addedPrice: upgrade.additional_price,
            },
          },
        };
      })
    );
  };

  // --- Upgrade fries ---
  const upgradeFries = (
    id: number,
    type: "meal" | "product",
    toProductId: number
  ) => {
    const setGroup = type === "meal" ? setMeals : setProducts;
    const group = type === "meal" ? meals : products;

    setGroup(
      group.map((item) => {
        if (item.id !== id) return item;

        const upgrade = menuData.upgrades.fries.find(
          (u) => u.to_product_id === toProductId
        );
        if (!upgrade) return item;

        const newProduct = menuData.products.find((p) => p.id === toProductId);
        if (!newProduct) return item;

        // Store base price on first upgrade
        const basePrice = item.basePrice ?? item.price;

        // Calculate new price
        let newPrice = basePrice;

        // Remove old fries upgrade price if exists
        if (item.upgrades?.friesUpgrade) {
          newPrice -= item.upgrades.friesUpgrade.addedPrice;
        }

        // Add new upgrade price
        newPrice += upgrade.additional_price;

        return {
          ...item,
          basePrice,
          price: newPrice,
          upgrades: {
            ...item.upgrades,
            friesUpgrade: {
              originalId: 5,
              upgradedId: toProductId,
              addedPrice: upgrade.additional_price,
            },
          },
        };
      })
    );
  };

  // --- Totals calculation ---
  const { subTotal, totalDiscount, orderTotalDiscount, grandTotal } =
    useMemo(() => {
      const allItems = [...meals, ...products];

      const validItems = allItems.filter((i) => !i.isVoid);

      const subTotal = validItems.reduce((sum, i) => sum + i.price * i.qty, 0);

      const totalDiscount = validItems.reduce(
        (sum, i) => sum + (i.itemTotalDiscount ?? 0),
        0
      );

      // Calculate order total discount on the subtotal after item discounts
      const afterItemDiscounts = subTotal - totalDiscount;
      let orderTotalDiscount = 0;

      if (orderTotalDiscountInfo && afterItemDiscounts > 0) {
        if (orderTotalDiscountInfo.type === "percentage") {
          orderTotalDiscount =
            (afterItemDiscounts * orderTotalDiscountInfo.value) / 100;
        } else {
          orderTotalDiscount = Math.min(
            orderTotalDiscountInfo.value,
            afterItemDiscounts
          );
        }
      }

      const grandTotal = afterItemDiscounts - orderTotalDiscount;

      return { subTotal, totalDiscount, orderTotalDiscount, grandTotal };
    }, [meals, products, orderTotalDiscountInfo]);

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
        applyOrderTotalDiscount,
        removeOrderTotalDiscount,
        orderTotalDiscountInfo,
        upgradeDrink,
        upgradeFries,
        getAvailableUpgrades,
        subTotal,
        totalDiscount,
        orderTotalDiscount,
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
