"use client"
import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from "next-themes";
import { getThemeColors } from '@/lib/constant';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('userLogin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  
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
  
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/userLogin', {
        email,
        password
      });
      
      // Handle successful login
      console.log('User login successful:', response.data);
      
      // Redirect to user dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/adminLogin', {
        email,
        password
      });
      
      // Handle successful admin login
      console.log('Admin login successful:', response.data);
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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

      {/* Right Side - Login Tabs */}
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
                onClick={() => setActiveTab('userLogin')}
                className={`py-3 font-medium ${
                  activeTab === 'userLogin' 
                    ? `bg-blue-500 text-white` 
                    : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                User Login
              </button>
              <button
                onClick={() => setActiveTab('adminLogin')}
                className={`py-3 font-medium ${
                  activeTab === 'adminLogin' 
                    ? `bg-blue-500 text-white` 
                    : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Admin Login
              </button>
            </div>

            {activeTab === 'userLogin' ? (
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? '' : 'shadow-lg'}`}>
                {/* User Login Form */}
                <div className="text-center pb-4">
                  <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User Login</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Log in to continue to SuperNova Bot
                  </p>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
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
                {/* Admin Login Form */}
                <div className="text-center pb-4">
                  <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Login</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Log in to access admin controls
                  </p>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="admin-email" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      id="admin-email"
                      type="email"
                      placeholder="Enter your email"
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
                    <label htmlFor="admin-password" className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <div className="relative">
                      <input
                        id="admin-password"
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
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? "Logging in..." : "Admin Login"}
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