/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import Typewriter from "./typewriter";
import WelcomeUser from "./Welcome";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInitial, setUserInitial] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const fetchAIResponse = async (query: string) => {
    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      }/rag?query=${encodedQuery}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.text();
      return data;
    } catch (error) {
      console.error("Error fetching RAG response:", error);
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
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {messages.length === 0 && <WelcomeUser />}
      <div className="flex-1 overflow-y-auto mb-20 pt-4 px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <span className="text-xl">💡</span>
            </div>
            <div className="text-center mt-6 space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                Hi, how can I help you today?
              </h3>
              <div className="max-w-sm text-sm text-gray-500">
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
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">AI</span>
                  </div>
                )}
                <div
                  className={`px-6 py-3.5 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gray-200 text-gray-800 rounded-tr-none"
                      : "bg-blue-600 text-white rounded-tl-none"
                  } max-w-[95%] whitespace-pre-wrap break-words`}
                >
                  {message.sender === "ai" && index === messages.length - 1 ? (
                    <Typewriter text={message.text} speed={20} />
                  ) : (
                    message.text
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{userInitial || "U"}</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-64 right-[320px] border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="p-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center"
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
