import React from "react";
import { MessageSquare, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProjectModal = ({
  isOpen,
  onClose,
  onCreateNew,
  projects,
  onAddToProject,
}) => {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // Add create project logic here
    setIsCreateOpen(false);
    onClose();
  };

  // Create Project Dialog
  const CreateProjectDialog = () => (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Create New Project</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsCreateOpen(false)}
            />
          </div>
        </DialogHeader>

        <form onSubmit={handleCreateSubmit}>
          <div className="mt-4">
            <div className="border-2 border-dashed rounded-lg p-8 mb-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-blue-600">+</span>
              </div>
              <p className="text-sm text-gray-500">
                Drag & Drop you image here,
                <br />
                or you can <span className="text-blue-600">browse</span> instead
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="Enter project title" required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  className="resize-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Add to Project</DialogTitle>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose} />
          </DialogHeader>

          <div className="flex items-center justify-between mb-4">
            {/* <span>Add to Project</span> */}
            <Button
              variant="link"
              className="text-blue-600 p-0"
              onClick={() => {
                onClose();
                setIsCreateOpen(true);
              }}
            >
              + Create New Project
            </Button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{project.chatCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span>{project.promptCount}</span>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onAddToProject(project.id)}
                  >
                    +Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <CreateProjectDialog />
    </>
  );
};

export default ProjectModal;
