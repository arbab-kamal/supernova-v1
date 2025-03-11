"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import { selectChatId } from "@/store/chatSlice";
import axios from "axios";
import { Clock, MessageCircle } from "lucide-react";

const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const chatId = useSelector(selectChatId);
  const selectedProject = useSelector(selectCurrentProject);
  
  // Function to get project name - robust method similar to Chatbox component
  const getProjectName = () => {
    if (typeof selectedProject === "string" && selectedProject.trim() !== "") {
      return selectedProject.trim();
    }
    
    if (
      typeof selectedProject === "object" && 
      selectedProject !== null
    ) {
      if (selectedProject.name && typeof selectedProject.name === "string") {
        return selectedProject.name.trim();
      }
      if (selectedProject.title && typeof selectedProject.title === "string") {
        return selectedProject.title.trim();
      }
      if (selectedProject.projectTitle && typeof selectedProject.projectTitle === "string") {
        return selectedProject.projectTitle.trim();
      }
    }
    
    return "default";
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const projectName = getProjectName();
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        
        const response = await axios.get(`${baseURL}/chatHistory`, {
          params: {
            chatId,
            projectName
          },
          withCredentials: true
        });
        
        setHistory(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId, selectedProject]);

  // Format timestamp from backend
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Chat History
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 rounded bg-red-50">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No chat history found for this project</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto">
          {history.map((entry, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <div className="font-medium text-blue-600">
                  {entry.query ? entry.query.substring(0, 50) + (entry.query.length > 50 ? "..." : "") : "No query"}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(entry.timestamp)}
                </div>
              </div>
              <div className="text-sm text-gray-700">
                {entry.response ? entry.response.substring(0, 100) + (entry.response.length > 100 ? "..." : "") : "No response"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;