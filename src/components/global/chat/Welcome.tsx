"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import { getThemeColors } from "@/lib/constant";

interface WelcomeUserProps {
  className?: string;
}

interface UserData {
  username: string;
}

const WelcomeUser: React.FC<WelcomeUserProps> = ({ className = "" }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/userName", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUserData(null);
          return;
        }
        throw new Error(`Failed to fetch username: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      let data: UserData;

      if (contentType?.includes("application/json")) {
        const jsonData = await response.json();
        data = jsonData;
      } else {
        const textData = await response.text();
        data = { username: textData.trim() };
      }

      if (typeof data === "string") {
        setUserData({ username: data });
      } else if (typeof data === "object" && data !== null) {
        if ("username" in data) {
          setUserData(data as UserData);
        } else {
          const firstValue = Object.values(data)[0];
          if (typeof firstValue === "string") {
            setUserData({ username: firstValue });
          } else {
            throw new Error("Invalid data format");
          }
        }
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching username";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: colors.bg.tertiary,
    borderRadius: "0.5rem",
    padding: "1rem",
  };

  if (loading) {
    return (
      <div 
        className={`p-4 rounded-lg ${className}`}
        style={cardStyle}
      >
        <p style={{ color: colors.text.tertiary }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`p-4 rounded-lg ${className}`}
        style={cardStyle}
      >
        <p style={{ color: "#f87171" }}>Error fetching username</p>
      </div>
    );
  }

  return (
    <div 
      className={`p-4 rounded-lg ${className}`}
      style={cardStyle}
    >
      {userData ? (
        <div className="flex items-center gap-3">
          <User 
            className="w-6 h-6" 
            style={{ color: colors.text.secondary }}
          />
          <div>
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Welcome back, {userData.username}!
            </h2>
            <p 
              className="text-sm"
              style={{ color: colors.text.secondary }}
            >
              We&apos;re glad to see you again.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <User 
            className="w-6 h-6" 
            style={{ color: colors.text.secondary }}
          />
          <div>
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Welcome, Guest!
            </h2>
            <p 
              className="text-sm"
              style={{ color: colors.text.secondary }}
            >
              Please log in to access all features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeUser;