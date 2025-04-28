"use client"
import { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';

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

  // Handle client-side only rendering for createPortal
  useEffect(() => {
    setMounted(true);
    // Load saved notes from localStorage
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('quickNotes', JSON.stringify(notes));
    }
  }, [notes, mounted]);

  const handleSaveNote = () => {
    if (noteInput.trim()) {
      const newNote = {
        id: Date.now().toString(),
        content: noteInput,
        timestamp: Date.now(),
      };
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setNoteInput('');
    }
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
  }

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
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Notes</h2>
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
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Note
          </button>
        </div>

        {/* Notes List */}
        <div className="overflow-auto h-[calc(100%-200px)]">
          {notes.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No notes yet. Add your first note above!
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