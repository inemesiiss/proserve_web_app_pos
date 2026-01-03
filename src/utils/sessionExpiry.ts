// Session expiry event management
// This utility provides a centralized way to handle session expiration across the app

type SessionExpiryCallback = (message: string) => void;

class SessionExpiryManager {
  private listeners: Set<SessionExpiryCallback> = new Set();
  private hasNotified = false;

  // Subscribe to session expiry events
  subscribe(callback: SessionExpiryCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners that the session has expired
  notifyExpiry(
    message: string = "Your session has expired. Please log in again."
  ) {
    // Prevent multiple notifications for the same expiry event
    if (this.hasNotified) return;
    this.hasNotified = true;

    this.listeners.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error("Error in session expiry callback:", error);
      }
    });

    // Reset after a short delay to allow for new notifications after re-login
    setTimeout(() => {
      this.hasNotified = false;
    }, 3000);
  }

  // Reset the notification flag (useful when user logs in again)
  reset() {
    this.hasNotified = false;
  }
}

// Singleton instance
export const sessionExpiryManager = new SessionExpiryManager();

// Helper function to parse error messages from the API
export function parseTokenExpiryError(error: any): string {
  if (error?.data?.detail) {
    return error.data.detail;
  }
  if (error?.data?.messages?.[0]?.message) {
    return error.data.messages[0].message;
  }
  if (error?.data?.code === "token_not_valid") {
    return "Your session has expired. Please log in again.";
  }
  return "Session expired. Please log in again.";
}
