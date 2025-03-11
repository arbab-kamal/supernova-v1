"use client";
import React from "react";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PromptAssistPage = () => {
  const categories = [
    {
      title: "Riskgpt",
      items: [
        {
          icon: "⚠️",
          name: "Risk Analysis",
          description:
            "Analyze potential risks in your projects and provide mitigation strategies.",
        },
        {
          icon: "📊",
          name: "Risk Assessment",
          description:
            "Evaluate and assess the risk factors impacting your business.",
        },
        {
          icon: "🔒",
          name: "Risk Mitigation",
          description: "Generate strategies to mitigate identified risks.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back to Chat Button */}
      <Link href={"/chat"}>
        <button
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => console.log("Navigate back to chat")}
        >
          <ArrowLeft size={20} />
          <span>Back to Chat</span>
        </button>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">All AI AGENT</h1>
        <p className="text-gray-600">
          AI prompts assist you can here to help you about several questions
        </p>

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      {categories.map((category) => (
        <div key={category.title} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.items.map((item) => (
              <div
                key={item.name}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptAssistPage;
