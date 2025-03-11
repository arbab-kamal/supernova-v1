"use client";
import React from "react";
import {
  Moon,
  Menu,
  Bot,
  FileText,
  GitBranch,
  Info,
  Globe,
  Trash2,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { getThemeColors } from "@/lib/constant";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import BookmarkModal from "./bookmark";
import ProjectModal from "./project";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ArticleNavbar = () => {
  const { setTheme, theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const currentProject = useSelector(selectCurrentProject);

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between px-4 py-3 w-full border-b"
        style={{ 
          backgroundColor: colors.bg.main, 
          borderColor: colors.border 
        }}
      >
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-lg" 
            style={{ 
              color: colors.text.primary,
              "&:hover": { backgroundColor: colors.bg.tertiary }
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger 
              className="flex items-center gap-2 px-3 py-2 border rounded-md"
              style={{ 
                color: colors.text.primary,
                borderColor: colors.border,
                "&:hover": { backgroundColor: colors.bg.tertiary }
              }}
            >
              <Globe className="w-5 h-5" />
              <span>Language</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem>🇬🇧 English</DropdownMenuItem>
              <DropdownMenuItem>🇸🇦 العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Current Project Display - now part of the right side, before bookmark */}
          {currentProject && (
            <div className="flex items-center mr-2 border-r pr-3" style={{ borderColor: colors.border }}>
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-2">
                {currentProject.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium" style={{ color: colors.text.primary }}>
                  {currentProject.title}
                </h3>
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  Project
                </p>
              </div>
            </div>
          )}
          
          <BookmarkModal 
            projectInfo={currentProject ? {
              id: currentProject.id,
              title: currentProject.title
            } : null}
          />
          {/* <ProjectModal /> */}

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                style={{ 
                  borderColor: colors.border,
                  color: colors.text.primary
                }}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger 
              className="p-2 rounded-lg"
              style={{ 
                color: colors.text.secondary,
                "&:hover": { backgroundColor: colors.bg.tertiary }
              }}
            >
              <Menu className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-48 shadow-md border rounded-lg mt-2"
              style={{ 
                backgroundColor: colors.bg.main,
                borderColor: colors.border 
              }}
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/chat/agent"
                  className="flex items-center px-4 py-2 text-sm"
                  style={{ 
                    color: colors.text.primary,
                    "&:hover": { backgroundColor: colors.bg.tertiary }
                  }}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Agent
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/documents"
                  className="flex items-center px-4 py-2 text-sm"
                  style={{ 
                    color: colors.text.primary,
                    "&:hover": { backgroundColor: colors.bg.tertiary }
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/workflow"
                  className="flex items-center px-4 py-2 text-sm"
                  style={{ 
                    color: colors.text.primary,
                    "&:hover": { backgroundColor: colors.bg.tertiary }
                  }}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  AI Workflow
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/about"
                  className="flex items-center px-4 py-2 text-sm"
                  style={{ 
                    color: colors.text.primary,
                    "&:hover": { backgroundColor: colors.bg.tertiary }
                  }}
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Button (Red Color) */}
          <button 
            className="p-2 rounded-lg"
            style={{ 
              color: "#EF4444", // Always red regardless of theme
              "&:hover": { backgroundColor: isDarkMode ? "#450a0a" : "#fee2e2" }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleNavbar;