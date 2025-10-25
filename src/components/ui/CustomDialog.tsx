import { X } from "lucide-react";
import React, { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";

interface CustomDialogProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
  title: string;
  width: string;
  closeIcon: string;
  height: string;
  button: ReactNode;
  className?: string;
  bgColor?: string;
  anim?: string;
  manualClose?: ReactNode;
  escape?: string;
}

function CustomDialog({
  close,
  children,
  title,
  width,
  closeIcon,
  height,
  button,
  className,
  bgColor = "rgba(0, 0, 0, 0.1)",
  anim = "Y",
  manualClose,
  escape = "Y",
}: CustomDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && escape === "Y") {
        close(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, manualClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: anim === "N" ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: anim === "N" ? 0 : 0.3, ease: "easeOut" }}
        className={`relative rounded-md bg-white p-6 ${width}  ${height} overflow-auto`}
      >
        <div className={className}>
          <div className="flex justify-between pr-8 items-center">
            <span className="font-bold text-lg">{title}</span>
            {button}
          </div>
          {title !== "" && <hr className="my-2" />}
          {closeIcon !== "N" && manualClose !== "" && (
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => close(false)}
            />
          )}
          {manualClose}
        </div>
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default CustomDialog;
