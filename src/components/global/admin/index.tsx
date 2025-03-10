"use client"
import React, { useState } from "react";
import {
  Users,
  Settings,
  Shield,
  BarChart3,
  Bell,
  Database,
  Search,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UserManagement from "./user";

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  
  const adminData = {
    "Active Users": [
      {
        title: "User Management",
        description: "Manage user accounts, roles, and permissions.",
        icon: <Users className="h-5 w-5 text-blue-600" />,
        component: "UserManagement"
      },
      {
        title: "System Settings",
        description: "Configure system-wide preferences and defaults.",
        icon: <Settings className="h-5 w-5 text-blue-600" />
      },
      {
        title: "Security Controls",
        description: "Manage authentication methods and access controls.",
        icon: <Shield className="h-5 w-5 text-blue-600" />
      }
    ],
    "Performance Metrics": [
      {
        title: "Analytics Dashboard",
        description: "View system usage statistics and performance metrics.",
        icon: <BarChart3 className="h-5 w-5 text-blue-600" />
      },
      {
        title: "Notification Center",
        description: "Configure and manage system-wide notifications.",
        icon: <Bell className="h-5 w-5 text-blue-600" />
      }
    ],
    "Data Management": [
      {
        title: "Database Operations",
        description: "Perform backups, manage indexes, and optimize storage.",
        icon: <Database className="h-5 w-5 text-blue-600" />
      }
    ]
  };

  const getGridClass = (itemCount) => {
    if (itemCount === 1) return "grid-cols-1";
    if (itemCount <= 3) return "grid-cols-3";
    return "grid-cols-3";
  };

  const handleCardClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "UserManagement":
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {activeComponent ? (
        <div>
          <button 
            onClick={() => setActiveComponent(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Admin Dashboard
          </button>
          {renderActiveComponent()}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <input
                type="text"
                placeholder="Search admin tools..."
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {Object.entries(adminData).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className={`grid ${getGridClass(items.length)} gap-4`}>
                {items.map((item, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-gray-50
                      ${items.length === 1 ? "col-span-full" : ""}`}
                    onClick={() => handleCardClick(item.component)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {item.icon}
                          </div>
                          <div className="mt-1">
                            <h3 className="font-medium mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminPage;