import React from "react";
import { Search, Music, ArrowRight, Computer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HistoryPage = () => {
  const historyData = {
    today: [
      {
        title: "Debugging AI Model",
        description: "Resolved accuracy issues in the latest LLM deployment.",
      },
    ],
    yesterday: [
      {
        title: "Database Optimization",
        description: "Improved query performance for high-traffic endpoints.",
      },
      {
        title: "Security Audit",
        description: "Conducted a security check on API authentication flows.",
      },
      {
        title: "Frontend Enhancement",
        description: "Refactored UI components for better reusability.",
      },
    ],
    "12 Feb": [
      {
        title: "Cloud Deployment",
        description: "Deployed backend services to AWS Lambda.",
      },
      {
        title: "API Rate Limiting",
        description: "Implemented rate limiting to prevent abuse.",
      },
      {
        title: "AI Model Training",
        description: "Trained a new dataset for chatbot responses.",
      },
      {
        title: "Code Review",
        description: "Reviewed PRs and optimized state management in Redux.",
      },
    ],
    "11 Feb": [
      {
        title: "Bug Fixing",
        description: "Patched memory leak in the real-time data pipeline.",
      },
    ],
  };

  const getGridClass = (itemCount) => {
    if (itemCount === 1) return "grid-cols-1";
    if (itemCount <= 3) return "grid-cols-3";
    return "grid-cols-3";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">History</h1>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {Object.entries(historyData).map(([date, items]) => (
        <div key={date} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{date}</h2>
          <div className={`grid ${getGridClass(items.length)} gap-4`}>
            {items.map((item, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-gray-50 
                  ${items.length === 1 ? "col-span-full" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Computer className="h-5 w-5 text-blue-600" />
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
    </div>
  );
};

export default HistoryPage;
