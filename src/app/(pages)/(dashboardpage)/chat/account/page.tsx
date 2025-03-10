"use client";

import React, { useState } from "react";
import { ChevronRight, LogOut, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditProfile from "@/components/global/account/page"; // Make sure path matches your file structure

const MyAccount = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const menuItems = [
    { title: "Security", icon: "🔒" },
    { title: "Data Controls", icon: "📊" },
    { title: "Help Center", icon: "❓" },
    { title: "Terms of Use", icon: "📄" },
    { title: "Privacy Policy", icon: "🔐" },
    { title: "Licenses", icon: "📝" },
    { title: "SuperNova AI Chatbot", icon: "🤖", version: "v1.0" },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear any local storage items if you're using them
        localStorage.clear();
        // Clear any session storage items
        sessionStorage.clear();
        // Redirect to auth page
        window.location.href = "/auth";
      } else {
        throw new Error(
          `Logout failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally show an error message to the user
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-lg font-semibold mb-6">My Account</h1>

        <div className="flex gap-6">
          {/* Left Column */}
          <div className="w-1/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-[#4E6BF9] text-white p-6 rounded-2xl">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src="/1.jpeg"
                  alt="David Sorlotol"
                  className="w-24 h-24 rounded-full"
                />
                <div className="text-center">
                  <h2 className="text-xl font-medium">David Sorlotol</h2>
                  <p className="text-sm text-blue-100">
                    davidsorlotol@gmail.com
                  </p>
                </div>
                <button
                  className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-all"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Premium Card */}
            <div className="bg-[#d9def1] p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#4E6BF9] rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <h3 className="font-medium mb-1">Upgrade to Premium</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enjoy all benefits with no restriction
              </p>
              <button className="w-full bg-[#4E6BF9] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all">
                Try SuperNova Premium
              </button>
            </div>
          </div>

          {/* Right Column Wrapped Inside a Gray Card */}
          <div className="w-2/3 bg-gray-200 rounded-2xl p-6 shadow-md">
            {/* App Settings */}
            <div className="mb-6">
              <h3 className="text-xs text-gray-500 font-medium mb-2">App</h3>
              <div className="space-y-1">
                {menuItems.slice(0, 2).map((item) => (
                  <button
                    key={item.title}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-300 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                ))}

                {/* Theme Selector with ShadCN Select */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎨</span>
                    <span className="text-sm">Theme</span>
                  </div>
                  <Select>
                    <SelectTrigger className="w-28 text-sm border rounded-md px-3 py-1">
                      <SelectValue placeholder="Light" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-6">
              <h3 className="text-xs text-gray-500 font-medium mb-2">About</h3>
              <div className="space-y-1">
                {menuItems.slice(2).map((item) => (
                  <button
                    key={item.title}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-300 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.version && (
                        <span className="text-xs text-gray-500">
                          {item.version}
                        </span>
                      )}
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="w-full p-3 text-red-500 hover:bg-gray-300 rounded-lg transition-all flex items-center gap-3"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-gray-200/80 flex items-center justify-center z-50">
          <div className="relative">
            <EditProfile onClose={() => setIsEditProfileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default MyAccount;
