"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  text?: string; // message text in modal
  handleSubmit: () => Promise<void> | void; // callback when confirmed
  isReadyToSubmit: boolean; // controls visibility
  error?: string | null; // error message
  onClose?: () => void; // optional close handler
}

export default function ConfirmModal({
  text = "Are you sure you want to complete this transaction?",
  handleSubmit,
  isReadyToSubmit,
  error,
  onClose,
}: ConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // when readyToSubmit becomes true, open confirm modal
  useEffect(() => {
    if (isReadyToSubmit) {
      setIsOpen(true);
    }
  }, [isReadyToSubmit]);

  // when error changes, show error modal
  useEffect(() => {
    if (error) setErrorOpen(true);
  }, [error]);

  const handleConfirm = async () => {
    try {
      await handleSubmit();
      setIsOpen(false);
      onClose?.();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setIsOpen(false);
      setErrorOpen(true);
    }
  };

  return (
    <>
      {/* ✅ Confirm Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Transaction
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {text}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ❌ Error Dialog */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent className="sm:max-w-md border-red-400">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-semibold">
              Transaction Error
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              {error ||
                "Something went wrong while processing your transaction."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end">
            <Button
              onClick={() => setErrorOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
