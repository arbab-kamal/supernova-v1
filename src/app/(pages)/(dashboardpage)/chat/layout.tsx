"use client";
import React from "react";
import Sidebar from "@/components/global/sidebar";
import { useTheme } from "next-themes";
import { getThemeColors } from "@/lib/constant";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);

  return (
    <div 
      className="flex h-screen"
      style={{ backgroundColor: colors.bg.secondary }}
    >
      {/* Sidebar (Always Present) */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col"
        style={{ backgroundColor: colors.bg.main }}
      >
        {/* Page Content */}
        <div 
          className="flex-1 overflow-auto p-6"
          style={{ color: colors.text.primary }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;