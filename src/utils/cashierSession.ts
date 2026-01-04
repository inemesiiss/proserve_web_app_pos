// Cashier session management utility
// Handles localStorage storage with 15-minute inactivity timeout

const CASHIER_ID_KEY = "cashierId";
const CASHIER_NAME_KEY = "cashierFullname";
const CASHIER_LAST_ACTIVITY_KEY = "cashierLastActivity";
const CASHIER_HAS_LOGIN_KEY = "cashierHasLogin";
const CASHIER_BREAK_UNTIL_KEY = "cashierBreakUntil";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

export interface CashierSession {
  cashierId: number;
  cashierFullname: string;
  hasLogin?: boolean;
  breakUntil?: string | null; // ISO date string when break ends
}

// Save cashier session to localStorage
export const saveCashierSession = (session: CashierSession): void => {
  try {
    localStorage.setItem(CASHIER_ID_KEY, session.cashierId.toString());
    localStorage.setItem(CASHIER_NAME_KEY, session.cashierFullname);
    localStorage.setItem(CASHIER_LAST_ACTIVITY_KEY, Date.now().toString());

    // Save hasLogin status
    if (session.hasLogin !== undefined) {
      localStorage.setItem(CASHIER_HAS_LOGIN_KEY, session.hasLogin.toString());
    }

    // Save breakUntil - rewrite every time cashier logs in
    if (session.breakUntil !== undefined) {
      if (session.breakUntil) {
        localStorage.setItem(CASHIER_BREAK_UNTIL_KEY, session.breakUntil);
      } else {
        localStorage.removeItem(CASHIER_BREAK_UNTIL_KEY);
      }
    }
  } catch (error) {
    console.error("Error saving cashier session:", error);
  }
};

// Update break until time (called when starting a break)
export const updateBreakUntil = (breakUntil: string | null): void => {
  try {
    if (breakUntil) {
      localStorage.setItem(CASHIER_BREAK_UNTIL_KEY, breakUntil);
    } else {
      localStorage.removeItem(CASHIER_BREAK_UNTIL_KEY);
    }
  } catch (error) {
    console.error("Error updating break until:", error);
  }
};

// Clear break (called when timing in from break)
export const clearBreakUntil = (): void => {
  try {
    localStorage.removeItem(CASHIER_BREAK_UNTIL_KEY);
  } catch (error) {
    console.error("Error clearing break until:", error);
  }
};

// Check if cashier is currently on break
export const isOnBreak = (): boolean => {
  try {
    const breakUntil = localStorage.getItem(CASHIER_BREAK_UNTIL_KEY);
    if (!breakUntil) return false;

    const breakEndTime = new Date(breakUntil).getTime();
    const currentTime = Date.now();

    return currentTime < breakEndTime;
  } catch (error) {
    console.error("Error checking break status:", error);
    return false;
  }
};

// Get break end time
export const getBreakUntil = (): string | null => {
  try {
    return localStorage.getItem(CASHIER_BREAK_UNTIL_KEY);
  } catch (error) {
    console.error("Error getting break until:", error);
    return null;
  }
};

// Get remaining break time in milliseconds
export const getBreakRemainingTime = (): number => {
  try {
    const breakUntil = localStorage.getItem(CASHIER_BREAK_UNTIL_KEY);
    if (!breakUntil) return 0;

    const breakEndTime = new Date(breakUntil).getTime();
    const currentTime = Date.now();
    const remaining = breakEndTime - currentTime;

    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error("Error getting break remaining time:", error);
    return 0;
  }
};

// Check if cashier has already logged in today (hasLogin = true means cash fund already set)
export const getHasLogin = (): boolean => {
  try {
    const hasLogin = localStorage.getItem(CASHIER_HAS_LOGIN_KEY);
    return hasLogin === "true";
  } catch (error) {
    console.error("Error getting hasLogin status:", error);
    return false;
  }
};

// Set hasLogin status
export const setHasLogin = (value: boolean): void => {
  try {
    localStorage.setItem(CASHIER_HAS_LOGIN_KEY, value.toString());
  } catch (error) {
    console.error("Error setting hasLogin status:", error);
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
    localStorage.removeItem(CASHIER_HAS_LOGIN_KEY);
    localStorage.removeItem(CASHIER_BREAK_UNTIL_KEY);
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
