"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Clock, ExternalLink, AlertCircle, Search } from "lucide-react";
import SharedNoteDrawer from "./drawer";

interface SharedNote {
  id: string;
  shareId: string;
  projectName: string;
  senderName: string;
  createdAt: string | number;
  updatedAt?: string | number;
}

const SharedNotesList = () => {
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<SharedNote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8080/getSharedNotes", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setSharedNotes(response.data);
      } else {
        setSharedNotes([]);
      }
    } catch (err) {
      console.error("Error fetching shared notes:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch shared notes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateValue: string | number): string => {
    try {
      // Handle various date formats or timestamps
      const date = typeof dateValue === 'number'
        ? new Date(dateValue)
        : new Date(dateValue.replace(/(\d{2}):(\d{2})\.(\d{3})Z$/, "$1:$2:00.$3Z"));
      
      // Check if the date is valid before formatting
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", dateValue);
        return "Invalid date";
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e, dateValue);
      return "Invalid date";
    }
  };

  const openNoteDrawer = (note: SharedNote) => {
    setSelectedNote(note);
    setIsDrawerOpen(true);
  };

  const closeNoteDrawer = () => {
    setIsDrawerOpen(false);
  };

  const filteredNotes = sharedNotes.filter(note => 
    note.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shared Notes</h1>
        <button 
          onClick={fetchSharedNotes}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>

      {/* Status heading based on notes availability */}
      <div className={`p-4 mb-4 rounded-lg ${
        isLoading ? "bg-blue-50" :
        error ? "bg-red-50" :
        sharedNotes.length === 0 ? "bg-yellow-50" : "bg-green-50"
      }`}>
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin mr-2">
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-blue-700 font-medium">Loading shared notes...</h2>
          </div>
        ) : error ? (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-red-700 font-medium">Error loading shared notes</h2>
          </div>
        ) : sharedNotes.length === 0 ? (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-yellow-700 font-medium">You don't have any shared notes</h2>
          </div>
        ) : (
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-green-700 font-medium">
              You have {sharedNotes.length} shared note{sharedNotes.length !== 1 ? 's' : ''}
            </h2>
          </div>
        )}
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by project or sender name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Notes list */}
      {!isLoading && !error && sharedNotes.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <li 
                  key={note.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => openNoteDrawer(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{note.projectName}</h3>
                        <p className="text-sm text-gray-500">Shared by: {note.senderName}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                No notes matching your search
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {/* Selected note drawer */}
      {selectedNote && (
        <SharedNoteDrawer
          open={isDrawerOpen}
          onClose={closeNoteDrawer}
          shareId={selectedNote.shareId}
          projectName={selectedNote.projectName}
          senderName={selectedNote.senderName}
        />
      )}
    </div>
  );
};

export default SharedNotesList;