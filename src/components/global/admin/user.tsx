"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  UserPlus, 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserManagement = () => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  
  const [newUser, setNewUser] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    role_name: "", 
    team_name: "" 
  });

  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch users, roles and teams when component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch users, roles and teams in parallel
      const [usersResponse, rolesResponse, teamsResponse] = await Promise.all([
        axios.get("http://localhost:8080/getAllUsers"),
        axios.get("http://localhost:8080/getRoles"),
        axios.get("http://localhost:8080/getTeams")
      ]);
      
      // Process the user data to normalize field names
      const processedUsers = usersResponse.data.map(user => {
        // Create a normalized user object
        return {
          id: user.id || user.userId || user._id,
          firstName: user.firstName || user.first_name || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.last_name || (user.name?.split(' ').slice(1).join(' ')) || '',
          email: user.email || '',
          role: user.role || user.role_name || '',
          team: user.team || user.team_name || ''
        };
      });
      
      setUsers(processedUsers);
      setRoles(rolesResponse.data);
      setTeams(teamsResponse.data);
      
      console.log("Processed users:", processedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Show toast notification for the error
      toast.error("Error Loading Data", {
        description: "Failed to load users, roles, or teams. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    
    try {
      // Call the API to add a new user
      await axios.post("http://localhost:8080/addUser", newUser);
      
      // Refresh the data
      await fetchAllData();
      
      // Show success toast
      const fullName = `${newUser.firstName} ${newUser.lastName}`;
      toast.success("User Added Successfully", {
        description: `${fullName} has been added to the system.`,
        duration: 3000,
      });
      
      // Reset form and close it
      setNewUser({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        password: "", 
        role_name: "", 
        team_name: "" 
      });
      setShowAddUserForm(false);
    } catch (error) {
      console.error("Error adding user:", error);
      const errorMessage = error.response?.data?.message || "Failed to add user. Please try again.";
      setFormError(errorMessage);
      
      // Show error toast
      toast.error("Error Adding User", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleShowAddUserForm = () => {
    setShowAddUserForm(true);
    // Show toast when form is opened
    toast("Add New User", {
      description: "Please fill in all required fields.",
      duration: 3000,
    });
  };

  // Helper function to get team background color
  const getTeamColor = (teamName) => {
    if (!teamName) return 'bg-gray-100 text-gray-800';
    
    // Simple hash function to generate consistent colors for teams
    const hash = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const colors = [
      'bg-blue-100 text-blue-800', 
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800'
    ];
    
    return colors[hash % colors.length];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleShowAddUserForm} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {showAddUserForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                {formError}
              </div>
            )}
            <form onSubmit={handleAddUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={newUser.firstName} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={newUser.lastName} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={newUser.email} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={newUser.password} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select 
                    name="role_name" 
                    value={newUser.role_name} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Team</label>
                  <select 
                    name="team_name" 
                    value={newUser.team_name} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a team</option>
                    {teams.map((team, index) => (
                      <option key={index} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddUserForm(false);
                  }} 
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Adding User...' : 'Add User'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoadingUsers ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No users found. Add a new user to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {`${user.firstName} ${user.lastName}`.trim() || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-gray-500">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getTeamColor(user.team)}`}>
                          {user.team || 'No Team'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            toast("User Options", {
                              description: `Options for ${user.firstName} will be available soon.`,
                              duration: 3000,
                            });
                          }}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;