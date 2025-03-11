"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ProjectModal from "./modal";
import { useDispatch } from "react-redux";
import { setProjects, setSelectedProject } from "@/store/projectSlice";

const ProjectDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [localProjects, setLocalProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/getProjects");
      
      const formattedProjects = response.data.map((projectTitle, index) => ({
        id: String(index + 1),
        title: projectTitle,
        image: "/book.jpg",
        admin: "Admin",
        adminAvatar: "/1.jpeg",
        chatCount: 0,
        promptCount: 0
      }));
      
      setLocalProjects(formattedProjects);
      // Also update Redux store
      dispatch(setProjects(formattedProjects));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again.");
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    // Store the selected project in Redux
    dispatch(setSelectedProject(project));
    // Navigate to the chat page
    router.push(`/chat?projectId=${project.id}&projectTitle=${encodeURIComponent(project.title)}`);
  };

  const handleCreateProject = async (newProject) => {
    try {
      const response = await axios.post("http://localhost:8080/createProject", {
        projectTitle: newProject.title
      });
      
      fetchProjects();
      toast.success("Project created successfully!");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Project</h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Create New Project
        </Button>
      </div>

      <h2 className="text-sm text-gray-600 mb-4">All Projects</h2>

      {loading ? (
        <div className="text-center py-12">Loading projects...</div>
      ) : localProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No projects found. Create your first project to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleProjectClick(project)}
            >
              <img
                src={project.image || "/book.jpg"}
                alt={project.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{project.title}</h3>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu click
                    }}
                  >
                    •••
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={project.adminAvatar || "/1.jpeg"}
                      className="w-6 h-6 rounded-full bg-gray-200"
                    />
                    <span className="text-sm">{project.admin || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">
                        {project.chatCount || 0}
                      </span>
                      <span className="text-gray-400">AI Chat</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">
                        {project.promptCount || 0}
                      </span>
                      <span className="text-gray-400">Prompt Assist</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateProject={handleCreateProject}
        hideDescription={true}
      />
    </div>
  );
};

export default ProjectDashboard;