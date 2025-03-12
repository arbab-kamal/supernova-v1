"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from 'react-redux';
import { startNewChat, selectChatId } from '@/store/chatSlice';
import { selectCurrentProject } from '@/store/projectSlice';
import { fetchConversationById } from '@/store/historySlice';
import {
  MessageCircle,
  Wand2,
  Clock,
  Share2,
  Bookmark,
  Archive,
  ChevronDown,
  ChevronUp,
  FolderGit2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const Sidebar = () => {
  const [isPromptOpen, setIsPromptOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const chatId = useSelector(selectChatId);
  const selectedProject = useSelector(selectCurrentProject);
  
  const handleNewChat = () => {
    dispatch(startNewChat());
    router.push('/chat');
  };
  
  // Function to get project name - robust method
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

  // Handle history item click
  const handleHistoryItemClick = (item) => {
    // Get conversation ID from the item
    // Adjust this based on your actual data structure
    const conversationId = item.id || item.conversationId;
    
    if (conversationId) {
      const projectName = getProjectName();
      
      // Dispatch action to fetch conversation messages
      dispatch(fetchConversationById({ 
        conversationId, 
        projectName 
      }));
      
      // Navigate to the chat page
      router.push('/chat');
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("http://localhost:8080/userName", {
          withCredentials: true,
        });

        // Handle different response formats
        if (typeof response.data === "string") {
          setUsername(response.data.trim());
        } else if (typeof response.data === "object" && response.data !== null) {
          if ("username" in response.data) {
            setUsername(response.data.username);
          } else {
            // Try to get the first value in the object
            const firstValue = Object.values(response.data)[0];
            if (typeof firstValue === "string") {
              setUsername(firstValue);
            } else {
              throw new Error("Invalid data format");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("Unknown User"); // Fallback if error occurs
      }
    };

    fetchUsername();
  }, []);
  
  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!chatId) return;
      
      setHistoryLoading(true);
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
        
        // Set chat history from response
        if (Array.isArray(response.data)) {
          setChatHistory(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setChatHistory([]);
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setChatHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (isHistoryOpen) {
      fetchChatHistory();
    }
  }, [chatId, selectedProject, isHistoryOpen]);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/logout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/auth";
      } else {
        throw new Error(`Logout failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const navItems = [
    {
      id: "project",
      icon: FolderGit2,
      label: "Project",
      href: "/project",
    },
    {
      id: "bookmark",
      icon: Bookmark,
      label: "Bookmark",
      href: "/chat/bookmark",
    },
  ];

  // Function to truncate text for display
  const truncateText = (text, maxLength = 25) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-600 to-blue-400 p-4 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold">SuperNova</h1>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-white/10 text-left mb-4"
      >
        <PlusCircle className="w-5 h-5" />
        <span>New Chat</span>
      </button>

      {/* Scrollable Middle Section */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Prompt Assist Section */}
        <div>
          <button className="flex items-center justify-between w-full mb-2 hover:bg-white/10 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="font-medium">Prompt Assist</span>
            </div>
            {isPromptOpen ? (
              <ChevronDown
                className="w-4 h-4"
                onClick={() => setIsPromptOpen(!isPromptOpen)}
              />
            ) : (
              <ChevronUp
                className="w-4 h-4"
                onClick={() => setIsPromptOpen(!isPromptOpen)}
              />
            )}
          </button>

          {isPromptOpen && (
            <>
              <div className="text-xs text-white/70 mb-2 uppercase ml-6">
                SUGGESTION
              </div>
              <div className="space-y-2">
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer">
                  <div className="font-medium">Risk</div>
                  <div className="text-sm text-white/70">
                    Analyzed Your BRD Technological Risk
                  </div>
                </div>
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer">
                  <div className="font-medium">Tech Risk</div>
                  <div className="text-sm text-white/70">
                    Summarized The Document
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <Separator className="my-2 bg-white/20" />

        {/* History Section */}
        <div>
          <button
            className={`flex items-center justify-between w-full mb-2 p-2 rounded-md ${
              pathname === "/chat/history" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Link href="/chat/history">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">History</span>
              </div>
            </Link>
            {isHistoryOpen ? (
              <ChevronDown
                className="w-4 h-4"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              />
            ) : (
              <ChevronUp
                className="w-4 h-4"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              />
            )}
          </button>

          {isHistoryOpen && (
            <>
              <div className="ml-6 space-y-2 max-h-48 overflow-y-auto pr-2">
                {historyLoading ? (
                  <div className="text-center py-2">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-xs text-white/70 italic py-2">No chat history</div>
                ) : (
                  chatHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="hover:bg-white/10 rounded-md p-2 cursor-pointer text-sm"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <div className="font-medium">{truncateText(item.question || "Conversation")}</div>
                      <div className="text-xs text-white/70">{truncateText(item.reply, 35)}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Separator className="my-2 bg-white/20" />

      {/* Bottom Navigation */}
      <div className="space-y-2 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${
                  isActive
                    ? "bg-white/20 hover:bg-white/25"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 mr-2 text-white" />
                <span className="text-white">{item.label}</span>
              </Button>
            </Link>
          );
        })}

        <Separator className="my-2 bg-white/20" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg cursor-pointer w-full">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{username || "Loading..."}</div>
              <div className="text-xs text-white/70">Free Plan</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-lg shadow-md mt-2">
            <DropdownMenuItem>
              <Link href="/chat/account" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;