"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

interface BookmarkItem {
  title: string;
  desc: string;
  icon: string;
  date?: string;
  type: "category" | "conversation";
  section: "category" | "conversation" | "conversation-bookmark";
}

type FilterType = "all" | "category" | "conversation";

const BookmarkInterface: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const bookmarkItems: BookmarkItem[] = [
    {
      type: "category",
      section: "category",
      title: "Technical Documentation",
      desc: "Generate comprehensive technical documentation for your projects",
      icon: "📘",
    },
    {
      type: "category",
      section: "category",
      title: "Code Snippets",
      desc: "Create reusable code examples across multiple languages",
      icon: "💻",
    },
    {
      type: "category",
      section: "category",
      title: "System Architecture",
      desc: "Design patterns and architectural solutions for complex systems",
      icon: "🏗️",
    },
    {
      type: "category",
      section: "category",
      title: "DevOps Workflows",
      desc: "CI/CD pipelines and infrastructure as code templates",
      icon: "🔄",
    },
    {
      type: "category",
      section: "category",
      title: "API Design",
      desc: "Best practices for creating robust and scalable APIs",
      icon: "🔌",
    },
    {
      type: "conversation",
      section: "conversation",
      title: "Microservices Architecture",
      desc: "Comprehensive breakdown of microservices design patterns and implementation strategies",
      icon: "🧩",
      date: "24 Aug 2023",
    },
    {
      type: "conversation",
      section: "conversation",
      title: "Kubernetes Deployment",
      desc: "Step-by-step guide for containerizing applications with Kubernetes",
      icon: "🐳",
      date: "24 Aug 2023",
    },
    {
      type: "conversation",
      section: "conversation",
      title: "GraphQL vs REST",
      desc: "Detailed comparison with performance benchmarks and use cases",
      icon: "⚡",
      date: "24 Aug 2023",
    },
    {
      type: "conversation",
      section: "conversation-bookmark",
      title: "Tech Risk Documentation",
      desc: "Created a structured report on potential risks in microservices architecture",
      icon: "🛡️",
      date: "24 Aug 2023",
    },
  ];

  const filteredItems = bookmarkItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "category":
        return item.section === "category";
      case "conversation":
        return (
          item.section === "conversation" ||
          item.section === "conversation-bookmark"
        );
      default:
        return true;
    }
  });

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (item.section === "category") {
        acc.category = [...(acc.category || []), item];
      } else if (item.section === "conversation") {
        acc.conversation = [...(acc.conversation || []), item];
      } else if (item.section === "conversation-bookmark") {
        acc.conversationBookmark = [...(acc.conversationBookmark || []), item];
      }
      return acc;
    },
    {} as {
      category?: BookmarkItem[];
      conversation?: BookmarkItem[];
      conversationBookmark?: BookmarkItem[];
    }
  );

  const BookmarkCard: React.FC<{ item: BookmarkItem }> = ({ item }) => (
    <div className="bg-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-2xl mb-3 inline-block">{item.icon}</span>
          <h3 className="font-medium text-sm mb-1">{item.title}</h3>
          <p className="text-gray-500 text-sm">{item.desc}</p>
          {item.date && (
            <div className="text-xs text-gray-400 mt-2 flex items-center">
              <span>{item.date}</span>
            </div>
          )}
        </div>
        <button className="text-blue-500 hover:text-blue-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[90%] mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-4">Bookmark</h1>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex border rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-2 border-r hover:bg-blue-50 ${
                  activeFilter === "all"
                    ? "text-blue-600 font-medium"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("category")}
                className={`px-6 py-2 border-r hover:bg-blue-50 ${
                  activeFilter === "category"
                    ? "text-blue-600 font-medium"
                    : "text-gray-500 bg-gray-100"
                }`}
              >
                Category
              </button>
              <button
                onClick={() => setActiveFilter("conversation")}
                className={`px-6 py-2 hover:bg-blue-50 ${
                  activeFilter === "conversation"
                    ? "text-blue-600 font-medium"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Conversation
              </button>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {(activeFilter === "all" || activeFilter === "category") &&
          groupedItems.category && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-gray-600">
                  Prompt Asset Category Bookmark
                </h2>
                <span className="text-xs text-gray-400">
                  {groupedItems.category.length} items found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedItems.category.map((item, index) => (
                  <BookmarkCard key={`category-${index}`} item={item} />
                ))}
              </div>
            </div>
          )}

        {/* Conversations Section */}
        {(activeFilter === "all" || activeFilter === "conversation") &&
          groupedItems.conversation && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-gray-600">
                  Prompt Asset Conversation Bookmark
                </h2>
                <span className="text-xs text-gray-400">
                  {groupedItems.conversation.length} items found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedItems.conversation.map((item, index) => (
                  <BookmarkCard key={`conversation-${index}`} item={item} />
                ))}
              </div>
            </div>
          )}

        {/* Conversation Bookmark Section */}
        {(activeFilter === "all" || activeFilter === "conversation") &&
          groupedItems.conversationBookmark && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-gray-600">Conversation Bookmark</h2>
                <span className="text-xs text-gray-400">
                  {groupedItems.conversationBookmark.length} items found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedItems.conversationBookmark.map((item, index) => (
                  <BookmarkCard key={`bookmark-${index}`} item={item} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default BookmarkInterface;
