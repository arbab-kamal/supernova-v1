"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Edit, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const SharedNoteDetail = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareId = params?.shareId;
  const projectName = searchParams.get("projectName") || "Shared Note";
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [sender, setSender] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  
  useEffect(() => {
    if (shareId) {
      fetchSharedNote();
    }
  }, [shareId]);
  
  const fetchSharedNote = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching note with shareId: ${shareId}`);
      const response = await axios.get(`http://localhost:8080/getSharedNote/${shareId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("API Response:", response.data);
      
      if (response.data) {
        setNoteContent(response.data.notes || "");
        setSender(response.data.senderName || "Unknown");
      } else {
        setError("No data received from the server");
      }
    } catch (error) {
      console.error("Error fetching shared note:", error);
      setError(error.response?.data?.message || error.message || "Failed to load shared note");
      toast.error("Failed to load shared note. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveNotes = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/updateSharedNote/${shareId}`, {
        notes: noteContent
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Save response:", response.data);
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error("Error updating shared note:", error);
      toast.error(error.response?.data?.message || "Failed to update note. Please try again.");
    }
  };
  
  const toggleEditMode = () => {
    setReadOnly(!readOnly);
  };
  
  const handleRetry = () => {
    fetchSharedNote();
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleEditMode}
            className="text-sm"
          >
            {readOnly ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                View Only
              </>
            )}
          </Button>
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
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2">Loading note content...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4">
          {readOnly ? (
            <div className="prose max-w-none whitespace-pre-wrap">
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