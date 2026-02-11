"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useFoodOrder } from "@/context/food/FoodOrderProvider";
import Header from "@/components/food/components/cashier/Header";
import FoodSidebarNav from "@/components/food/components/cashier/SideBarNav";
import MealCustomizationModal from "@/components/food/modals/MealCustomizationModal";
import SecurityPasscodeModal from "@/components/food/modals/security/SecurityPasscodeModalv2";
import CashFundModal from "@/components/food/components/cashier/CashFundModal";
import OnBreakModal from "@/components/food/components/cashier/OnBreakModal";
import type { CashFundData } from "@/components/food/components/cashier/CashFundModal";
import {
  Search,
  Loader2,
  ScanBarcode,
  Package,
  Receipt,
  X,
  ImageOff,
} from "lucide-react";
import {
  useGetBranchProductsQuery,
  useCreateCashFundMutation,
} from "@/store/api/Transaction";
import { useGetCashierDiscountsQuery } from "@/store/api/Discounts";
import type { CategorizedProduct } from "@/types/transaction";
import { formatCurrency } from "@/function/reusables/reuseables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getCashierSession,
  updateCashierActivity,
  isSessionExpired,
  clearCashierSession,
  isOnBreak,
  updateBreakUntil,
  type CashierSession,
} from "@/utils/cashierSession";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

// Helper function to build complete image URL
const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_DOMAIN}${imagePath}`;
};

// Reusable Product Image component with No Image placeholder
const ProductImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-32 rounded-lg mb-3 shadow-sm bg-gray-200 flex flex-col items-center justify-center">
        <ImageOff size={32} className="text-gray-400 mb-1" />
        <span className="text-xs text-gray-500 font-medium">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm"
      onError={() => setHasError(true)}
    />
  );
};

// Helper function to safely get branch ID from localStorage
const getBranchIdFromStorage = (): number | null => {
  try {
    const branchValue = localStorage.getItem("branch");
    if (branchValue) {
      const branchId = parseInt(branchValue, 10);
      return isNaN(branchId) ? null : branchId;
    }
    return null;
  } catch (error) {
    console.error("Error reading branch from localStorage:", error);
    return null;
  }
};

export default function FoodTransactionPage() {
  const navigate = useNavigate();
  const { addItem, setAvailableDiscounts } = useFoodOrder();

  // Cash fund API mutation
  const [createCashFund] = useCreateCashFundMutation();

  // Get branch ID from localStorage
  const [branchId, setBranchId] = useState<number | null>(null);
  const [isCheckingBranch, setIsCheckingBranch] = useState(true);

  // Fetch discounts when branch ID is available
  const { data: discountsData } = useGetCashierDiscountsQuery(
    { bid: branchId || 0 },
    { skip: !branchId }, // Skip the query if no branchId
  );

  // Update available discounts when data is fetched
  useEffect(() => {
    if (discountsData?.per_item_disc?.pwd_sc) {
      setAvailableDiscounts(discountsData.per_item_disc.pwd_sc);
    }
  }, [discountsData, setAvailableDiscounts]);

  // Cashier session state
  const [cashierSession, setCashierSession] = useState<CashierSession | null>(
    null,
  );
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cash fund modal state - shows when cashier hasn't set their cash fund yet
  const [showCashFundModal, setShowCashFundModal] = useState(false);
  const [requiresCashFund, setRequiresCashFund] = useState(false);

  // Break modal state - shows when cashier is on break
  const [showBreakModal, setShowBreakModal] = useState(false);

  // Listen for break status changes
  useEffect(() => {
    const handleBreakStatusChange = (
      event: CustomEvent<{ isOnBreak: boolean }>,
    ) => {
      setShowBreakModal(event.detail.isOnBreak);
    };

    window.addEventListener(
      "breakStatusChanged",
      handleBreakStatusChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "breakStatusChanged",
        handleBreakStatusChange as EventListener,
      );
    };
  }, []);

  // Check for branch ID and cashier session on mount
  useEffect(() => {
    const storedBranchId = getBranchIdFromStorage();
    if (!storedBranchId) {
      // Redirect to main if no branch ID found
      console.warn(
        "No branch ID found in localStorage, redirecting to /food/main",
      );
      navigate("/food/main", { replace: true });
      return;
    }
    setBranchId(storedBranchId);

    // Check cashier session
    const session = getCashierSession();
    if (session) {
      setCashierSession(session);

      // Check if cashier is currently on break
      if (isOnBreak()) {
        setShowBreakModal(true);
      }

      setIsCheckingBranch(false);
    } else {
      // No valid session, show passcode modal
      setShowPasscodeModal(true);
      setIsCheckingBranch(false);
    }
  }, [navigate]);

  // Activity tracker - update last activity on user interactions
  useEffect(() => {
    const handleActivity = () => {
      if (cashierSession) {
        updateCashierActivity();
      }
    };

    // Track user activity events
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [cashierSession]);

  // WebSocket listener for real-time events
  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL;
    if (!WS_URL) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    ws.onmessage = (event) => {
      console.log("📨 WebSocket Data Received:", event.data);
      toast.success("📨 Real-time update received", {
        duration: 3000,
        position: "top-right",
      });
    };
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      console.log("📨 WebSocket Purchase Updated:", payload);

      if (payload.event === "created") {
        toast.success("🛒 New purchase created!");
        // optionally refetch purchases using payload.id
      } else if (payload.event === "updated") {
        toast.info("🔄 Purchase updated");
      } else if (payload.event === "deleted") {
        toast.error("🗑️ Purchase deleted");
      }
    };
    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Session expiry checker - runs every minute
  useEffect(() => {
    if (!cashierSession) return;

    const checkSessionExpiry = () => {
      if (isSessionExpired()) {
        clearCashierSession();
        setCashierSession(null);
        setShowPasscodeModal(true);
        toast.warning("Session expired due to inactivity", {
          description: "Please enter your passcode to continue",
          duration: 3000,
        });
      }
    };

    // Check immediately and then every minute
    checkSessionExpiry();
    activityCheckIntervalRef.current = setInterval(checkSessionExpiry, 60000);

    return () => {
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
    };
  }, [cashierSession]);

  // Handle successful passcode verification
  const handlePasscodeSuccess = (verifiedUser: any) => {
    setCashierSession({
      cashierId: verifiedUser.branchUserId,
      cashierFullname: verifiedUser.fullName,
    });
    setShowPasscodeModal(false);

    // Priority 1: Check if cashier is on break (break_until is set and not expired)
    if (verifiedUser.breakUntil) {
      const breakEndTime = new Date(verifiedUser.breakUntil).getTime();
      const currentTime = Date.now();

      if (currentTime < breakEndTime) {
        // Cashier is still on break, show break modal
        updateBreakUntil(verifiedUser.breakUntil);
        setShowBreakModal(true);
        toast.info(`Welcome back, ${verifiedUser.fullName}!`, {
          description: "You are currently on break.",
          duration: 3000,
        });
        return; // Don't proceed to cash fund check
      }
    }

    // Priority 2: Check if cashier needs to set cash fund (hasLogin = false means first login of the day)
    if (!verifiedUser.hasLogin) {
      // Cashier hasn't set their cash fund yet, show the modal
      setRequiresCashFund(true);
      setShowCashFundModal(true);
      toast.info(`Welcome, ${verifiedUser.fullName}!`, {
        description: "Please set your beginning cash fund to continue.",
        duration: 3000,
      });
    } else {
      // Cashier already has an active session with cash fund
      setRequiresCashFund(false);
      toast.success(`Welcome back, ${verifiedUser.fullName}!`, {
        duration: 2000,
      });
    }
  };

  // Handle time in from break
  const handleTimeIn = () => {
    setShowBreakModal(false);
    // Check if cashier needs cash fund after timing in
    // This would depend on your business logic
    toast.success("You're back! Ready to serve.", {
      duration: 2000,
    });
  };

  // Handle cash fund confirmation
  const handleCashFundConfirm = async (fundData: CashFundData) => {
    if (!cashierSession) {
      toast.error("No cashier session found");
      return;
    }

    try {
      // Send cash fund data to backend API
      await createCashFund({
        userId: cashierSession.cashierId,
        img: fundData.photoData,
        thousand: fundData.denominations.thousand,
        fiveHundred: fundData.denominations.fiveHundred,
        twoHundred: fundData.denominations.twoHundred,
        oneHundred: fundData.denominations.oneHundred,
        fifty: fundData.denominations.fifty,
        twenty: fundData.denominations.twenty,
        twentyCoins: fundData.denominations.twentyCoins,
        tenCoins: fundData.denominations.tenCoins,
        fiveCoins: fundData.denominations.fiveCoins,
        oneCoins: fundData.denominations.oneCoins,
        centavos: fundData.denominations.centavos,
      }).unwrap();

      setShowCashFundModal(false);
      setRequiresCashFund(false);
      toast.success("Cash fund set successfully!", {
        description: `Starting amount: P${fundData.totalAmount.toLocaleString()}`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Failed to create cash fund:", error);
      toast.error("Failed to set cash fund", {
        description: error?.data?.message || "Please try again",
        duration: 3000,
      });
    }
  };

  // Handle cashier logout from header
  const handleCashierLogout = () => {
    clearCashierSession();
    setCashierSession(null);
    setRequiresCashFund(false);
    toast.info("You have been logged out", {
      description: "Please select a user to continue",
      duration: 2000,
    });
    setShowPasscodeModal(true);
  };

  // Category filter state - stores both ID (for API) and label (for display)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("All");
  const [selectedProduct, setSelectedProduct] =
    useState<CategorizedProduct | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Scanner Mode State
  const [scannerMode, setScannerMode] = useState<"product" | "order">(
    "product",
  );
  const [isScannerEnabled, setIsScannerEnabled] = useState(false);
  const scannerBufferRef = useRef<string>("");
  const scannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // ✅ Fetch products from API with category and search filters
  // Skip the query if branchId is not yet available
  const {
    data: apiProducts = [],
    isLoading,
    isFetching,
    error,
  } = useGetBranchProductsQuery(
    {
      branchId: branchId || 0,
      category: selectedCategoryId,
      search: debouncedSearch,
    },
    {
      skip: !branchId, // Skip query until branchId is available
    },
  );

  // Handle category filter from sidebar
  const handleCategoryFilter = (
    categoryId: number | null,
    categoryLabel: string,
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryLabel(categoryLabel);
  };

  // 🔊 Handle scanned barcode - process the scanned code
  const handleScannedCode = useCallback(
    (scannedCode: string) => {
      if (!scannedCode.trim()) return;

      console.log(
        "📊 [Scanner] Scanned code:",
        scannedCode,
        "Mode:",
        scannerMode,
      );

      if (scannerMode === "product") {
        // Set the scanned code to search bar
        setSearchQuery(scannedCode.trim());

        // Focus the search input
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }

        toast.info(`🔍 Searching for: ${scannedCode.trim()}`, {
          duration: 1500,
        });
      } else if (scannerMode === "order") {
        // TODO: Handle order scanning - lookup order by code
        toast.info(`📋 Order scan: ${scannedCode.trim()}`, {
          description: "Order scanning coming soon!",
          duration: 2000,
        });
      }
    },
    [scannerMode],
  );

  // 🔊 Scanner keyboard event listener
  useEffect(() => {
    if (!isScannerEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field (except our search input when in product mode)
      const activeElement = document.activeElement;
      const isInputField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      // Allow scanner input even when focused on search bar in product mode
      if (
        isInputField &&
        scannerMode === "product" &&
        activeElement !== searchInputRef.current
      ) {
        return;
      }

      // If typing in other inputs, ignore scanner
      if (isInputField && scannerMode !== "product") {
        return;
      }

      // Clear previous timeout
      if (scannerTimeoutRef.current) {
        clearTimeout(scannerTimeoutRef.current);
      }

      // Handle Enter key - process the scanned code
      if (e.key === "Enter") {
        e.preventDefault();
        const scannedCode = scannerBufferRef.current;
        scannerBufferRef.current = "";

        if (scannedCode.length > 0) {
          handleScannedCode(scannedCode);
        }
        return;
      }

      // Ignore modifier keys and special keys
      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      // Add character to buffer
      scannerBufferRef.current += e.key;

      // Set timeout to clear buffer if no more input (scanner is fast, typing is slow)
      scannerTimeoutRef.current = setTimeout(() => {
        // If buffer has content after timeout, it might be manual typing
        // Clear it unless it looks like a complete barcode
        if (scannerBufferRef.current.length < 3) {
          scannerBufferRef.current = "";
        }
      }, 100); // 100ms - scanners are much faster than this
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (scannerTimeoutRef.current) {
        clearTimeout(scannerTimeoutRef.current);
      }
    };
  }, [isScannerEnabled, scannerMode, handleScannedCode]);

  // 🔊 Auto-add product when search returns exactly one result (scanner mode)
  useEffect(() => {
    if (!isScannerEnabled || scannerMode !== "product") return;
    if (!debouncedSearch || debouncedSearch.length < 3) return;
    if (isFetching || isLoading) return;

    // Check if we have exactly one product result
    if (apiProducts.length === 1) {
      const product = apiProducts[0];
      const hasVariantsToCustomize = product.compositions?.some(
        (comp) => comp.variants && comp.variants.length > 0,
      );

      if (hasVariantsToCustomize) {
        // Open customization modal
        setSelectedProduct(product);
        setShowCustomizationModal(true);
        toast.info(`📦 ${product.prod_name} has options`, {
          description: "Please select your preferences",
          duration: 2000,
        });
      } else {
        // Auto-add to cart
        addDirectToCart(product);
        toast.success(`✅ Added: ${product.prod_name}`, {
          duration: 1500,
        });
        // Clear search after adding
        setSearchQuery("");
      }
    } else if (apiProducts.length === 0 && debouncedSearch.length >= 3) {
      toast.error(`❌ No product found: ${debouncedSearch}`, {
        duration: 2000,
      });
    }
  }, [
    apiProducts,
    debouncedSearch,
    isScannerEnabled,
    scannerMode,
    isFetching,
    isLoading,
  ]);

  // ✅ Separate products by type for organized rendering
  const { individuals, individualsWithVariance, bundles, bundlesWithVariance } =
    useMemo(() => {
      return {
        individuals: apiProducts.filter((p) => p.type === "individual"),
        individualsWithVariance: apiProducts.filter(
          (p) => p.type === "individual-variance",
        ),
        bundles: apiProducts.filter((p) => p.type === "bundle"),
        bundlesWithVariance: apiProducts.filter(
          (p) => p.type === "bundle-variance",
        ),
      };
    }, [apiProducts]);

  // ✅ Handle add to cart - check if product needs customization
  const handleAdd = (product: CategorizedProduct) => {
    // Check if product has any compositions with variants to customize
    const hasVariantsToCustomize = product.compositions?.some(
      (comp) => comp.variants && comp.variants.length > 0,
    );

    if (hasVariantsToCustomize) {
      // Open modal if there are actual variants to choose from
      setSelectedProduct(product);
      setShowCustomizationModal(true);
    } else {
      // Add directly to cart with default components if no variants
      addDirectToCart(product);
    }
  };

  // ✅ Add item directly to cart without customization
  const addDirectToCart = (product: CategorizedProduct) => {
    const price = product.basePrice;

    // For products with compositions (bundles/meals), automatically include default components
    // This applies to both p_type=1 and p_type=2 when they have compositions
    let customizationDetails = undefined;
    if (product.compositions && product.compositions.length > 0) {
      customizationDetails = product.compositions.map((comp) => ({
        compositionId: comp.id,
        label: comp.name || "Customization",
        selected: {
          id: comp.default_prod.id.toString(),
          name: comp.default_prod.prod_name,
          calculated_price: 0,
          isDefault: true,
        },
      }));
    }

    addItem({
      id: product.id,
      branchProdId: product.branch_prod_id,
      name: product.prod_name,
      qty: 1,
      price,
      image: product.image || "/static/placeholder.png",
      type: product.p_type === 2 ? "meal" : "product",
      category: product.prod_categ.toString(),
      customization: customizationDetails,
    });
  };

  // ✅ Handle customization confirmation from modal
  const handleCustomizationConfirm = (customization: any) => {
    if (selectedProduct) {
      const product = selectedProduct;
      // Calculate total price with selected variants
      const basePriceValue = product.basePrice;

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
        branchProdId: product.branch_prod_id,
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
    if (selectedCategoryLabel === "All") return "Choose your Items";
    return `Category: ${selectedCategoryLabel}`;
  };

  // ✅ Checking branch ID state
  if (isCheckingBranch) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

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
      <FoodSidebarNav onFilter={handleCategoryFilter} />

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
          cashierName={cashierSession?.cashierFullname}
          onCashierLogout={handleCashierLogout}
          onBreakStart={() => setShowBreakModal(true)}
        />

        {/* 📡 Scanner Mode Toggle - STICKY */}
        <div className="sticky top-[20px] z-40 mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ScanBarcode
                size={24}
                className={
                  isScannerEnabled ? "text-green-600" : "text-gray-400"
                }
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Barcode Scanner
                </h3>
                <p className="text-xs text-gray-500">
                  {isScannerEnabled
                    ? `Active - Scanning for ${
                        scannerMode === "product" ? "products" : "orders"
                      }`
                    : "Click to enable scanner input"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Scanner Mode Selection */}
              {isScannerEnabled && (
                <div className="flex items-center gap-2 border-r pr-4 mr-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scannerMode"
                      checked={scannerMode === "product"}
                      onChange={() => setScannerMode("product")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Package size={16} className="text-blue-600" />
                    <span className="text-xs font-medium">Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scannerMode"
                      checked={scannerMode === "order"}
                      onChange={() => setScannerMode("order")}
                      className="w-4 h-4 text-purple-600"
                    />
                    <Receipt size={16} className="text-purple-600" />
                    <span className="text-xs font-medium">Order</span>
                  </label>
                </div>
              )}

              {/* Enable/Disable Toggle */}
              <button
                onClick={() => setIsScannerEnabled(!isScannerEnabled)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isScannerEnabled
                    ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {isScannerEnabled ? "✓ Scanner ON" : "Enable Scanner"}
              </button>
            </div>
          </div>

          {/* Scanner Status Indicator */}
          {/* {isScannerEnabled && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">
                  Ready to scan. Point scanner at barcode and scan.
                  {scannerMode === "product" &&
                    " Product will be auto-added if no customization needed."}
                </span>
              </div>
            </div>
          )} */}
        </div>

        {/* 🔍 Search Bar (Floating Top Right) & Category Header (Top Left) - STICKY */}
        <div className="sticky top-[80px] z-30 bg-gray-50 pb-4 pt-3 -mx-6 px-6 mb-6">
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
                  ref={searchInputRef}
                  type="text"
                  placeholder={
                    isScannerEnabled && scannerMode === "product"
                      ? "Scan or search items..."
                      : "Search items..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-10 py-2 w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    isScannerEnabled && scannerMode === "product"
                      ? "border-green-400 ring-1 ring-green-200"
                      : ""
                  }`}
                />
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                    type="button"
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                {/* Scanner indicator (only show when no search query) */}
                {!searchQuery &&
                  isScannerEnabled &&
                  scannerMode === "product" && (
                    <ScanBarcode
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                      size={18}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* ==== 🥡 COMBINED SECTION (when All is selected) ==== */}
        {selectedCategoryLabel === "All" ? (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Render all products (individuals, bundles, and variants) */}
              {apiProducts.map((product, index) => {
                const price = Number(product.basePrice) || 0;
                const displayName = product.prod_name;
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
                    <ProductImage src={imageUrl} alt={displayName} />
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
                      {product.has_variance && (
                        <div className="text-xs text-blue-600 font-medium">
                          Customizable
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAdd(product)}
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
                {/* <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  No Variants
                </h2> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {individuals.map((product, index) => {
                    const price = Number(product.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`individual-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductImage src={imageUrl} alt={product.prod_code} />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_name}
                          </div>
                          {/* <div className="text-xs text-gray-600 text-center">
                            {product.prod_code}
                          </div> */}
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(product)}
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
                  Customizable
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {individualsWithVariance.map((product, index) => {
                    const price = Number(product.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`individual-var-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px] border-2 border-blue-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductImage src={imageUrl} alt={product.prod_code} />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_name}
                          </div>
                          {/* <div className="text-xs text-gray-600 text-center">
                            {product.prod_code}
                          </div> */}
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            ✓ Customizable
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(product)}
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
                  {bundles.map((product, index) => {
                    const price = Number(product.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`bundle-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductImage src={imageUrl} alt={product.prod_code} />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_name}
                          </div>
                          {/* <div className="text-xs text-gray-600 text-center">
                            {product.prod_code}
                          </div> */}
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(product)}
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
                  {bundlesWithVariance.map((product, index) => {
                    const price = Number(product.basePrice) || 0;
                    const imageUrl = getImageUrl(product.image);

                    return (
                      <motion.div
                        key={`bundle-var-${product.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3 flex flex-col items-center justify-between text-center h-[240px] border-2 border-purple-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductImage src={imageUrl} alt={product.prod_code} />
                        <div className="flex flex-col items-center justify-between flex-1 min-h-0">
                          <div className="text-sm font-bold text-gray-800 text-center">
                            {product.prod_name}
                          </div>
                          {/* <div className="text-xs text-gray-600 text-center">
                            {product.prod_code}
                          </div> */}
                          <div className="text-sm text-gray-700 font-semibold">
                            ₱{price.toFixed(2)}
                          </div>
                          <div className="text-xs text-purple-600 font-medium">
                            ✓ Customizable
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAdd(product)}
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
        {apiProducts.length === 0 && !isLoading && !isFetching && (
          <div className="text-center text-gray-500 py-10">
            No items found{" "}
            {selectedCategoryLabel !== "All" && (
              <>
                in <strong>{selectedCategoryLabel}</strong>
              </>
            )}
            {debouncedSearch && (
              <>
                {" "}
                matching "<strong>{debouncedSearch}</strong>"
              </>
            )}
          </div>
        )}

        {/* Loading indicator for filtering */}
        {isFetching && !isLoading && (
          <div className="text-center text-gray-500 py-4">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={24} />
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
            id: selectedProduct.id,
            name: selectedProduct.prod_name,
            base_price: selectedProduct.basePrice,
            image: selectedProduct.image || "/static/placeholder.png",
            category: selectedProduct.prod_categ.toString(),
            variances: selectedProduct.compositions.map((comp) => ({
              compositionId: comp.id, // Add composition ID for independent tracking
              label: comp.name || "Customization", // Generic label from composition name
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
            })),
          }}
          onConfirm={handleCustomizationConfirm}
        />
      )}

      {/* Security Passcode Modal - Required for cashier authentication */}
      <SecurityPasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={handlePasscodeSuccess}
        branchId={branchId || 1}
        textMessage="Please select your name and enter your PIN to access the cashier system."
        allowClose={false}
        showBackButton={true}
        onBack={() => navigate("/food/main")}
      />

      {/* Cash Fund Modal - Required when hasLogin is false (first login of the day) */}
      <CashFundModal
        isOpen={showCashFundModal}
        onClose={() => {
          if (!requiresCashFund) {
            setShowCashFundModal(false);
          }
        }}
        onConfirmFund={handleCashFundConfirm}
        allowClose={!requiresCashFund}
      />

      {/* On Break Modal - Shows when cashier is on break */}
      <OnBreakModal
        isOpen={showBreakModal}
        onTimeIn={handleTimeIn}
        cashierName={cashierSession?.cashierFullname}
      />
    </div>
  );
}
