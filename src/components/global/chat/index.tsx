/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import Typewriter from "./typewriter";
import WelcomeUser from "./Welcome";
import { useTheme } from "next-themes";
import { getThemeColors } from "@/lib/constant";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInitial, setUserInitial] = useState<string>("");
  const [chatId, setChatId] = useState<number>(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const selectedProject = useSelector(selectCurrentProject);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial chatId when component mounts
    setChatId(prev => prev === 0 ? 1 : prev + 1);
    
    const fetchUserName = async () => {
      try {
        const res = await fetch("http://localhost:8080/userName");
        if (!res.ok) throw new Error("Failed to fetch username");

        const data = await res.json();
        if (data.name) {
          setUserInitial(data.name.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewChat = () => {
    setMessages([]);
    setChatId(prev => prev + 1);
  };

  const fetchAIResponse = async (query: string) => {
    setIsLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const projectName = selectedProject?.name || "";
      
      // Log the request parameters for debugging
      console.log(`Sending request with: query=${query}, chatId=${chatId}, projectName=${projectName}`);
      
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
      // Provide more specific error messages based on the error type
      if (axios.isAxiosError(error) && error.response) {
        return `Error: ${error.response.status} - ${error.response.statusText}`;
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

      const aiResponse = await fetchAIResponse(inputValue);
      const aiMessage = { text: aiResponse, sender: "ai" };
      //@ts-ignore
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

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
                Feel free to ask any questions!
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
                  {message.sender === "ai" && index === messages.length - 1 ? (
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
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;