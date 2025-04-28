"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const SharedNoteDetail = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareId = params?.shareId;
  const projectName = searchParams.get("projectName") || "Shared Note";
  
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [sender, setSender] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  
  // Find the shared note from Redux store
  const sharedNotes = useSelector((state) => state.notes.sharedNotes);
  
  useEffect(() => {
    if (shareId) {
      // First try to get from Redux store
      const noteFromStore = sharedNotes.find(note => note.shareId === shareId);
      
      if (noteFromStore) {
        setNoteContent(noteFromStore.notes);
        setSender(noteFromStore.senderName);
        setLoading(false);
      } else {
        // If not in store, fetch from API
        fetchSharedNote();
      }
    }
  }, [shareId, sharedNotes]);
  
  const fetchSharedNote = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/getSharedNote/${shareId}`);
      
      if (response.data) {
        setNoteContent(response.data.notes || "");
        setSender(response.data.senderName || "Unknown");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shared note:", error);
      toast.error("Failed to load shared note. Please try again.");
      setLoading(false);
    }
  };
  
  const handleSaveNotes = async () => {
    try {
      // This would be implemented if your API supports saving changes to shared notes
      await axios.post(`http://localhost:8080/updateSharedNote/${shareId}`, {
        notes: noteContent
      });
      
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error("Error updating shared note:", error);
      toast.error("Failed to update note. Please try again.");
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/notes/shared")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-medium">{projectName}</h1>
        </div>
        {!readOnly && (
          <Button
            onClick={handleSaveNotes}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>
      
      {/* Shared by information */}
      <div className="bg-blue-50 p-3 text-sm">
        <span className="font-medium">Shared by:</span> {sender}
        {readOnly && (
          <span className="ml-2 text-gray-500">(View only)</span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          Loading note content...
        </div>
      ) : (
        <div className="flex-1 p-4">
          {readOnly ? (
            <div className="prose max-w-none">
              {noteContent || "This shared note has no content."}
            </div>
          ) : (
            <textarea
              className="w-full h-full p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your notes here..."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SharedNoteDetail;