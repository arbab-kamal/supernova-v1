"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import axios from "axios";

// Import from your project store
import { selectCurrentProject } from "@/store/projectSlice";

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const Drawer = ({ open, onClose }: DrawerProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current project from Redux store
  const currentProject = useSelector(selectCurrentProject);
  
  // Handle different formats of currentProject like in ShareNotes component
  const projectName = 
    typeof currentProject === 'object' && currentProject !== null
      ? currentProject.title || currentProject.name
      : typeof currentProject === 'string'
        ? currentProject
        : null;
  
  const canSaveNote = Boolean(projectName) && Boolean(noteInput.trim());
  
  // Debug logging similar to ShareNotes component
  useEffect(() => {
    console.log("Drawer - Current Project:", currentProject);
    console.log("Project Name detected:", projectName);
    console.log("Can Save Note:", canSaveNote);
  }, [currentProject, projectName, canSaveNote, noteInput]);

  // Only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch notes when drawer opens or project changes
  useEffect(() => {
    if (mounted && open && projectName) {
      fetchNotes();
    }
  }, [mounted, open, projectName]);

  const fetchNotes = async () => {
    if (!projectName) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8080/getNotes", {
        params: { projectName },
      });

      let parsedNotes: Note[] = [];

      if (typeof response.data === "string") {
        try {
          const parsed = JSON.parse(response.data);
          // Ensure parsedNotes is an array
          parsedNotes = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          parsedNotes = [
            {
              id: "1",
              content: response.data,
              timestamp: Date.now(),
            },
          ];
        }
      } else {
        // Ensure response.data is treated as an array
        parsedNotes = Array.isArray(response.data) ? response.data : [response.data];
      }

      setNotes(parsedNotes);

      // Don't pre-fill textarea with most recent note - keep it empty for new input
      setNoteInput("");
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    // only when there's text and a project
    if (!noteInput.trim() || !projectName) return;
  
    const newNote: Note = {
      id: Date.now().toString(),
      content: noteInput,
      timestamp: Date.now(),
    };
  
    try {
      await axios.post(
        "http://localhost:8080/updateNotes",
        { 
          note: newNote,
          projectName: projectName
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      // Clear the input field after successful save
      setNoteInput("");
      
      // Refresh notes to show the updated list including the new note
      fetchNotes();
      
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to save note. Please try again.");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete("http://localhost:8080/deleteNote", {
        params: { projectName, noteId: id },
      });
      
      // Refresh notes list after deletion
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note. Please try again.");
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
          <h2 className="text-lg font-semibold">
            {projectName
              ? `Notes: ${projectName}`
              : "Notes (No Project Selected)"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-b">
          <textarea
            className="w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={projectName ? "Write a note..." : "Select a project first..."}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            disabled={!projectName}
          />
          <button
            onClick={handleSaveNote}
            disabled={!canSaveNote}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Save Note
            {!projectName && <span className="ml-1 text-xs opacity-70">(No project selected)</span>}
          </button>
        </div>

        {/* Notes List */}
        <div className="overflow-auto h-[calc(100%-200px)]">
          {!projectName ? (
            <div className="p-4 text-gray-500 text-center">
              Select a project to see notes.
            </div>
          ) : isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading notes...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">
              {error}
              <button
                onClick={fetchNotes}
                className="block mx-auto mt-2 text-blue-500 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : notes.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No notes yet. Add your first note above!
            </div>
          ) : (
            Array.isArray(notes) && notes.map((note) => (
              <div key={note.id} className="p-4 border-b hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Drawer;