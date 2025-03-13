"use client";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChatId, selectChatStatus, setChatId } from "@/store/chatSlice";
import { selectCurrentProject } from "@/store/projectSlice";
import { fetchChatHistory } from "@/store/historySlice";
import { BarChart, Clock, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { ChatContext } from '@/components/global/sidebar/index'; // Import the context from Sidebar

const ChatHistory = () => {
  const [isChatCountOpen, setIsChatCountOpen] = useState(true);
  const [chatCountList, setChatCountList] = useState<number[]>([]);
  const [activeChatIndex, setActiveChatIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const chatStatus = useSelector(selectChatStatus);
  const selectedProject = useSelector(selectCurrentProject);
  
  // Get context values
  const { newChatAdded, setNewChatAdded, currentChatId } = useContext(ChatContext);

  // A robust method to retrieve the project name from the selected project
  const getProjectName = () => {
    if (typeof selectedProject === "string" && selectedProject.trim() !== "") {
      return selectedProject.trim();
    }
    if (typeof selectedProject === "object" && selectedProject !== null) {
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

  // Initial chat count fetch when the project is selected
  useEffect(() => {
    fetchChatCount();
  }, [selectedProject]);

  // Handle new chat added
  useEffect(() => {
    if (newChatAdded) {
      // Add a new entry to chatCountList with count 0
      setChatCountList(prev => [...prev, 0]);
      // Set the active chat to the new one
      setActiveChatIndex(chatCountList.length);
      // Reset the flag
      setNewChatAdded(false);
    }
  }, [newChatAdded]);

  // When a message is sent and chat status becomes completed, increment the count for the active chat.
  useEffect(() => {
    if (chatStatus === 'completed' && activeChatIndex !== null) {
      const updatedCounts = [...chatCountList];
      updatedCounts[activeChatIndex] = (updatedCounts[activeChatIndex] || 0) + 1;
      setChatCountList(updatedCounts);
    }
  }, [chatStatus]);

  // Sync with backend periodically (every 5 seconds)
  useEffect(() => {
    const syncWithBackend = async () => {
      if (!selectedProject) return;
      try {
        const projectName = getProjectName();
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await axios.get(`${baseURL}/chatCount`, {
          params: { projectName },
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          // Simply use the backend data directly
          setChatCountList(response.data.map(count => Number(count) || 0));
        }
      } catch (err) {
        console.error("Error syncing with backend:", err);
      }
    };
    
    const intervalId = setInterval(syncWithBackend, 5000);
    return () => clearInterval(intervalId);
  }, [selectedProject]);

  const fetchChatCount = async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    try {
      const projectName = getProjectName();
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await axios.get(`${baseURL}/chatCount`, {
        params: { projectName },
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setChatCountList(response.data.map(count => Number(count) || 0));
      } else {
        setChatCountList([]);
      }
    } catch (err) {
      console.error("Error fetching chat count:", err);
      setChatCountList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = (index) => {
    setActiveChatIndex(index);
    // Set the chat ID to the selected chat's index + 1 (since chat IDs start at 1)
    const selectedChatId = index + 1;
    dispatch(setChatId(selectedChatId));
    
    // Fetch the chat history for this chat
    const projectName = getProjectName();
    dispatch(fetchChatHistory({ 
      chatId: selectedChatId, 
      projectName 
    }));
    
    // Navigate to chat page if not already there
    if (pathname !== '/chat') {
      router.push('/chat');
    }
  };

  // Manual refresh for chat counts
  const handleManualRefresh = (e) => {
    e.stopPropagation();
    fetchChatCount();
  };

  return (
    <div>
      <button className="flex items-center justify-between w-full mb-2 p-2 rounded-md hover:bg-white/10 overflow-hidden min-w-[180px]">
        <div className="flex items-center gap-2">
          <BarChart className="w-4 h-4" />
          <span className="font-medium">Chat</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
          <button 
            onClick={handleManualRefresh}
            className="p-1 hover:bg-white/20 rounded-full"
            title="Refresh chat counts"
          >
            <Clock className="w-3 h-3 text-white" />
          </button>
          {isChatCountOpen ? (
            <ChevronDown
              className="w-4 h-4"
              onClick={() => setIsChatCountOpen(!isChatCountOpen)}
            />
          ) : (
            <ChevronUp
              className="w-4 h-4"
              onClick={() => setIsChatCountOpen(!isChatCountOpen)}
            />
          )}
        </div>
      </button>
      {isChatCountOpen && (
        <div className="ml-6 space-y-2 pr-2">
          {isLoading ? (
            <div className="text-center py-2">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
            </div>
          ) : chatCountList.length === 0 ? (
            <div className="text-xs text-white/70 italic py-2">No chat data available</div>
          ) : (
            chatCountList.map((count, index) => (
              <button
                key={index}
                onClick={() => handleChatSelect(index)}
                className={`flex items-center justify-between w-full bg-white/10 hover:bg-white/20 rounded-md p-2 mb-2 transition-colors ${
                  activeChatIndex === index ? 'ring-2 ring-white/40' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium"> Chat {index + 1}</span>
                </div>
                <div className="bg-blue-500 px-2 py-1 rounded-full text-xs font-bold">
                  {count}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
