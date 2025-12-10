"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import Header from "@/components/food/components/cashier/Header";
import FoodSidebarNav from "@/components/food/components/cashier/SideBarNav";
import MealCustomizationModal from "@/components/food/modals/MealCustomizationModal";
import { Search, Loader2 } from "lucide-react";
import { useGetBranchProductsQuery } from "@/store/api/Transaction";
import type { CategorizedProduct, Product } from "@/types/transaction";
import { formatCurrency } from "@/function/reusables/reuseables";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "http://localhost:8006";

// Helper function to build complete image URL
const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return "/static/placeholder.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_DOMAIN}${imagePath}`;
};

export default function FoodTransactionPage() {
  const { addItem } = useFoodOrder();
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] =
    useState<CategorizedProduct | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get branch ID from route params or context - adjust based on your setup
  const branchId = 1; // TODO: Get from route params or user context

  // ✅ Fetch products from API
  const {
    data: apiProducts = [],
    isLoading,
    error,
  } = useGetBranchProductsQuery(branchId);

  // ✅ Filter logic with search
  const filteredProducts = useMemo(() => {
    let products = apiProducts;

    // Filter by category if not "All"
    if (filteredCategory !== "All") {
      products = products.filter(
        (cp) => cp.wrapper.product.prod_categ.toString() === filteredCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (cp) =>
          cp.wrapper.product.prod_name.toLowerCase().includes(query) ||
          cp.wrapper.product.prod_code.toLowerCase().includes(query)
      );
    }

    return products;
  }, [apiProducts, filteredCategory, searchQuery]);

  // ✅ Separate products by type for organized rendering
  const { individuals, individualsWithVariance, bundles, bundlesWithVariance } =
    useMemo(() => {
      return {
        individuals: filteredProducts.filter((p) => p.type === "individual"),
        individualsWithVariance: filteredProducts.filter(
          (p) => p.type === "individual-variance"
        ),
        bundles: filteredProducts.filter((p) => p.type === "bundle"),
        bundlesWithVariance: filteredProducts.filter(
          (p) => p.type === "bundle-variance"
        ),
      };
    }, [filteredProducts]);

  // ✅ Handle add to cart - check if product has variance
  const handleAdd = (product: CategorizedProduct) => {
    // If product has variance/compositions, show customization modal
    if (
      product.hasVariance &&
      product.wrapper.product.compositions.length > 0
    ) {
      setSelectedProduct(product);
      setShowCustomizationModal(true);
    } else {
      // Add directly to cart if no customization needed
      addDirectToCart(product.wrapper.product);
    }
  };

  // ✅ Add item directly to cart without customization
  const addDirectToCart = (product: Product) => {
    const price =
      product.base_price !== null && product.base_price !== undefined
        ? product.base_price
        : 0;
    addItem({
      id: product.id,
      name: product.prod_name,
      qty: 1,
      price,
      image: product.image || "/static/placeholder.png",
      type: product.p_type === 2 ? "meal" : "product",
      category: product.prod_categ.toString(),
    });
  };

  // ✅ Handle customization confirmation from modal
  const handleCustomizationConfirm = (customization: any) => {
    if (selectedProduct) {
      const product = selectedProduct.wrapper.product;
      // Calculate total price with selected variants
      const basePriceValue =
        product.base_price !== null && product.base_price !== undefined
          ? product.base_price
          : 0;

      // Ensure totalPrice is a number
      let totalPrice = basePriceValue;
      if (
        customization.totalPrice !== null &&
        customization.totalPrice !== undefined
      ) {
        totalPrice =
          typeof customization.totalPrice === "string"
            ? parseFloat(customization.totalPrice)
            : customization.totalPrice;
      }

      addItem({
        id: product.id,
        name: product.prod_name,
        qty: 1,
        price: Number(totalPrice),
        image: product.image || "/static/placeholder.png",
        type: product.p_type === 2 ? "meal" : "product",
        category: product.prod_categ.toString(),
        customization: customization.customizationDetails,
      });

      setShowCustomizationModal(false);
      setSelectedProduct(null);
    }
  };

  // Get category header text
  const getCategoryHeader = () => {
    if (filteredCategory === "All") return "Choose your Items";
    return `Choose your Category ${filteredCategory}`;
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-600">
          <p className="text-lg font-semibold">Failed to load menu</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 🧭 Sidebar Navigation */}
      <FoodSidebarNav onFilter={setFilteredCategory} />

      {/* 🍔 Main Content */}
      <motion.div
        className="flex-1 ml-[150px] w-full max-w-7xl mx-auto p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Header
          headerText="🍔 Food Menu"
          to="/food/main"
          showSettings={true}
          showBreak={true}
          showCashFund={true}
        />

        {/* 🔍 Search Bar (Floating Top Right) & Category Header (Top Left) - STICKY */}
        <div className="sticky top-[10px] z-40 bg-gray-50 pb-4 pt-5 -mx-6 px-6 mb-6">
          <div className="relative">
            {/* Category Header - Top Left */}
            <h1 className="text-2xl font-bold text-gray-800">
              {getCategoryHeader()}
            </h1>

            {/* Search Bar - Floating Top Right */}
            <div className="absolute top-0 right-0 w-80">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==== 🥡 COMBINED SECTION (when All is selected) ==== */}
        {filteredCategory === "All" ? (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Render all products (individuals, bundles, and variants) */}
              {filteredProducts.map((categorized, index) => {
                const product = categorized.wrapper.product;
                const price = Number(categorized.basePrice) || 0;
                const displayName = product.prod_code;
                const buttonLabel =
                  product.p_type === 2 ? "Add Meal" : "Add Item";
                const imageUrl = getImageUrl(product.image);

                return (
                  <motion.div
                    key={`product-${product.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <img
                      src={imageUrl}
                      alt={displayName}
                      className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/static/placeholder.png";
                      }}
                    />
                    <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                      <div className="text-sm font-bold text-gray-800 text-center">
                        {displayName}
                      </div>
                      {/* <div className="text-xs text-gray-600 text-center">
                        {product.prod_name}
                      </div> */}
                      <div className="text-sm text-gray-700 font-semibold">
                        {formatCurrency(price)}
                      </div>
                      {categorized.hasVariance && (
                        <div className="text-xs text-blue-600 font-medium">
                          Customizable
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAdd(categorized)}
                      className="w-full bg-green-600 text-white hover:bg-green-700 h-8 text-xs mt-auto"
                    >
                      {buttonLabel}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : (
          /* ==== 🥡 SEPARATED SECTIONS (when specific category is selected) ==== */
          <>
            {/* Individual Products Section */}
            {individuals.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  Items (Simple)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {individuals.map((categorized, index) => {
                    const product = categorized.wrapper.product;
                    const price = Number(categorized.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`individual-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.prod_code}
                          className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/static/placeholder.png";
                          }}
                        />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_code}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {product.prod_name}
                          </div>
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(categorized)}
                          className="w-full bg-green-600 text-white hover:bg-green-700 h-8 text-xs mt-auto"
                        >
                          Add Item
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Individual Products with Variance Section */}
            {individualsWithVariance.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  Items (Customizable)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {individualsWithVariance.map((categorized, index) => {
                    const product = categorized.wrapper.product;
                    const price = Number(categorized.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`individual-var-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px] border-2 border-blue-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.prod_code}
                          className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/static/placeholder.png";
                          }}
                        />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_code}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {product.prod_name}
                          </div>
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            ✓ Customizable
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(categorized)}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs mt-auto"
                        >
                          Customize
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Bundle Products Section */}
            {bundles.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  Meals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {bundles.map((categorized, index) => {
                    const product = categorized.wrapper.product;
                    const price = Number(categorized.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`bundle-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.prod_code}
                          className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/static/placeholder.png";
                          }}
                        />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_code}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {product.prod_name}
                          </div>
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(categorized)}
                          className="w-full bg-green-600 text-white hover:bg-green-700 h-8 text-xs mt-auto"
                        >
                          Add Meal
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Bundle Products with Variance Section */}
            {bundlesWithVariance.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  Meals (Customizable)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {bundlesWithVariance.map((categorized, index) => {
                    const product = categorized.wrapper.product;
                    const price = Number(categorized.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`bundle-var-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px] border-2 border-purple-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.prod_code}
                          className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/static/placeholder.png";
                          }}
                        />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_code}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {product.prod_name}
                          </div>
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                          <div className="text-xs text-purple-600 font-medium">
                            ✓ Customizable
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(categorized)}
                          className="w-full bg-purple-600 text-white hover:bg-purple-700 h-8 text-xs mt-auto"
                        >
                          Customize Meal
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* 🧃 No results */}
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No items found in <strong>{filteredCategory}</strong>
          </div>
        )}
      </motion.div>

      {/* Meal Customization Modal */}
      {selectedProduct && (
        <MealCustomizationModal
          isOpen={showCustomizationModal}
          onClose={() => {
            setShowCustomizationModal(false);
            setSelectedProduct(null);
          }}
          meal={{
            id: selectedProduct.wrapper.product.id,
            name: selectedProduct.wrapper.product.prod_name,
            base_price:
              selectedProduct.wrapper.product.base_price !== null &&
              selectedProduct.wrapper.product.base_price !== undefined
                ? selectedProduct.wrapper.product.base_price
                : 0,
            image:
              selectedProduct.wrapper.product.image ||
              "/static/placeholder.png",
            category: selectedProduct.wrapper.product.prod_categ.toString(),
            variances: selectedProduct.wrapper.product.compositions.map(
              (comp) => {
                const typeMap: Record<string, "drink" | "fries" | "side"> = {
                  drink: "drink",
                  fries: "fries",
                  side: "side",
                };
                return {
                  compositionId: comp.id, // Add composition ID for independent tracking
                  type: (typeMap[comp.name?.toLowerCase() || "drink"] ||
                    "drink") as "drink" | "fries" | "side",
                  label: comp.name || "Customization",
                  options: [
                    {
                      id: comp.default_prod.id.toString(),
                      name: comp.default_prod.prod_name,
                      calculated_price: 0, // Default has no additional price
                      isDefault: true,
                    },
                    ...comp.variants.map((variant) => ({
                      id: variant.product.id.toString(),
                      name: variant.product.prod_name,
                      calculated_price: parseFloat(variant.calculated_price),
                      isDefault: false,
                    })),
                  ],
                };
              }
            ),
          }}
          onConfirm={handleCustomizationConfirm}
        />
      )}
    </div>
  );
}
