import { useState, useRef, useCallback } from "react";
import { Upload, FileIcon, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

const BASE_UPLOAD_URL = "http://localhost:8080/upload";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MultiplePDFUploader = ({ onUploadComplete, projectName: propProjectName }) => {
  // Get the selected project from Redux store
  const selectedProject = useSelector(selectCurrentProject);
  const router = useRouter();
  
  // Function to get project name - crucial for backend compatibility
  const getProjectName = useCallback(() => {
    // Check prop first (highest priority)
    if (propProjectName && typeof propProjectName === "string" && propProjectName.trim() !== "") {
      console.log("Using project name from props:", propProjectName);
      return propProjectName.trim();
    }
    
    // Then check Redux state
    if (selectedProject) {
      // Handle string case
      if (typeof selectedProject === "string" && selectedProject.trim() !== "") {
        console.log("Using project name from Redux (string):", selectedProject);
        return selectedProject.trim();
      }
      
      // Handle object with name property
      if (
        typeof selectedProject === "object" && 
        selectedProject !== null &&
        selectedProject.name && 
        typeof selectedProject.name === "string" && 
        selectedProject.name.trim() !== ""
      ) {
        console.log("Using project name from Redux (object.name):", selectedProject.name);
        return selectedProject.name.trim();
      }
      
      // Handle object with title property (matching backend ProjectEntity.projectTitle)
      if (
        typeof selectedProject === "object" && 
        selectedProject !== null &&
        selectedProject.title && 
        typeof selectedProject.title === "string" && 
        selectedProject.title.trim() !== ""
      ) {
        console.log("Using project title from Redux (object.title):", selectedProject.title);
        return selectedProject.title.trim();
      }
      
      // Handle object with projectTitle property (exact match to backend field)
      if (
        typeof selectedProject === "object" && 
        selectedProject !== null &&
        selectedProject.projectTitle && 
        typeof selectedProject.projectTitle === "string" && 
        selectedProject.projectTitle.trim() !== ""
      ) {
        console.log("Using projectTitle from Redux:", selectedProject.projectTitle);
        return selectedProject.projectTitle.trim();
      }
    }
    
    // Fallback with warning
    console.warn("No valid project name found, using 'default'. This may cause backend errors if no project with this title exists.");
    return "default";
  }, [propProjectName, selectedProject]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const getProgressColor = (progress) => {
    if (progress <= 30) return "bg-red-500";
    if (progress <= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      return "Invalid file type. Please upload PDF files only.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 10MB limit.";
    }
    return null;
  };

  const uploadFile = useCallback(async (file, fileIndex) => {
    setUploadedFiles((prev) =>
      prev.map((item, index) =>
        index === fileIndex
          ? {
              ...item,
              status: "uploading",
              progress: 0,
              error: undefined,
            }
          : item
      )
    );

    const formData = new FormData();
    formData.append("file", file); // Name must match @RequestParam("file")
    
    try {
      // Get project name
      const projectName = getProjectName();
      
      // IMPORTANT: Using the exact URL pattern expected by the backend
      // The backend expects projectName as a query parameter
      const uploadURL = `${BASE_UPLOAD_URL}?projectName=${encodeURIComponent(projectName)}`;
      
      console.log(`Uploading to: ${uploadURL}`);
      console.log(`Project name: ${projectName}`);
      
      const response = await axios.post(uploadURL, formData, {
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
        withCredentials: true,
        // Add specific headers if needed by your backend
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        setUploadedFiles((prev) =>
          prev.map((item, index) =>
            index === fileIndex
              ? { ...item, status: "completed", progress: 100 }
              : item
          )
        );
        toast.success(`${file.name} uploaded successfully to project "${projectName}"`);

        // Call the onUploadComplete callback if provided
        if (typeof onUploadComplete === "function") {
          onUploadComplete();
        }

        // Refresh the page after a short delay
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error details:", error);
      
      let errorMessage = "Upload failed";
      
      // Extract helpful error information for debugging
      if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data || 'Unknown error'}`;
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        errorMessage = "No response received from server";
        console.error("Request made but no response received:", error.request);
      } else {
        errorMessage = `Error: ${error.message}`;
        console.error("Error message:", error.message);
      }
      
      setUploadedFiles((prev) =>
        prev.map((item, index) =>
          index === fileIndex
            ? {
                ...item,
                status: "error",
                error: errorMessage,
                progress: 0,
              }
            : item
        )
      );
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
    }
  }, [router, onUploadComplete, getProjectName]);

  const handleFiles = useCallback(
    (files) => {
      const validFiles = [];
      const errors = [];

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
          status: "idle",
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
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const truncateFileName = useCallback(
    (name, maxLength = 20) => {
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
            <span>Upload PDFs to {getProjectName()}</span>
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
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
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