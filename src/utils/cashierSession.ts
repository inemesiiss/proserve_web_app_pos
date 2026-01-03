// Cashier session management utility
// Handles localStorage storage with 15-minute inactivity timeout

const CASHIER_ID_KEY = "cashierId";
const CASHIER_NAME_KEY = "cashierFullname";
const CASHIER_LAST_ACTIVITY_KEY = "cashierLastActivity";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

export interface CashierSession {
  cashierId: number;
  cashierFullname: string;
}

// Save cashier session to localStorage
export const saveCashierSession = (session: CashierSession): void => {
  try {
    localStorage.setItem(CASHIER_ID_KEY, session.cashierId.toString());
    localStorage.setItem(CASHIER_NAME_KEY, session.cashierFullname);
    localStorage.setItem(CASHIER_LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error saving cashier session:", error);
  }
};

// Update last activity timestamp
export const updateCashierActivity = (): void => {
  try {
    const cashierId = localStorage.getItem(CASHIER_ID_KEY);
    if (cashierId) {
      localStorage.setItem(CASHIER_LAST_ACTIVITY_KEY, Date.now().toString());
    }
  } catch (error) {
    console.error("Error updating cashier activity:", error);
  }
};

// Check if session is expired based on inactivity
export const isSessionExpired = (): boolean => {
  try {
    const lastActivity = localStorage.getItem(CASHIER_LAST_ACTIVITY_KEY);
    if (!lastActivity) return true;

    const lastActivityTime = parseInt(lastActivity, 10);
    const currentTime = Date.now();
    return currentTime - lastActivityTime > SESSION_TIMEOUT_MS;
  } catch (error) {
    console.error("Error checking session expiry:", error);
    return true;
  }
};

// Get current cashier session if valid
export const getCashierSession = (): CashierSession | null => {
  try {
    // Check if session is expired
    if (isSessionExpired()) {
      clearCashierSession();
      return null;
    }

    const cashierId = localStorage.getItem(CASHIER_ID_KEY);
    const cashierFullname = localStorage.getItem(CASHIER_NAME_KEY);

    if (!cashierId || !cashierFullname) {
      return null;
    }

    return {
      cashierId: parseInt(cashierId, 10),
      cashierFullname,
    };
  } catch (error) {
    console.error("Error getting cashier session:", error);
    return null;
  }
};

// Clear cashier session from localStorage
export const clearCashierSession = (): void => {
  try {
    localStorage.removeItem(CASHIER_ID_KEY);
    localStorage.removeItem(CASHIER_NAME_KEY);
    localStorage.removeItem(CASHIER_LAST_ACTIVITY_KEY);
  } catch (error) {
    console.error("Error clearing cashier session:", error);
  }
};

// Get remaining session time in milliseconds
export const getSessionRemainingTime = (): number => {
  try {
    const lastActivity = localStorage.getItem(CASHIER_LAST_ACTIVITY_KEY);
    if (!lastActivity) return 0;

    const lastActivityTime = parseInt(lastActivity, 10);
    const currentTime = Date.now();
    const elapsed = currentTime - lastActivityTime;
    const remaining = SESSION_TIMEOUT_MS - elapsed;

    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error("Error getting remaining session time:", error);
    return 0;
  }
};
