"use client"
import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from "next-themes";
import { getThemeColors } from '@/lib/constant';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Replace isDarkMode state with next-themes
  const { theme, setTheme } = useTheme();
  
  // useEffect to handle mounting (important for avoiding hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If not mounted yet, return early to avoid hydration errors
  if (!mounted) {
    return null;
  }
  
  const isDarkMode = theme === 'dark';
  
  // Get colors from our constants file
  const colors = getThemeColors(isDarkMode);
  
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Left Side - Hero Section */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${colors.primary.gradient} p-12 flex-col justify-between`}>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">SuperNova </span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Say Hello to SuperNova
          </h1>
          <p className="text-xl text-white/90">
            SuperNova is always ready to chat with you and answer your questions.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                💬
              </div>
              <div>
                <h3 className="font-semibold">Ask Anything</h3>
                <p className="text-white/80">
                  Just type your message in the chatbox
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-white/80">
                  Get instant responses to your queries
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-white/80">
          © 2025 SuperNova . All rights reserved.
        </div>
      </div>

      {/* Right Side - Login/Signup Tabs */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-4">
            {/* You could add a theme toggle here if needed */}
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-xl font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SuperNova</span>
            </div>
          </div>
          
          <div className="w-full">
            <div className="grid w-full grid-cols-2 mb-6 rounded-md overflow-hidden">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-3 font-medium ${
                  activeTab === 'login' 
                    ? `bg-blue-500 text-white` 
                    : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`py-3 font-medium ${
                  activeTab === 'signup' 
                    ? `bg-blue-500 text-white` 
                    : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Signup
              </button>
            </div>

            {activeTab === 'login' ? (
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? '' : 'shadow-lg'}`}>
                {/* Login Form Content (unchanged) */}
                <div className="text-center pb-4">
                  <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Log in to continue to SuperNova Bot
                  </p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="login-username" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                    <input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`w-full p-3 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="login-password" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full p-3 rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                          <Eye className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                      </button>
                    </div>
                    <p className={`text-sm text-right cursor-pointer hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Forgot password?
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </form>
                
                
              </div>
            ) : (
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? '' : 'shadow-lg'}`}>
                {/* Signup Form Content (unchanged) */}
                <div className="text-center pb-4">
                  <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create a New Account</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Please put your information below to create a new account for using this app.
                  </p>
                </div>
                
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={`w-full p-3 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full p-3 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-username" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                    <input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`w-full p-3 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full p-3 rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                          <Eye className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`w-full p-3 rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                          <Eye className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? "Creating Account..." : "Register"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;