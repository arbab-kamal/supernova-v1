"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isPromptOpen, setIsPromptOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch("http://localhost:8080/addUser", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch email");

        const data = await response.json();
        setEmail(data.email); // Assuming API returns { email: "user@example.com" }
      } catch (error) {
        console.error("Error fetching email:", error);
        setEmail("Unknown User"); // Fallback if error occurs
      }
    };

    fetchEmail();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/auth";
      } else {
        throw new Error(
          `Logout failed: ${response.status} ${response.statusText}`
        );
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
      href: "/chat/project",
    },
    { id: "shared", icon: Share2, label: "Shared", href: "/chat/shared" },
    {
      id: "bookmark",
      icon: Bookmark,
      label: "Bookmark",
      href: "/chat/bookmark",
    },
    { id: "archive", icon: Archive, label: "Archive", href: "/chat/archive" },
  ];

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
      <Link href="/chat">
        <Button variant="secondary" className="w-full mb-6 text-blue-600">
          <MessageCircle className="w-4 h-4 mr-2" />
          Start New Chat
        </Button>
      </Link>

      {/* Scrollable Middle Section */}
      <div className="flex-1 overflow-hidden space-y-6 ">
        {/* Prompt Assist Section */}
        <div>
          <button className="flex items-center justify-between w-full mb-2 hover:bg-white/10 p-2 rounded-md ">
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
              <div className="text-xs text-white/70 mb-2 uppercase ml-6 ">
                SUGGESTION
              </div>
              <div className="space-y-2">
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer ">
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
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{email || "Loading..."}</div>
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
