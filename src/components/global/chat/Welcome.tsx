"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import { getThemeColors } from "@/lib/constant";
import axios from "axios";

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
      const response = await axios.get("http://localhost:8080/userName", {
        withCredentials: true,
      });

      let data: UserData;

      // If response is a string
      if (typeof response.data === "string") {
        data = { username: response.data.trim() };
      } 
      // If response is an object with username property
      else if (typeof response.data === "object" && response.data !== null) {
        if ("username" in response.data) {
          data = response.data as UserData;
        } else {
          // Try to get the first value in the object
          const firstValue = Object.values(response.data)[0];
          if (typeof firstValue === "string") {
            data = { username: firstValue };
          } else {
            throw new Error("Invalid data format");
          }
        }
      } else {
        throw new Error("Invalid data format");
      }

      setUserData(data);
    } catch (err) {
      // Handle 401 unauthorized separately
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setUserData(null);
        return;
      }

      const errorMessage = axios.isAxiosError(err) 
        ? `Failed to fetch username: ${err.message}`
        : "Error fetching username";
      
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