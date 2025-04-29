"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

interface SharedNoteDrawerProps {
  open: boolean;
  onClose: () => void;
  shareId: string | null;
  projectName: string | null;
  senderName: string | null;
}

const SharedNoteDrawer = ({ open, onClose, shareId, projectName, senderName }: SharedNoteDrawerProps) => {
  const [noteContent, setNoteContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch note content when drawer opens or shareId changes
  useEffect(() => {
    if (mounted && open && shareId) {
      fetchSharedNoteContent();
    }
  }, [mounted, open, shareId]);

  const fetchSharedNoteContent = async () => {
    if (!shareId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call your existing API endpoint for getting shared note content
      const response = await axios.get("http://localhost:8080/getSharedNoteContent", {
        params: { shareId },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Shared Note Content Response:", response.data);

      // Handle different response formats
      if (response.data && response.data.content) {
        setNoteContent(response.data.content);
      } else if (typeof response.data === "string") {
        setNoteContent(response.data);
      } else {
        setNoteContent(JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Error fetching shared note content:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold truncate">
              {projectName || "Shared Note"}
            </h2>
            {senderName && (
              <p className="text-sm text-gray-500">Shared by: {senderName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Status indicator */}
        {isLoading && (
          <div className="p-2 bg-blue-50 text-blue-700 text-sm text-center">
            Loading note...
          </div>
        )}
        {error && (
          <div className="p-2 bg-red-50 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Note Content */}
        <div className="p-4 h-[calc(100%-4rem)] overflow-auto">
          {noteContent ? (
            <div className="whitespace-pre-wrap">{noteContent}</div>
          ) : (
            <div className="text-gray-500 italic">
              {isLoading ? "Loading..." : "No content available"}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default SharedNoteDrawer;