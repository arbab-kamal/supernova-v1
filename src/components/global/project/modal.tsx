"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  projects, 
  onAddToProject, 
  onCreateProject 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const modalRef = useRef(null);

  // Reset form data when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ title: "", description: "" });
      setHasChanges(false);
    }
  }, [isOpen]);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && isOpen) {
        if (hasChanges) {
          // Save before closing if there are changes
          handleSave();
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, hasChanges, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onCreateProject) {
      onCreateProject(formData);
    } else if (onAddToProject && projects) {
      // Assuming we're selecting the first project if this is a "Save to Project" modal
      onAddToProject(projects[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {onCreateProject ? "Create New Project" : "Save to Project"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {onCreateProject ? (
          // Create project form
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter project title"
              />
            </div>
          </div>
        ) : (
          // Save to project selection
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select a project to save to:</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {projects && projects.map((project) => (
                <div 
                  key={project.id}
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => onAddToProject(project.id)}
                >
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleSave}
          >
            {onCreateProject ? "Create Project" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;