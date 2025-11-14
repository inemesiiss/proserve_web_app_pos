import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface ConfirmationYesNoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary";
  cancelButtonVariant?: "default" | "destructive" | "outline" | "secondary";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: "warning" | "success" | "info" | "error" | "none";
  showCancelButton?: boolean;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

export default function ConfirmationYesNo({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonVariant = "default",
  cancelButtonVariant = "outline",
  isLoading = false,
  disabled = false,
  icon = "warning",
  showCancelButton = true,
  confirmButtonClassName = "",
  cancelButtonClassName = "",
}: ConfirmationYesNoProps) {
  const handleConfirm = () => {
    if (!disabled && !isLoading) {
      onConfirm();
    }
  };

  const renderIcon = () => {
    const iconProps = { size: 48, className: "mx-auto mb-4" };

    switch (icon) {
      case "warning":
        return (
          <AlertTriangle
            {...iconProps}
            className="text-yellow-500 mx-auto mb-4"
          />
        );
      case "success":
        return (
          <CheckCircle {...iconProps} className="text-green-500 mx-auto mb-4" />
        );
      case "info":
        return <Info {...iconProps} className="text-blue-500 mx-auto mb-4" />;
      case "error":
        return <XCircle {...iconProps} className="text-red-500 mx-auto mb-4" />;
      case "none":
        return null;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {renderIcon()}
            <DialogTitle className="text-xl font-bold mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex gap-3 justify-center mt-6">
          {showCancelButton && (
            <Button
              variant={cancelButtonVariant}
              onClick={onClose}
              disabled={isLoading}
              className={`min-w-[100px] ${cancelButtonClassName}`}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
            className={`min-w-[100px] ${confirmButtonClassName}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
