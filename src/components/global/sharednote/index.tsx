"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const SharedNotes = () => {
  const router = useRouter();
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:8080/getSharedNotes', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("API Response:", response.data);
      
      if (response.data) {
        setSharedNotes(response.data);
      } else {
        setError("No data received from the server");
      }
    } catch (error) {
      console.error("Error fetching shared notes:", error);
      setError(error.response?.data?.message || error.message || "Failed to load shared notes");
      toast.error("Failed to load shared notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirects to your existing chat page with the shareId and projectName
  const handleNoteClick = (shareId, projectName, senderId) => {
    // Update this path to match your existing chat page route
    router.push(`/chat`)
  };

  // const handleCreateNote = () => {
  //   router.push('/notes/create-shared');
  // };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-medium">Shared Notes</h1>
        {/* <Button 
          onClick={handleCreateNote}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Share Note
        </Button> */}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2">Loading shared notes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchSharedNotes} variant="outline">
                Retry
              </Button>
            </div>
          </div>
        ) : sharedNotes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No shared notes</h3>
              <p className="text-gray-500 mb-4">You don't have any shared notes yet.</p>
              <Button 
                onClick={handleCreateNote}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Share Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sharedNotes.map((note) => (
              <div 
                key={note.shareId} 
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNoteClick(note.shareId, note.projectName, note.senderId)}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="ml-2 font-medium truncate">{note.projectName || "Untitled Note"}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Shared by: {note.senderId || "Unknown"}</span>
                </div>
                <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedNotes;