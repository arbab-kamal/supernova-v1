"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, ArrowLeft, Save } from "lucide-react";
import ChatBox from "../chat/index";
import ProjectModal from "./modal";
import axios from "axios";
import { toast } from "sonner";

const ProjectDashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch projects from API on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/getProjects");
      
      // Transform the string list into objects your component can use
      const formattedProjects = response.data.map((projectTitle, index) => ({
        id: String(index + 1),
        title: projectTitle,
        // Default values for other fields
        chatCount: 0,
        promptCount: 0,
        // You can add other default properties here
      }));
      
      setProjects(formattedProjects);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again.");
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  const handleAddToProject = (projectId) => {
    // Add your save logic here
    console.log("Adding to project:", projectId);
    setIsAddToProjectOpen(false);
  };

  const handleCreateProject = async (newProject) => {
    try {
      // Make POST request to create project API
      const response = await axios.post("http://localhost:8080/createProject", {
        projectTitle: newProject.title
      });
      
      // Refresh the projects list after creating a new one
      fetchProjects();
      
      // Show success toast
      toast.success("Project created successfully!");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      // Show error toast
      toast.error("Failed to create project. Please try again.");
    }
  };

  if (selectedProject) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">{selectedProject.title}</h1>
          </div>
          <Button
            onClick={() => setIsAddToProjectOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save to Project
          </Button>
        </div>
        <ChatBox projectId={selectedProject.id} />
        <ProjectModal
          isOpen={isAddToProjectOpen}
          onClose={() => setIsAddToProjectOpen(false)}
          projects={projects}
          onAddToProject={handleAddToProject}
        />
      </div>
    );
  }

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
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No projects found. Create your first project to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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
      
      {/* Add the modal for creating new projects */}
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