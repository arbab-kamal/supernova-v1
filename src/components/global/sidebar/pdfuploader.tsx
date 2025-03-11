import { useState, useRef, useCallback } from "react";
import { Upload, FileIcon, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

// Updated to use a function that constructs the URL with query parameters
const getUploadURL = (projectName) => `http://localhost:8080/upload?projectName=${encodeURIComponent(projectName)}`;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MultiplePDFUploader = ({ projectName = "default" }) => {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      progress: number;
      status: "idle" | "uploading" | "completed" | "error";
      error?: string;
    }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getProgressColor = (progress: number) => {
    if (progress <= 30) return "bg-red-500";
    if (progress <= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Invalid file type. Please upload PDF files only.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 10MB limit.";
    }
    return null;
  };

  const uploadFile = useCallback(async (file: File, fileIndex: number) => {
    setUploadedFiles((prev) =>
      prev.map((item, index) =>
        index === fileIndex
          ? {
              ...item,
              status: "uploading" as const,
              progress: 0,
              error: undefined,
            }
          : item
      )
    );

    const formData = new FormData();
    formData.append("file", file);
    // Removed projectName from formData as it's now in the URL

    try {
      const response = await axios.post(getUploadURL(projectName), formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadedFiles((prev) =>
              prev.map((item, index) =>
                index === fileIndex ? { ...item, progress } : item
              )
            );
          }
        },
      });

      if (response.status === 200) {
        setUploadedFiles((prev) =>
          prev.map((item, index) =>
            index === fileIndex
              ? { ...item, status: "completed" as const, progress: 100 }
              : item
          )
        );
        toast.success(`${file.name} uploaded successfully`);

        // Refresh the page after a short delay
        setTimeout(() => {
          router.refresh(); // Efficiently refreshes the page in Next.js
        }, 2000); // Delay for user to see the toast
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadedFiles((prev) =>
        prev.map((item, index) =>
          index === fileIndex
            ? {
                ...item,
                status: "error" as const,
                error: errorMessage,
                progress: 0,
              }
            : item
        )
      );
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
      console.error("Upload error:", error);
    }
  }, [projectName]);

  const handleFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length) {
        toast.error(errors.join("\n"));
      }

      if (validFiles.length) {
        setIsOpen(false);
        const newFiles = validFiles.map((file) => ({
          file,
          progress: 0,
          status: "idle" as const,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        validFiles.forEach((file, index) => {
          const fileIndex = uploadedFiles.length + index;
          uploadFile(file, fileIndex);
        });
      }
    },
    [uploadFile, uploadedFiles.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const truncateFileName = useCallback(
    (name: string, maxLength: number = 20) => {
      if (name.length <= maxLength) return name;
      return `${name.slice(0, maxLength)}...`;
    },
    []
  );

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload PDFs</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <VisuallyHidden>
            <DialogTitle>Upload PDFs</DialogTitle>
          </VisuallyHidden>

          <div className="grid gap-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              aria-label="PDF files input"
            />
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                }
              `}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              <Upload className="mx-auto h-10 w-10 mb-4 text-blue-500" />
              <p className="text-sm text-gray-600">
                {isDragging
                  ? "Drop files here"
                  : "Click to select or drag and drop PDF files"}
              </p>
              <p className="text-xs mt-2 text-gray-500">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {uploadedFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 w-80 shadow-lg rounded-lg p-4 z-50 border border-gray-200 bg-white space-y-4">
          {uploadedFiles.map((fileData, index) => (
            <div key={`${fileData.file.name}-${index}`} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <FileIcon className="w-4 h-4 text-blue-500" />
                  <span
                    className="text-sm font-medium truncate"
                    title={fileData.file.name}
                  >
                    {truncateFileName(fileData.file.name)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {fileData.status === "uploading" && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  <button
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {fileData.status === "error" ? (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {fileData.error}
                </div>
              ) : (
                <>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getProgressColor(
                        fileData.progress
                      )}`}
                      style={{ width: `${fileData.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-center text-gray-500">
                    {fileData.status === "completed"
                      ? "Completed"
                      : `${fileData.progress}% Uploaded`}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiplePDFUploader;