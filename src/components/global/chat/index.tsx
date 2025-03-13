/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import Typewriter from "./typewriter";
import WelcomeUser from "./Welcome";
import { useTheme } from "next-themes";
import { getThemeColors } from "@/lib/constant";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import { selectChatId, selectResetFlag } from "@/store/chatSlice";
import { 
  selectChatHistory, 
  selectHistoryLoading,
  clearHistory,
  fetchChatHistory,
  selectConversationMessages,
  selectHasFetchedHistory,
} from "@/store/historySlice";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [userInitial, setUserInitial] = useState<string>("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  
  // Redux state
  const dispatch = useDispatch();
  const chatId = useSelector(selectChatId);
  const resetFlag = useSelector(selectResetFlag);
  const selectedProject = useSelector(selectCurrentProject);
  const chatHistory = useSelector(selectChatHistory);
  const historyLoading = useSelector(selectHistoryLoading);
  const conversationMessages = useSelector(selectConversationMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to get project name - robust method to handle different formats
  const getProjectName = useCallback(() => {
    // Handle string case
    if (typeof selectedProject === "string" && selectedProject.trim() !== "") {
      console.log("Using project name from Redux (string):", selectedProject);
      return selectedProject.trim();
    }
    
    // Handle object with name property
    if (
      typeof selectedProject === "object" && 
      selectedProject !== null &&
      selectedProject.name && 
      typeof selectedProject.name === "string" && 
      selectedProject.name.trim() !== ""
    ) {
      console.log("Using project name from Redux (object.name):", selectedProject.name);
      return selectedProject.name.trim();
    }
    
    // Handle object with title property (matching backend ProjectEntity.projectTitle)
    if (
      typeof selectedProject === "object" && 
      selectedProject !== null &&
      selectedProject.title && 
      typeof selectedProject.title === "string" && 
      selectedProject.title.trim() !== ""
    ) {
      console.log("Using project title from Redux (object.title):", selectedProject.title);
      return selectedProject.title.trim();
    }
    
    // Handle object with projectTitle property (exact match to backend field)
    if (
      typeof selectedProject === "object" && 
      selectedProject !== null &&
      selectedProject.projectTitle && 
      typeof selectedProject.projectTitle === "string" && 
      selectedProject.projectTitle.trim() !== ""
    ) {
      console.log("Using projectTitle from Redux:", selectedProject.projectTitle);
      return selectedProject.projectTitle.trim();
    }
    
    // Fallback with warning
    console.warn("No valid project name found, using 'default'. This may cause backend errors if no project with this title exists.");
    return "default";
  }, [selectedProject]);

  // Immediately detect first-time users when component mounts
  useEffect(() => {
    // For first time users (no chatId), immediately set isFirstLoad to false
    if (!chatId) {
      setIsFirstLoad(false);
      return;
    }
    
    // If history has been fetched and chatHistory is empty, stop further fetches
    if (chatId && hasFetchedHistory && chatHistory.length === 0) {
      setIsFirstLoad(false);
      return;
    }
    
    // If we have a chat ID but chatHistory is empty and not loading, fetch chat history
    if (chatId && chatHistory.length === 0 && !historyLoading) {
      dispatch(fetchChatHistory({ 
        chatId: chatId, 
        projectName: getProjectName() 
      }));
    } else if (conversationMessages && conversationMessages.length > 0) {
      setMessages(conversationMessages);
      setIsFirstLoad(false);
    }
    
    // Final safeguard: if history loading completes, update firstLoad state
    if (!historyLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [
    chatId, 
    chatHistory, 
    conversationMessages, 
    historyLoading, 
    selectHasFetchedHistory, // include our new flag here
    dispatch, 
    getProjectName, 
    isFirstLoad
  ]);
  
    // If we have conversation messages, update the UI
    else if (conversationMessages && conversationMessages.length > 0) {
      console.log(`Setting ${conversationMessages.length} messages from conversation`);
      setMessages(conversationMessages);
      setIsFirstLoad(false); // History loaded, not first load anymore
    }
    
    // Final safeguard: if history loading completes, update firstLoad state
    if (!historyLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [chatId, chatHistory, conversationMessages, historyLoading, dispatch, getProjectName, isFirstLoad]);
  

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get("http://localhost:8080/userName", {
          withCredentials: true,
        });
        
        let name = "";
        
        // Handle different response formats
        if (typeof response.data === "string") {
          name = response.data.trim();
        } else if (typeof response.data === "object" && response.data !== null) {
          if ("username" in response.data) {
            name = response.data.username;
          } else if ("name" in response.data) {
            name = response.data.name;
          } else {
            // Try to get the first value in the object
            const firstValue = Object.values(response.data)[0];
            if (typeof firstValue === "string") {
              name = firstValue;
            } else {
              throw new Error("Invalid data format");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }
        
        // Extract just the first letter and capitalize it
        if (name && name.length > 0) {
          setUserInitial(name.charAt(0).toUpperCase());
        } else {
          setUserInitial("U"); // Fallback if name is empty
        }
        
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserInitial("U"); // Fallback if error occurs
      }
    };
  
    fetchUserName();
  }, []);

  // Reset messages when resetFlag changes (triggered by the new chat action)
  useEffect(() => {
    setMessages([]);
    dispatch(clearHistory());
  }, [resetFlag, dispatch]);

  // Enhanced debugging of state changes
  useEffect(() => {
    console.log("Current state:", {
      chatId,
      isFirstLoad,
      historyLoading,
      chatHistory: chatHistory?.length || 0,
      messages: messages?.length || 0,
      conversationMessages: conversationMessages?.length || 0
    });
  }, [chatId, isFirstLoad, historyLoading, chatHistory, messages, conversationMessages]);

  // Load chat history when chatId changes or when history is loaded
  useEffect(() => {
    // For first time users (no chatId), immediately set isFirstLoad to false
    if (!chatId) {
      setIsFirstLoad(false);
      return;
    }
    
    // If we have a chat ID but no conversation messages, fetch the chat history
    if (chatId && chatHistory.length === 0 && !historyLoading) {
      console.log(`Fetching chat history for chatId ${chatId}`);
      dispatch(fetchChatHistory({ 
        chatId: chatId, 
        projectName: getProjectName() 
      }));
    }
    // If we have conversation messages, update the UI
    else if (conversationMessages && conversationMessages.length > 0) {
      console.log(`Setting ${conversationMessages.length} messages from conversation`);
      setMessages(conversationMessages);
      setIsFirstLoad(false); // History loaded, not first load anymore
    }
    
    // If history loading completes, update firstLoad state
    if (!historyLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [chatId, chatHistory, conversationMessages, historyLoading, dispatch, getProjectName, isFirstLoad]);

  // Clean up history data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearHistory());
    };
  }, [dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAIResponse = async (query: string) => {
    setIsLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      // Get project name using the robust method
      const projectName = getProjectName();
      
      console.log(`Sending request: query=${query}, chatId=${chatId}, projectName=${projectName}`);
      
      const response = await axios.get(`${baseURL}/rag`, {
        params: {
          query,
          chatId,
          projectName
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching RAG response:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Server responded with ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        return `Error: ${error.response.status} - Please try again or check your input.`;
      }
      return "Sorry, I couldn't process your request. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      const userMessage = { text: inputValue, sender: "user" };
      //@ts-ignore
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");

      try {
        const aiResponse = await fetchAIResponse(inputValue);
        const aiMessage = { text: aiResponse || "No response received", sender: "ai" };
        //@ts-ignore
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error handling submission:", error);
        const errorMessage = { text: "An error occurred while processing your request.", sender: "ai" };
        //@ts-ignore
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  // Simplified loading condition - only show for returning users with a chatId
  if (historyLoading && chatId) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-[calc(100vh-140px)]"
        style={{ backgroundColor: colors.bg.main }}
      >
        <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-[calc(100vh-140px)]"
      style={{ 
        backgroundColor: colors.bg.main 
      }}
    >
      {messages.length === 0 && <WelcomeUser />}
      <div className="flex-1 overflow-y-auto mb-20 pt-4 px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{ backgroundColor: isDarkMode ? colors.bg.tertiary : '#EBF5FF' }}
            >
              <span className="text-xl">💡</span>
            </div>
            <div className="text-center mt-6 space-y-2">
              <h3 
                className="text-lg font-medium"
                style={{ color: colors.text.primary }}
              >
                Hi, how can I help you today?
              </h3>
              <div 
                className="max-w-sm text-sm"
                style={{ color: colors.text.secondary }}
              >
                Feel free to ask any questions about your project!
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 px-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 mt-8 ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start -ml-6"
                }`}
              >
                {message.sender === "ai" && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: isDarkMode ? colors.bg.tertiary : '#EBF5FF',
                      color: colors.primary.main 
                    }}
                  >
                    <span className="text-sm">AI</span>
                  </div>
                )}
                <div
                  className={`px-6 py-3.5 rounded-2xl ${
                    message.sender === "user"
                      ? "rounded-tr-none"
                      : "rounded-tl-none text-white"
                  } max-w-[95%] whitespace-pre-wrap break-words`}
                  style={{ 
                    backgroundColor: message.sender === "user" 
                      ? isDarkMode ? colors.bg.tertiary : colors.bg.tertiary
                      : colors.primary.main,
                    color: message.sender === "user"
                      ? colors.text.primary
                      : '#FFFFFF' 
                  }}
                >
                  {message.sender === "ai" && index === messages.length - 1 && !chatId ? (
                    <Typewriter text={message.text} speed={20} />
                  ) : (
                    message.text
                  )}
                </div>
                {message.sender === "user" && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: isDarkMode ? colors.bg.tertiary : colors.bg.tertiary,
                      color: colors.text.primary
                    }}
                  >
                    <span className="text-sm">{userInitial || "U"}</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div 
        className="fixed bottom-0 left-64 right-[320px] border-t p-4"
        style={{ 
          backgroundColor: colors.bg.main,
          borderColor: colors.border 
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 border rounded-full focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.input.bg,
                borderColor: colors.input.border,
                color: colors.text.primary,
                "&:focus": {
                  borderColor: "transparent",
                  boxShadow: `0 0 0 2px ${colors.primary.main}`
                }
              }}
            />
            <button
              type="submit"
              className="p-2.5 text-white rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: colors.primary.main,
                "&:hover": { filter: "brightness(90%)" }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;