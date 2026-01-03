import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  X,
  User,
  Loader2,
  UserCircle,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetBranchUsersQuery,
  useVerifyPasscodeMutation,
} from "@/store/api/User";
import type { VerifiedUser } from "@/store/api/User";

// Manager session storage keys
const MANAGER_SESSION_KEY = "manager_session";

interface ManagerSession {
  managerId: number;
  managerFullName: string;
}

// Helper functions for manager session
export const saveManagerSession = (session: ManagerSession): void => {
  localStorage.setItem(MANAGER_SESSION_KEY, JSON.stringify(session));
};

export const getManagerSession = (): ManagerSession | null => {
  try {
    const stored = localStorage.getItem(MANAGER_SESSION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch {
    return null;
  }
};

export const clearManagerSession = (): void => {
  localStorage.removeItem(MANAGER_SESSION_KEY);
};

interface ManagerPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verifiedUser: VerifiedUser) => void;
  textMessage?: string;
  digitCount?: number;
  branchId?: number;
}

export default function ManagerPasscodeModal({
  isOpen,
  onClose,
  onSuccess,
  textMessage = "Please enter your passcode to continue.",
  digitCount = 6,
  branchId = 1,
}: ManagerPasscodeModalProps) {
  // Check for existing manager session
  const [savedSession, setSavedSession] = useState<ManagerSession | null>(null);
  const [showSwitchUser, setShowSwitchUser] = useState(false);

  // Load saved session on modal open
  useEffect(() => {
    if (isOpen) {
      const session = getManagerSession();
      if (session) {
        setSavedSession(session);
        setSelectedUser(session.managerId.toString());
        setShowSwitchUser(false);
      } else {
        setSavedSession(null);
        setShowSwitchUser(true);
      }
    }
  }, [isOpen]);

  // Fetch branch users from API
  const { data: branchUsers = [], isLoading: isLoadingUsers } =
    useGetBranchUsersQuery(branchId, {
      skip: !isOpen,
    });

  // Verify passcode mutation
  const [verifyPasscode, { isLoading: isVerifying }] =
    useVerifyPasscodeMutation();

  const [passcode, setPasscode] = useState<string[]>([]);
  const [showDigits, setShowDigits] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const handleKeyPress = (key: string) => {
    if (passcode.length >= digitCount) return;
    setPasscode([...passcode, key]);
    // Clear error when user starts typing
    if (error) {
      setError(false);
      setErrorMessage("");
    }
  };

  const handleDelete = () => setPasscode(passcode.slice(0, -1));

  const handleReset = () => {
    setPasscode([]);
    setError(false);
    setErrorMessage("");
  };

  // Switch to different user
  const handleSwitchUser = () => {
    setShowSwitchUser(true);
    setSelectedUser("");
    setPasscode([]);
    setError(false);
    setErrorMessage("");
  };

  // API verification handler
  const handleConfirm = async () => {
    // Validate user selection
    if (!selectedUser) {
      setError(true);
      setErrorMessage("Please select a user");
      return;
    }

    // Validate passcode
    if (passcode.length < digitCount) {
      setError(true);
      setErrorMessage("Please enter complete passcode");
      return;
    }

    // Find selected user to get the actual userId for API
    const selectedBranchUserId = parseInt(selectedUser, 10);
    const selectedUserData = branchUsers.find(
      (u) => u.id === selectedBranchUserId
    );

    if (!selectedUserData) {
      setError(true);
      setErrorMessage("User not found");
      return;
    }

    try {
      // Call API to verify passcode using user id (not branch user id)
      const result = await verifyPasscode({
        branchId,
        userId: selectedUserData.userId, // Use userId field for verification
        passCode: passcode.join(""),
      }).unwrap();

      // Use the fullName from dropdown data (selectedUserData) as it's more reliable
      const displayName = selectedUserData.fullName || result.fullName;

      // Save manager session to localStorage
      saveManagerSession({
        managerId: result.branchUserId,
        managerFullName: displayName,
      });

      // Clear state and call success callback
      setPasscode([]);
      setError(false);
      setErrorMessage("");
      setShowSwitchUser(false);

      // Return result with the correct fullName from dropdown
      onSuccess({
        ...result,
        fullName: displayName,
      });
      onClose();
    } catch (err: any) {
      // Handle API error
      setError(true);
      setErrorMessage(err?.data?.message || "Invalid passcode");
      setPasscode([]);
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    }
  };

  // Get display name for dropdown
  const getUserDisplayName = (user: (typeof branchUsers)[0]) => {
    return user.fullName;
  };

  // Determine if showing saved user or user selection
  const showingSavedUser = savedSession && !showSwitchUser;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-10 w-[380px] flex flex-col items-center space-y-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-center text-gray-700 leading-snug">
              {textMessage}
            </h2>

            {/* Error message display */}
            {errorMessage && (
              <div className="w-full text-center text-red-500 text-sm font-medium bg-red-50 py-2 px-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Show saved user info or user dropdown */}
            {showingSavedUser ? (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Manager
                </label>
                <div className="w-full h-11 rounded-xl border border-green-300 bg-green-50 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle size={20} className="text-green-600" />
                    <span className="font-semibold text-green-700">
                      {savedSession.managerFullName}
                    </span>
                  </div>
                  <button
                    onClick={handleSwitchUser}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Switch
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter your passcode to continue
                </p>
              </div>
            ) : (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Select Manager/User
                </label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-full h-11 rounded-xl border-gray-300 bg-gray-50 focus:ring-green-500">
                    <div className="flex items-center gap-2">
                      {isLoadingUsers ? (
                        <Loader2
                          size={16}
                          className="text-gray-500 animate-spin"
                        />
                      ) : (
                        <User size={16} className="text-gray-500" />
                      )}
                      <SelectValue
                        placeholder={
                          isLoadingUsers
                            ? "Loading users..."
                            : "Choose a user..."
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg border-gray-200">
                    {branchUsers.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id.toString()}
                        className="cursor-pointer hover:bg-gray-100 rounded-lg"
                      >
                        {getUserDisplayName(user)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <motion.div
              animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center mt-4"
            >
              <div className="flex justify-center space-x-2">
                {[...Array(digitCount)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-lg font-semibold ${
                      error
                        ? "border-red-500 text-red-500"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {showDigits
                      ? passcode[idx] || ""
                      : passcode[idx]
                      ? "•"
                      : ""}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDigits(!showDigits)}
                className="mt-3 text-gray-500 hover:text-gray-700"
              >
                {showDigits ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 mt-6 w-full">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"].map(
                (key) => (
                  <Button
                    key={key}
                    onClick={() =>
                      key === "←" ? handleDelete() : handleKeyPress(key)
                    }
                    className="h-12 text-lg font-semibold rounded-xl shadow-sm hover:bg-gray-200"
                    variant="outline"
                  >
                    {key}
                  </Button>
                )
              )}
            </div>

            <div className="flex justify-between w-full mt-6">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isVerifying}
              >
                Reset
              </Button>
              <Button
                className="bg-green-600 text-white hover:bg-green-700 min-w-[100px]"
                onClick={handleConfirm}
                disabled={isVerifying || isLoadingUsers}
              >
                {isVerifying ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
