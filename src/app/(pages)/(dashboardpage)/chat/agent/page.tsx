"use client";
import React from "react";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PromptAssistPage = () => {
  const categories = [
    {
      title: "Writing",
      items: [
        {
          icon: "📝",
          name: "Articles",
          description: "Generate helpful articles on any topics you want",
        },
        {
          icon: "📚",
          name: "Academic Writer",
          description: "Create academic text in any genre you love",
        },
        {
          icon: "🔄",
          name: "Translate",
          description: "Translate between one language to another",
        },
        {
          icon: "🔍",
          name: "Plagiarism Check",
          description: "Compare analysis with any genre that you love",
        },
      ],
    },
    {
      title: "Creative",
      items: [
        {
          icon: "📖",
          name: "Storyteller",
          description: "Generate stories from your idea or prompt",
        },
        {
          icon: "🎵",
          name: "Songs/Lyrics",
          description: "Generate song ideas with any genre",
        },
        {
          icon: "📜",
          name: "Poems",
          description: "Generate poems in different styles",
        },
        {
          icon: "🎬",
          name: "Movie Script",
          description: "Generate scripts for making movies",
        },
      ],
    },
    {
      title: "Business",
      items: [
        {
          icon: "✉️",
          name: "Email Writer",
          description: "Generate template for email writing, etc",
        },
        {
          icon: "📄",
          name: "Create CV",
          description: "Create the best CV templates for you",
        },
        {
          icon: "📢",
          name: "Advertisements",
          description:
            "Generate promotional text for products, services, brands, etc",
        },
        {
          icon: "💼",
          name: "Job Post",
          description: "Write ideal job descriptions for posting",
        },
      ],
    },
    {
      title: "Social Media",
      items: [
        {
          icon: "📸",
          name: "Instagram",
          description: "Generate impactful captions to attract audience",
        },
        {
          icon: "💼",
          name: "LinkedIn",
          description: "Create powerful post based on your experience",
        },
        {
          icon: "🐦",
          name: "X",
          description: "Write ideal job descriptions for posting",
        },
        {
          icon: "🎵",
          name: "TikTok",
          description: "Generate captioning and viral captions for TikTok",
        },
      ],
    },
    {
      title: "Developer",
      items: [
        {
          icon: "💻",
          name: "Write Code",
          description: "Generate beautiful snippets of helpful code",
        },
        {
          icon: "🔍",
          name: "Explain Code",
          description: "Decode and see websites variety step by step",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          icon: "💭",
          name: "Create Conversation",
          description: "Create conversation template of two or more people",
        },
        {
          icon: "🍳",
          name: "Food Recipes",
          description: "Get any cooking recipes for food and dishes",
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
