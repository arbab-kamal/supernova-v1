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
    router.push('/dashboard');
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
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-2">
          {project.title.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-medium">{project.title}</h3>
          <p className="text-xs text-gray-500">Project</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;