// src/data/menuData.ts

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  type: string;
  image: string;
  upgradable?: boolean;
}

export interface Meal {
  id: number;
  category: string;
  name: string;
  product_ids: number[];
  base_price: number;
  image: string;
}

export interface UpgradeOption {
  from_product_id: number;
  to_product_id: number;
  additional_price: number;
}

export interface Upgrades {
  drinks: UpgradeOption[];
  fries: UpgradeOption[];
}

export interface MenuData {
  products: Product[];
}

export const menuData: MenuData = {
  products: [
    {
      id: 1,
      name: "Children Ticket",
      category: "Children",
      price: 300.0,
      type: "main",
      image: "/indoor/child.png",
    },
    {
      id: 2,
      name: "Adult Ticket",
      category: "Children",
      price: 150.0,
      type: "main",
      image: "/indoor/adult.png",
    },
  ],
};
