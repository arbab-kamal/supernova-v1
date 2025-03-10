import React from "react";
import { X, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProjectModal = () => {
  const projects = [
    {
      id: 1,
      name: "Design Studio Copywriting",
      description:
        "This project is for copywriting purpose. Make easier to create copy for client and design.",
      members: 12,
      files: 4,
    },
    {
      id: 2,
      name: "AI Movie Series Project",
      description:
        "This project is for copywriting purpose. Make easier to create copy for client and design.",
      members: 12,
      files: 4,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4" />
          Save to Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add to Project</DialogTitle>
            <button className="text-gray-400 hover:text-gray-500" />
          </div>
        </DialogHeader>
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full justify-start text-blue-600 mb-4"
          >
            + Create New Project
          </Button>
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                  <div>
                    <h3 className="text-sm font-medium">{project.name}</h3>
                    <p className="text-xs text-gray-500">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>👥 {project.members}</span>
                    <span>📄 {project.files}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    +Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
