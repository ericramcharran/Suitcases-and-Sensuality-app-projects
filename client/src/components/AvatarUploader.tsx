import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface AvatarUploaderProps {
  onGetUploadParameters: () => Promise<{ method: "PUT"; url: string }>;
  onComplete?: (objectPath: string) => void;
  maxFileSize?: number;
  buttonClassName?: string;
  disabled?: boolean;
}

export function AvatarUploader({
  onGetUploadParameters,
  onComplete,
  maxFileSize = 5242880, // 5MB default
  buttonClassName,
  disabled = false,
}: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      alert(`File size must be less than ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      setUploading(true);

      // Get upload parameters
      const { url } = await onGetUploadParameters();

      // Upload file
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      // Extract object path from upload URL
      const objectPath = new URL(url).pathname;
      
      // Call completion callback
      onComplete?.(objectPath);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled || uploading}
        className={buttonClassName}
        data-testid="button-upload-avatar"
      >
        {uploading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload Avatar
          </>
        )}
      </Button>
    </div>
  );
}
