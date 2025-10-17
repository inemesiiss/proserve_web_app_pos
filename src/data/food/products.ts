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
  meals: Meal[];
  upgrades: Upgrades;
}

export const menuData: MenuData = {
  products: [
    {
      id: 1,
      name: "1pc Chicken",
      category: "Chickens",
      price: 89.0,
      type: "main",
      image: "/food/food/chicken.png",
    },
    {
      id: 2,
      name: "2pc Chicken",
      category: "Chickens",
      price: 149.0,
      type: "main",
      image: "/food/food/chicken.png",
    },
    {
      id: 3,
      name: "Spaghetti",
      category: "Pasta",
      price: 55.0,
      type: "side",
      image: "/food/food/spag.png",
    },
    {
      id: 4,
      name: "Steamed Rice",
      category: "Sides",
      price: 25.0,
      type: "side",
      image: "/food/food/steamed.png",
    },
    {
      id: 5,
      name: "Regular Fries",
      category: "Fries",
      price: 45.0,
      type: "side",
      image: "/food/food/fries.png",
      upgradable: true,
    },
    {
      id: 6,
      name: "Medium Fries",
      category: "Fries",
      price: 60.0,
      type: "side",
      image: "/food/food/fries.png",
    },
    {
      id: 7,
      name: "Large Fries",
      category: "Fries",
      price: 75.0,
      type: "side",
      image: "/food/food/fries.png",
    },
    {
      id: 8,
      name: "Regular Drink",
      category: "Beverages",
      price: 35.0,
      type: "Beverages",
      image: "/food/food/drinks.png",
      upgradable: true,
    },
    {
      id: 9,
      name: "Medium Drink",
      category: "Beverages",
      price: 45.0,
      type: "drink",
      image: "/food/food/drinksmed.png",
    },
    {
      id: 10,
      name: "Large Drink",
      category: "Beverages",
      price: 55.0,
      type: "drink",
      image: "/food/food/drinkslrg.png",
    },
    {
      id: 11,
      name: "Regular Burger",
      category: "Burgers",
      price: 59.0,
      type: "main",
      image: "/food/food/burger.png",
    },
    {
      id: 12,
      name: "Cheeseburger",
      category: "Burgers",
      price: 79.0,
      type: "main",
      image: "/food/food/cburger.png",
    },
    {
      id: 13,
      name: "Quarter Pounder",
      category: "Burgers",
      price: 149.0,
      type: "main",
      image: "/food/food/quarter.png",
    },
    {
      id: 14,
      category: "Chickens",
      name: "6pcs Chicken Bucket",
      price: 450.0,
      type: "main",
      image: "/food/food/6siken.png",
    },

    {
      id: 15,
      category: "Chickens",
      name: "8pcs Chicken Bucket",
      price: 600.0,
      type: "main",
      image: "/food/food/8siken.png",
    },
  ],

  meals: [
    {
      id: 1,
      category: "Chickens",
      name: "1pc Chicken with Rice & Drink",
      product_ids: [1, 4, 8],
      base_price: 129.0,
      image: "/food/food/1pcmeal.png",
    },
    {
      id: 2,
      category: "Chickens",
      name: "2pc Chicken with Rice & Drink",
      product_ids: [2, 4, 8],
      base_price: 189.0,
      image: "/food/food/2pcmeal.png",
    },
    {
      id: 3,
      category: "Chickens",
      name: "1pc Chicken with Spaghetti & Drink",
      product_ids: [1, 3, 8],
      base_price: 139.0,
      image: "/food/food/sikenspag.png",
    },
    {
      id: 4,
      category: "Burgers",
      name: "Regular Burger Meal",
      product_ids: [11, 5, 8],
      base_price: 119.0,
      image: "/food/food/rburgermeal.png",
    },
    {
      id: 5,
      category: "Burgers",
      name: "Cheeseburger Meal",
      product_ids: [12, 5, 8],
      base_price: 139.0,
      image: "/food/food/cburgermeal.png",
    },
    {
      id: 6,
      category: "Burgers",
      name: "Quarter Pounder Meal",
      product_ids: [13, 5, 8],
      base_price: 189.0,
      image: "/food/food/quartermeal.png",
    },
  ],

  upgrades: {
    drinks: [
      { from_product_id: 8, to_product_id: 9, additional_price: 10 },
      { from_product_id: 8, to_product_id: 10, additional_price: 20 },
    ],
    fries: [
      { from_product_id: 5, to_product_id: 6, additional_price: 15 },
      { from_product_id: 5, to_product_id: 7, additional_price: 30 },
    ],
  },
};
