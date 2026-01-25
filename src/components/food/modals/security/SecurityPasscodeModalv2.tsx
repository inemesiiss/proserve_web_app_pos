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
  ArrowLeft,
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
import {
  saveCashierSession,
  updateCashierActivity,
  getCashierSession,
} from "@/utils/cashierSession";

interface SecurityPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verifiedUser: VerifiedUser) => void;
  textMessage?: string;
  digitCount?: number;
  branchId?: number;
  allowClose?: boolean; // If false, user cannot close modal without successful login
  showBackButton?: boolean; // Show back to directory button
  onBack?: () => void; // Callback when back button is clicked
}

export default function SecurityPasscodeModal({
  isOpen,
  onClose,
  onSuccess,
  textMessage = "Please enter your passcode to continue.",
  digitCount = 6,
  branchId = 1,
  allowClose = true,
  showBackButton = false,
  onBack,
}: SecurityPasscodeModalProps) {
  // Check for existing session
  const [savedSession, setSavedSession] = useState<{
    cashierId: number;
    cashierFullname: string;
  } | null>(null);
  const [showSwitchUser, setShowSwitchUser] = useState(false);

  // Load saved session on modal open
  useEffect(() => {
    if (isOpen) {
      const session = getCashierSession();
      if (session) {
        setSavedSession(session);
        setSelectedUser(session.cashierId.toString());
        setShowSwitchUser(false);
      } else {
        setSavedSession(null);
        setShowSwitchUser(true);
      }
    }
  }, [isOpen]);

  // Fetch branch users from API
  const { data: branchUsers = [], isLoading: isLoadingUsers } =
    useGetBranchUsersQuery(
      { branchId, role: "cashier" },
      {
        skip: !isOpen,
      },
    );

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
      (u) => u.id === selectedBranchUserId,
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
      // The verify API may not always return the fullname
      const displayName = selectedUserData.fullName || result.fullName;

      // Save session to localStorage (rewrites every time cashier logs in)
      saveCashierSession({
        cashierId: result.branchUserId,
        cashierFullname: displayName,
        hasLogin: result.hasLogin,
        breakUntil: result.breakUntil, // Save break status from API
        breakId: result.breakId, // Save break ID from API
      });

      // Update activity timestamp
      updateCashierActivity();

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

  const handleClose = () => {
    if (allowClose) {
      onClose();
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
            {/* Back button - top left */}
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="absolute top-4 left-4 flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            )}

            {allowClose && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}

            <h2 className="text-lg font-semibold text-center text-gray-700 leading-snug">
              {textMessage}
            </h2>

            {/* Loading overlay when fetching users */}
            {isLoadingUsers && !savedSession && (
              <div className="w-full flex flex-col items-center py-8">
                <Loader2
                  size={40}
                  className="text-blue-600 animate-spin mb-3"
                />
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            )}

            {/* Error message display */}
            {errorMessage && (
              <div className="w-full text-center text-red-500 text-sm font-medium bg-red-50 py-2 px-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Only show content when users are loaded or there's a saved session */}
            {(!isLoadingUsers || savedSession) && (
              <>
                {/* Show saved user info or user dropdown */}
                {showingSavedUser ? (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Current User
                    </label>
                    <div className="w-full h-11 rounded-xl border border-blue-300 bg-blue-50 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCircle size={20} className="text-blue-600" />
                        <span className="font-semibold text-blue-700">
                          {savedSession.cashierFullname}
                        </span>
                      </div>
                      <button
                        onClick={handleSwitchUser}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
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
                      Select User
                    </label>
                    <Select
                      value={selectedUser}
                      onValueChange={setSelectedUser}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border-gray-300 bg-gray-50 focus:ring-blue-500">
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
                  {[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    ".",
                    "0",
                    "←",
                  ].map((key) => (
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
                  ))}
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
                    className="bg-blue-600 text-white hover:bg-blue-700 min-w-[100px]"
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
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
