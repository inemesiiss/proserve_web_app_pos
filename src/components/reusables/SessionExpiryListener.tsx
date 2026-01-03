import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sessionExpiryManager } from "@/utils/sessionExpiry";
import { useAuth } from "@/context/AuthProvider";

/**
 * Component that listens for session expiry events and shows a notification.
 * Place this component inside your Router to enable navigation on session expiry.
 */
export function SessionExpiryListener() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = sessionExpiryManager.subscribe(async (message) => {
      // Show toast notification
      toast.error(message, {
        duration: 5000,
        description: "You will be redirected to the login page.",
        action: {
          label: "Login Now",
          onClick: () => {
            navigate("/login", { replace: true });
          },
        },
      });

      // Perform logout cleanup
      try {
        await logout();
      } catch (error) {
        console.error("Error during session expiry logout:", error);
      }

      // Navigate to login after a short delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, logout]);

  return null;
}
