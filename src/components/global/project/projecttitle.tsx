"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ProjectHeader = () => {
  const project = useSelector(selectCurrentProject);
  const router = useRouter();

  const handleBack = () => {
    router.push('/project');
  };

  if (!project) {
    return null;
  }

  return (
    <div className="flex items-center px-4 py-3 border-b">
      <button 
        onClick={handleBack}
        className="mr-3 text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center space-x-2">
           <h3 className="font-medium">{project.title}</h3>
        <p className="text-xs text-gray-500">Project</p>
    </div>

    </div>
  );
};

export default ProjectHeader;