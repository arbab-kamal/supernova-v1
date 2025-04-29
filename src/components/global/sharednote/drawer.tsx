"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SharedNoteDrawerProps {
  open: boolean;
  onClose: () => void;
  shareId: string | null;
  projectName: string | null;
  senderName: string | null;
}

interface SharedNote {
  sharedNoteId: string;
  senderId: string;
  projectName: string;
  projectId: string;
  content: string;
  date: string;
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
      // Call the GET /getSharedNotes endpoint
      const response = await fetch("http://localhost:8080/getSharedNotes", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      const data = await response.json();
      
      // Find the note that matches the shareId
      const matchingNote = Array.isArray(data)
        ? data.find((note: SharedNote) => note.sharedNoteId === shareId)
        : null;
      
      if (matchingNote) {
        // Directly use the note content from the sender
        setNoteContent(matchingNote.content || "");
      } else {
        setNoteContent("");
        setError("Note not found");
      }
    } catch (err) {
      console.error("Error fetching shared note content:", err);
      setError("Failed to load note");
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
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
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

        {/* Note Content */}
        <div className="p-4 h-[calc(100%-4rem)] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="w-full h-full p-3 border border-gray-200 rounded overflow-auto whitespace-pre-wrap">
              {noteContent || "No content available"}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default SharedNoteDrawer;