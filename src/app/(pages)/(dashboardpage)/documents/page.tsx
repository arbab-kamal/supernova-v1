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
} from "lucide-react";
import Link from "next/link";
import MultiplePDFUploader from "@/components/global/sidebar/pdfuploader";

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

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8080/files", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const fileNames = await response.json();
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
        err instanceof Error ? err.message : "Failed to fetch files";
      setError(errorMessage);
      console.error("Error fetching files:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete a single file
  const deleteFile = async (fileName: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/delete?fileName=${encodeURIComponent(fileName)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete ${fileName}`);
      }

      await fetchFiles(); // Refresh the file list
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
        err instanceof Error ? err.message : "Failed to delete selected files";
      setError(errorMessage);
      console.error("Error deleting selected files:", errorMessage);
    }
  };

  useEffect(() => {
    fetchFiles();
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
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <div className="flex items-center space-x-4">
              <MultiplePDFUploader onUploadComplete={fetchFiles} />

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
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Folders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <Folder className="h-6 w-6 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {folder.count} items
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Documents
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <button
                              onClick={toggleAll}
                              className="mr-3 focus:outline-none"
                            >
                              {selectedDocs.size === documents.length ? (
                                <CheckSquare className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            Name
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modified
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
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
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500 uppercase">
                              {doc.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">
                              {doc.size}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">
                              {doc.modified}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteFile(doc.title)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
