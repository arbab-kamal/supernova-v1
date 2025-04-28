import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, Notebook } from "lucide-react";

const BookmarkModal = () => {
  const bookmarkFolders = [
    {
      id: 1,
      name: "Research Papers",
      description: "Academic papers and research materials",
      count: 8,
    },
    {
      id: 2,
      name: "Tech Articles",
      description: "Articles about technology and development",
      count: 15,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Save to Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add to Note</DialogTitle>
            <button className="text-gray-400 hover:text-gray-500" />
          </div>
        </DialogHeader>
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full justify-start text-blue-600 mb-4"
          >
            + Create New Note
          </Button>
          <div className="space-y-3">
            {bookmarkFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Notebook className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{folder.name}</h3>
                    <p className="text-xs text-gray-500">
                      {folder.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{folder.count}</span>
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

export default BookmarkModal;
