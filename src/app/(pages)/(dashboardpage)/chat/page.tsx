import React from "react";
import ArticleNavbar from "@/components/global/navbar";
import RightSidebar from "@/components/global/sidebar/rightside";
import Chatbox from "@/components/global/chat";

const Chat = () => {
  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 z-10">
          <ArticleNavbar />
        </div>

        {/* Chat Area */}
        <div className="h-screen pt-14 pr-[320px]">
          <Chatbox />
        </div>

        {/* Right Sidebar */}
        <div className="fixed top-14 right-0 bottom-0 w-[320px] border-l border-gray-200">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Chat;
