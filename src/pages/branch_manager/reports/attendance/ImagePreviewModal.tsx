import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image as ImageIcon } from "lucide-react";
import { API_BASE_URL } from "./types";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImagePreviewModalProps) {
  const fullImageUrl = imageUrl ? `${API_BASE_URL}${imageUrl}` : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center p-4">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={title}
              className="max-w-full max-h-[400px] rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.png";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
              <ImageIcon className="h-16 w-16 mb-2" />
              <p>No image available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
