"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Folder,
  Search,
  Square,
  CheckSquare,
  ArrowLeft,
  Trash2,
  X,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import MultiplePDFUploader from "@/components/global/sidebar/pdfuploader";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  modified: string;
  projectId?: string;
}

interface Project {
  id: string;
  title: string;
}

const DocumentListPage = () => {
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:8080/getProjects");
      
      const formattedProjects = response.data.map((projectTitle: string, index: number) => ({
        id: String(index + 1),
        title: projectTitle,
      }));
      
      setProjects(formattedProjects);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(errorMessage);
      console.error("Error fetching projects:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch files for a specific project
  const fetchProjectFiles = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8080/projectFiles?projectId=${projectId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project files");
      }

      const fileNames = await response.json();
      const transformedDocs = fileNames.map(
        (fileName: string, index: number) => ({
          id: index + 1,
          title: fileName,
          type: fileName.split(".").pop()?.toUpperCase() || "UNKNOWN",
          size: "N/A",
          modified: new Date().toISOString().split("T")[0],
          projectId,
        })
      );

      setDocuments(transformedDocs);
      setSelectedDocs(new Set());
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch project files";
      setError(errorMessage);
      console.error("Error fetching project files:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete a single file
  const deleteFile = async (fileName: string, projectId?: string) => {
    if (!projectId) return;
    
    try {
      const response = await fetch(
        `http://localhost:8080/deleteProjectFile?fileName=${encodeURIComponent(fileName)}&projectId=${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete ${fileName}`);
      }

      await fetchProjectFiles(projectId); // Refresh the file list
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete file";
      setError(errorMessage);
      console.error("Error deleting file:", errorMessage);
    }
  };

  // Delete multiple selected files
  const deleteSelectedFiles = async () => {
    if (!selectedProject) return;
    
    try {
      const selectedFileNames = Array.from(selectedDocs)
        .map((docId) => documents.find((doc) => doc.id === docId))
        .filter(Boolean);

      for (const doc of selectedFileNames) {
        if (doc && doc.title && doc.projectId) {
          await deleteFile(doc.title, doc.projectId);
        }
      }

      setSelectedDocs(new Set()); // Clear selection after deletion
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete selected files";
      setError(errorMessage);
      console.error("Error deleting selected files:", errorMessage);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleDocument = (docId: number) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const toggleAll = () => {
    if (selectedDocs.size === documents.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documents.map((doc) => doc.id)));
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    fetchProjectFiles(project.id);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setDocuments([]);
    setSelectedDocs(new Set());
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Link href={"/chat"}>
              <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Return to Chat</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleBackToProjects} className="cursor-pointer">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {selectedProject && (
                  <BreadcrumbItem>
                    <BreadcrumbLink className="font-medium">
                      {selectedProject.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </Breadcrumb>
            </div>
            <div className="flex items-center space-x-4">
              {selectedProject && (
                <>
                  <MultiplePDFUploader 
                    onUploadComplete={() => fetchProjectFiles(selectedProject.id)}
                    projectId={selectedProject.id}
                  />

                  {selectedDocs.size > 0 && (
                    <Button 
                      onClick={deleteSelectedFiles}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Selected</span>
                    </Button>
                  )}
                </>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading...
          </div>
        ) : (
          <>
            {!selectedProject ? (
              // Project List View
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {projects.map((project) => (
                    <Card 
                      key={project.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : (
              // Document List View
              <section>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <div className="flex items-center">
                            <button
                              onClick={toggleAll}
                              className="mr-3 focus:outline-none"
                            >
                              {selectedDocs.size === documents.length && documents.length > 0 ? (
                                <CheckSquare className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Modified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No documents found in this project. Upload a PDF to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDocuments.map((doc) => (
                          <TableRow key={doc.id} className="hover:bg-gray-50">
                            <TableCell>
                              <button
                                onClick={() => toggleDocument(doc.id)}
                                className="focus:outline-none"
                              >
                                {selectedDocs.has(doc.id) ? (
                                  <CheckSquare className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Square className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-sm font-medium">
                                  {doc.title}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                {doc.type}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-500">
                                {doc.size}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-500">
                                {doc.modified}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => deleteFile(doc.title, doc.projectId)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DocumentListPage;