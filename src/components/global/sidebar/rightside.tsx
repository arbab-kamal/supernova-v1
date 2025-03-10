"use client";
import React, { useState, useCallback, useEffect } from "react";
import { File } from "lucide-react";

const MIN_SIDEBAR_WIDTH = 256;
const MAX_SIDEBAR_WIDTH = 800;

const RightSidebar = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle mouse move event for resizing
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - event.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  // Handle mouse up event to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8080/files", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch files";
      setError(errorMessage);
      console.error("Error fetching files:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial file fetch
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      {/* Drag handle */}

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 min-h-screen bg-white border-l border-gray-200 overflow-hidden"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-4">
          {/* Files Section */}
          <div className="mt-10">
            <h3 className="px-4 text-xs font-medium text-gray-600 mt-16">
              Your Document
            </h3>
            <div className="space-y-1">
              {loading ? (
                <div className="px-4 py-3 bg-gray-100 rounded">
                  Loading files...
                </div>
              ) : error ? (
                <div className="px-4 py-3 text-red-500 text-sm">{error}</div>
              ) : files.length === 0 ? (
                <div className="px-4 py-3 text-gray-800 text-sm">
                  No files found
                </div>
              ) : (
                files.map((fileName, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-3 hover:bg-gray-100 text-gray-800 rounded cursor-pointer flex items-center gap-3 text-left"
                  >
                    <File className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm truncate">{fileName}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
