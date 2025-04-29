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
  const [noteData, setNoteData] = useState<SharedNote | null>(null);

  // Only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when drawer is closed
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

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
        setNoteData(matchingNote);
        setNoteContent(matchingNote.content || "");
      } else {
        setNoteData(null);
        setNoteContent("");
        setError("Note not found. The shared note may have been deleted or the ID is incorrect.");
      }
    } catch (err) {
      console.error("Error fetching shared note content:", err);
      setError("Failed to load note. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex-1 mr-2">
            <h2 id="drawer-title" className="text-lg font-semibold truncate">
              {projectName || noteData?.projectName || "Shared Note"}
            </h2>
            {(senderName || noteData?.senderId) && (
              <p className="text-sm text-gray-500">
                Shared by: {senderName || noteData?.senderId}
              </p>
            )}
            {noteData?.date && (
              <p className="text-xs text-gray-400">
                {formatDate(noteData.date)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Note Content */}
        <div className="p-4 h-[calc(100%-5rem)] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block w-6 h-6 border-2 border-t-blue-500 border-r-blue-500 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading note...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <p className="text-center">{error}</p>
              <button 
                onClick={fetchSharedNoteContent} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="w-full h-full p-4 border border-gray-200 rounded-lg overflow-auto whitespace-pre-wrap bg-gray-50">
                {noteContent ? noteContent : "No content available"}
              </div>
              {noteData?.projectId && (
                <div className="mt-4 text-right">
                  <span className="text-xs text-gray-500">
                    Project ID: {noteData.projectId}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default SharedNoteDrawer;