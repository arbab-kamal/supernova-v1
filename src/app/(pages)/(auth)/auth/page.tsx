"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export const AuthTabs = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userName: username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      toast.success("Logged in successfully");
      router.push("/chat");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !username || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          emailId: email,
          userName: username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      toast.success("Account created successfully");
      router.push("/chat");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 p-12 flex-col justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">SuperNova</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Welcome Back to SuperNova
          </h1>
          <p className="text-xl text-white/90">
            Continue your journey with AI-powered conversations and discover new
            possibilities.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                💡
              </div>
              <div>
                <h3 className="font-semibold">Smart Conversations</h3>
                <p className="text-white/80">
                  Engage with advanced AI technology
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
          © 2025 SuperNova. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login/Signup Tabs */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-200">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-none shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-500">
                    Log in to continue to SuperNova
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-sm text-right text-gray-600 hover:underline cursor-pointer">
                        Forgot password?
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-none shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription className="text-gray-500">
                    Sign up to start using SuperNova
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        I agree to Supernova AI Chatbot License Agreement,
                        Terms, & Privacy Policy
                      </label>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4   bg-blue-500 hover:bg-blue-600"
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
