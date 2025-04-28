"use client"
import { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

// Import from your project store
import { selectCurrentProject } from '@/store/projectSlice';

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
  const [noteInput, setNoteInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current project from Redux store
  const currentProject = useSelector(selectCurrentProject);

  // Handle client-side only rendering for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch notes whenever the drawer opens or project changes
  useEffect(() => {
    if (mounted && open && currentProject?.name) {
      fetchNotes();
    }
  }, [mounted, open, currentProject?.name]);

  const fetchNotes = async () => {
    if (!currentProject?.name) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/getNotes?projectName=${encodeURIComponent(currentProject.name)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }
      
      const notesData = await response.text();
      // Parse the notes based on your API response format
      // This assumes your API returns a string that can be parsed into Notes[]
      try {
        const parsedNotes = JSON.parse(notesData) as Note[];
        setNotes(parsedNotes);
      } catch (e) {
        // If the API returns a simple string or other format, handle accordingly
        setNotes([{
          id: '1',
          content: notesData,
          timestamp: Date.now()
        }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (noteInput.trim() && currentProject?.name) {
      const newNote = {
        id: Date.now().toString(),
        content: noteInput,
        timestamp: Date.now(),
      };
      
      // Optimistically update UI
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setNoteInput('');
      
      // Here you would typically send the new note to your backend
      // This depends on whether you have a corresponding POST endpoint
      try {
        // Example of how you might implement saving notes if you have an API for it
        // await fetch('/saveNote', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ projectName: currentProject.name, note: newNote })
        // });
      } catch (err) {
        console.error('Error saving note:', err);
        // Revert optimistic update on error
        setNotes((prevNotes) => prevNotes.filter(note => note.id !== newNote.id));
        setError('Failed to save note. Please try again.');
      }
    }
  };

  const handleDeleteNote = (id: string) => {
    // Optimistically remove from UI
    setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
    
    // Here you would typically call an API to delete the note
    // This depends on whether you have a corresponding DELETE endpoint
  };

  // Only render the portal on the client side
  if (!mounted) return null;

  // Don't render anything if the drawer is closed
  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {currentProject?.name ? `Notes: ${currentProject.name}` : 'Notes'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Note Input Area */}
        <div className="p-4 border-b">
          <textarea
            className="w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a note..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <button
            onClick={handleSaveNote}
            disabled={!noteInput.trim() || !currentProject?.name}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Save Note
          </button>
        </div>

        {/* Notes List */}
        <div className="overflow-auto h-[calc(100%-200px)]">
          {isLoading ? (
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
              {currentProject?.name ? 'No notes yet. Add your first note above!' : 'Select a project to see notes.'}
            </div>
          ) : (
            notes.map((note) => (
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