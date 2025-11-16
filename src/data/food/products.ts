// src/data/menuData.ts

export interface Product {
  id: number;
  name: string;
  nickname: string;
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
  nickname: string;
  product_ids: number[];
  base_price: number;
  image: string;
  variances?: {
    type: "drink" | "fries" | "side";
    label: string;
    options: {
      id: string;
      name: string;
      price: number;
      isDefault?: boolean;
    }[];
  }[];
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
      nickname: "1PC CHX",
      category: "Chickens",
      price: 89.0,
      type: "main",
      image: "/food/food/chicken.png",
    },
    {
      id: 2,
      name: "2pc Chicken",
      nickname: "2PC CHX",
      category: "Chickens",
      price: 149.0,
      type: "main",
      image: "/food/food/chicken.png",
    },
    {
      id: 3,
      name: "Spaghetti",
      nickname: "SPAG",
      category: "Pasta",
      price: 55.0,
      type: "side",
      image: "/food/food/spag.png",
    },
    {
      id: 4,
      name: "Steamed Rice",
      nickname: "RICE",
      category: "Sides",
      price: 25.0,
      type: "side",
      image: "/food/food/steamed.png",
    },
    {
      id: 5,
      name: "Regular Fries",
      nickname: "REG FRIES",
      category: "Fries",
      price: 45.0,
      type: "side",
      image: "/food/food/fries.png",
      upgradable: true,
    },
    {
      id: 6,
      name: "Medium Fries",
      nickname: "MED FRIES",
      category: "Fries",
      price: 60.0,
      type: "side",
      image: "/food/food/fries.png",
    },
    {
      id: 7,
      name: "Large Fries",
      nickname: "LRG FRIES",
      category: "Fries",
      price: 75.0,
      type: "side",
      image: "/food/food/fries.png",
    },
    {
      id: 8,
      name: "Regular Drink",
      nickname: "REG DRINK",
      category: "Beverages",
      price: 35.0,
      type: "Beverages",
      image: "/food/food/drinks.png",
      upgradable: true,
    },
    {
      id: 9,
      name: "Medium Drink",
      nickname: "MED DRINK",
      category: "Beverages",
      price: 45.0,
      type: "drink",
      image: "/food/food/drinksmed.png",
    },
    {
      id: 10,
      name: "Large Drink",
      nickname: "LRG DRINK",
      category: "Beverages",
      price: 55.0,
      type: "drink",
      image: "/food/food/drinkslrg.png",
    },
    {
      id: 11,
      name: "Regular Burger",
      nickname: "REG BRGR",
      category: "Burgers",
      price: 59.0,
      type: "main",
      image: "/food/food/burger.png",
    },
    {
      id: 12,
      name: "Cheeseburger",
      nickname: "CHZBRGR",
      category: "Burgers",
      price: 79.0,
      type: "main",
      image: "/food/food/cburger.png",
    },
    {
      id: 13,
      name: "Quarter Pounder",
      nickname: "QRTR PNDR",
      category: "Burgers",
      price: 149.0,
      type: "main",
      image: "/food/food/quarter.png",
    },
    {
      id: 14,
      category: "Chickens",
      name: "6pcs Chicken Bucket",
      nickname: "6PC BCKT",
      price: 450.0,
      type: "main",
      image: "/food/food/6siken.png",
    },

    {
      id: 15,
      category: "Chickens",
      name: "8pcs Chicken Bucket",
      nickname: "8PC BCKT",
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
      nickname: "1PC MEAL",
      product_ids: [1, 4, 8],
      base_price: 129.0,
      image: "/food/food/1pcmeal.png",
      variances: [
        {
          type: "drink",
          label: "Choose Your Drink",
          options: [
            {
              id: "drink-icedtea-regular",
              name: "Iced Tea (Regular)",
              price: 0,
              isDefault: true,
            },
            {
              id: "drink-icedtea-medium",
              name: "Iced Tea (Medium)",
              price: 10,
            },
            { id: "drink-icedtea-large", name: "Iced Tea (Large)", price: 20 },
            {
              id: "drink-pineapple-regular",
              name: "Pineapple Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-pineapple-medium",
              name: "Pineapple Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-pineapple-large",
              name: "Pineapple Juice (Large)",
              price: 25,
            },
            {
              id: "drink-orange-regular",
              name: "Orange Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-orange-medium",
              name: "Orange Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-orange-large",
              name: "Orange Juice (Large)",
              price: 25,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      category: "Chickens",
      name: "2pc Chicken with Rice & Drink",
      nickname: "2PC MEAL",
      product_ids: [2, 4, 8],
      base_price: 189.0,
      image: "/food/food/2pcmeal.png",
      variances: [
        {
          type: "drink",
          label: "Choose Your Drink",
          options: [
            {
              id: "drink-icedtea-regular",
              name: "Iced Tea (Regular)",
              price: 0,
              isDefault: true,
            },
            {
              id: "drink-icedtea-medium",
              name: "Iced Tea (Medium)",
              price: 10,
            },
            { id: "drink-icedtea-large", name: "Iced Tea (Large)", price: 20 },
            {
              id: "drink-pineapple-regular",
              name: "Pineapple Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-pineapple-medium",
              name: "Pineapple Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-pineapple-large",
              name: "Pineapple Juice (Large)",
              price: 25,
            },
            {
              id: "drink-orange-regular",
              name: "Orange Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-orange-medium",
              name: "Orange Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-orange-large",
              name: "Orange Juice (Large)",
              price: 25,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      category: "Chickens",
      name: "1pc Chicken with Spaghetti & Drink",
      nickname: "CHX SPAG",
      product_ids: [1, 3, 8],
      base_price: 139.0,
      image: "/food/food/sikenspag.png",
      variances: [
        {
          type: "drink",
          label: "Choose Drink",
          options: [
            {
              id: "drink-icedtea-regular",
              name: "Iced Tea (Regular)",
              price: 0,
              isDefault: true,
            },
            {
              id: "drink-icedtea-medium",
              name: "Iced Tea (Medium)",
              price: 10,
            },
            { id: "drink-icedtea-large", name: "Iced Tea (Large)", price: 20 },
            {
              id: "drink-pineapple-regular",
              name: "Pineapple Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-pineapple-medium",
              name: "Pineapple Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-pineapple-large",
              name: "Pineapple Juice (Large)",
              price: 25,
            },
            {
              id: "drink-orange-regular",
              name: "Orange Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-orange-medium",
              name: "Orange Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-orange-large",
              name: "Orange Juice (Large)",
              price: 25,
            },
          ],
        },
      ],
    },
    {
      id: 4,
      category: "Burgers",
      name: "Regular Burger Meal",
      nickname: "REG MEAL",
      product_ids: [11, 5, 8],
      base_price: 119.0,
      image: "/food/food/rburgermeal.png",
      variances: [
        {
          type: "drink",
          label: "Choose Your Drink",
          options: [
            {
              id: "drink-icedtea-regular",
              name: "Iced Tea (Regular)",
              price: 0,
              isDefault: true,
            },
            {
              id: "drink-icedtea-medium",
              name: "Iced Tea (Medium)",
              price: 10,
            },
            { id: "drink-icedtea-large", name: "Iced Tea (Large)", price: 20 },
            {
              id: "drink-pineapple-regular",
              name: "Pineapple Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-pineapple-medium",
              name: "Pineapple Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-pineapple-large",
              name: "Pineapple Juice (Large)",
              price: 25,
            },
            {
              id: "drink-orange-regular",
              name: "Orange Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-orange-medium",
              name: "Orange Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-orange-large",
              name: "Orange Juice (Large)",
              price: 25,
            },
          ],
        },
        {
          type: "fries",
          label: "Choose Your Fries",
          options: [
            {
              id: "fries-regular",
              name: "Regular Fries",
              price: 0,
              isDefault: true,
            },
            { id: "fries-cheese", name: "Cheese Fries", price: 20 },
            { id: "fries-bbq", name: "BBQ Fries", price: 20 },
            { id: "fries-sourcream", name: "Sour Cream Fries", price: 20 },
            {
              id: "fries-cheese-large",
              name: "Cheese Fries (Large)",
              price: 40,
            },
            { id: "fries-bbq-large", name: "BBQ Fries (Large)", price: 40 },
            {
              id: "fries-sourcream-large",
              name: "Sour Cream Fries (Large)",
              price: 40,
            },
          ],
        },
      ],
    },
    {
      id: 5,
      category: "Burgers",
      name: "Cheeseburger Meal",
      nickname: "CHZ MEAL",
      product_ids: [12, 5, 8],
      base_price: 139.0,
      image: "/food/food/cburgermeal.png",
      variances: [
        {
          type: "drink",
          label: "Choose Your Drink",
          options: [
            {
              id: "drink-icedtea-regular",
              name: "Iced Tea (Regular)",
              price: 0,
              isDefault: true,
            },
            {
              id: "drink-icedtea-medium",
              name: "Iced Tea (Medium)",
              price: 10,
            },
            { id: "drink-icedtea-large", name: "Iced Tea (Large)", price: 20 },
            {
              id: "drink-pineapple-regular",
              name: "Pineapple Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-pineapple-medium",
              name: "Pineapple Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-pineapple-large",
              name: "Pineapple Juice (Large)",
              price: 25,
            },
            {
              id: "drink-orange-regular",
              name: "Orange Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-orange-medium",
              name: "Orange Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-orange-large",
              name: "Orange Juice (Large)",
              price: 25,
            },
          ],
        },
        {
          type: "fries",
          label: "Choose Your Fries",
          options: [
            {
              id: "fries-regular",
              name: "Regular Fries",
              price: 0,
              isDefault: true,
            },
            { id: "fries-cheese", name: "Cheese Fries", price: 20 },
            { id: "fries-bbq", name: "BBQ Fries", price: 20 },
            { id: "fries-sourcream", name: "Sour Cream Fries", price: 20 },
            {
              id: "fries-cheese-large",
              name: "Cheese Fries (Large)",
              price: 40,
            },
            { id: "fries-bbq-large", name: "BBQ Fries (Large)", price: 40 },
            {
              id: "fries-sourcream-large",
              name: "Sour Cream Fries (Large)",
              price: 40,
            },
          ],
        },
      ],
    },
    {
      id: 6,
      category: "Burgers",
      name: "Quarter Pounder Meal",
      nickname: "QRTR MEAL",
      product_ids: [13, 5, 8],
      base_price: 189.0,
      image: "/food/food/quartermeal.png",
      variances: [
        {
          type: "drink",
          label: "Choose Your Drink",
          options: [
            {
              id: "drink-icedtea-regular",
              name: "Iced Tea (Regular)",
              price: 0,
              isDefault: true,
            },
            {
              id: "drink-icedtea-medium",
              name: "Iced Tea (Medium)",
              price: 10,
            },
            { id: "drink-icedtea-large", name: "Iced Tea (Large)", price: 20 },
            {
              id: "drink-pineapple-regular",
              name: "Pineapple Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-pineapple-medium",
              name: "Pineapple Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-pineapple-large",
              name: "Pineapple Juice (Large)",
              price: 25,
            },
            {
              id: "drink-orange-regular",
              name: "Orange Juice (Regular)",
              price: 5,
            },
            {
              id: "drink-orange-medium",
              name: "Orange Juice (Medium)",
              price: 15,
            },
            {
              id: "drink-orange-large",
              name: "Orange Juice (Large)",
              price: 25,
            },
          ],
        },
        {
          type: "fries",
          label: "Choose Your Fries",
          options: [
            {
              id: "fries-regular",
              name: "Regular Fries",
              price: 0,
              isDefault: true,
            },
            { id: "fries-cheese", name: "Cheese Fries", price: 20 },
            { id: "fries-bbq", name: "BBQ Fries", price: 20 },
            { id: "fries-sourcream", name: "Sour Cream Fries", price: 20 },
            {
              id: "fries-cheese-large",
              name: "Cheese Fries (Large)",
              price: 40,
            },
            { id: "fries-bbq-large", name: "BBQ Fries (Large)", price: 40 },
            {
              id: "fries-sourcream-large",
              name: "Sour Cream Fries (Large)",
              price: 40,
            },
          ],
        },
      ],
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
