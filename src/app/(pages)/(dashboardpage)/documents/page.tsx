"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Square,
  CheckSquare,
  ArrowLeft,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import MultiplePDFUploader from "@/components/global/sidebar/pdfuploader";
import ProjectHeader from "@/components/global/project/projecttitle";

// Shadcn UI Table Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  modified: string;
}

const DocumentListPage = () => {
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<
    { id: number; name: string; count: number }[]
  >([]);
  
  // Get the selected project from Redux store
  const selectedProject = useSelector(selectCurrentProject);

  // Fetch files from backend using axios
  const fetchFiles = async () => {
    if (!selectedProject) {
      setError("No project selected");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // If selectedProject is an object with a name property
      const projectName = selectedProject?.name || selectedProject;
      const response = await axios.get(
          `http://localhost:8080/getDocuments?projectName=${projectName}`, 
        { withCredentials: true }
    );
      
      // Assuming the response data structure matches what we need
      const fileNames = response.data;
      
      const transformedDocs = fileNames.map(
        (fileName: string, index: number) => ({
          id: index + 1,
          title: fileName,
          type: fileName.split(".").pop()?.toUpperCase() || "UNKNOWN",
          size: "N/A",
          modified: new Date().toISOString().split("T")[0],
        })
      );

      setDocuments(transformedDocs);

      const fileTypes = new Set(transformedDocs.map((doc) => doc.type));
      const folderData = Array.from(fileTypes).map((type, index) => ({
        id: index + 1,
        name: type === "PDF" ? "PDF Documents" : `${type} Files`,
        count: transformedDocs.filter((doc) => doc.type === type).length,
      }));

      setFolders(folderData);
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message
          : "Failed to fetch files";
      setError(errorMessage);
      console.error("Error fetching files:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete a single file
  const deleteFile = async (fileName: string) => {
    if (!selectedProject) {
      setError("No project selected");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/delete`, 
        { 
          params: { 
            fileName: fileName,
            projectName: selectedProject 
          },
          withCredentials: true 
        }
      );

      await fetchFiles(); // Refresh the file list
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message
          : "Failed to delete file";
      setError(errorMessage);
      console.error("Error deleting file:", errorMessage);
    }
  };

  // Delete multiple selected files
  const deleteSelectedFiles = async () => {
    try {
      const selectedFileNames = Array.from(selectedDocs)
        .map((docId) => documents.find((doc) => doc.id === docId)?.title)
        .filter(Boolean);

      for (const fileName of selectedFileNames) {
        if (fileName) {
          await deleteFile(fileName);
        }
      }

      setSelectedDocs(new Set()); // Clear selection after deletion
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message
          : "Failed to delete selected files";
      setError(errorMessage);
      console.error("Error deleting selected files:", errorMessage);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedProject]); // Re-fetch when selected project changes

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

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Link href={"/chat"}>
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Return to Chat</span>
              </button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedProject ? `${selectedProject} Documents` : "Documents"}
            </h1>
            <div className="flex items-center space-x-4">
              <MultiplePDFUploader 
                onUploadComplete={fetchFiles} 
                projectName={selectedProject}
              />

              {selectedDocs.size > 0 && (
                <button
                  onClick={deleteSelectedFiles}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected</span>
                </button>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!selectedProject && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
            No project selected. Please select a project to view documents.
          </div>
        )}
        
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
            Loading documents...
          </div>
        ) : (
          <>
            <section className="mb-8">
              <ProjectHeader />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Documents
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <button
                              onClick={toggleAll}
                              className="mr-3 focus:outline-none"
                              disabled={documents.length === 0}
                            >
                              {selectedDocs.size === documents.length && documents.length > 0 ? (
                                <CheckSquare className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            Name
                          </div>
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modified
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.length > 0 ? (
                        documents.map((doc) => (
                          <TableRow key={doc.id} className="hover:bg-gray-50">
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleDocument(doc.id)}
                                  className="mr-3 focus:outline-none"
                                >
                                  {selectedDocs.has(doc.id) ? (
                                    <CheckSquare className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <Square className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-sm text-gray-900">
                                  {doc.title}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <span className="text-sm text-gray-500 uppercase">
                                {doc.type}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <span className="text-sm text-gray-500">
                                {doc.size}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <span className="text-sm text-gray-500">
                                {doc.modified}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <button
                                onClick={() => deleteFile(doc.title)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            No documents found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default DocumentListPage;