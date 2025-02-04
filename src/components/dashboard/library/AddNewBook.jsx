import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Loader2, Plus } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { Slider } from "@/components/ui/slider"; // Add this import

const AddNewBook = () => {
  const { addNewBook, loading } = useLibrary();
  const [newBook, setNewBook] = useState({
    title: "",
    bookAuthor: "",
    coverImage: "",
    status: "tbr",
    progress: "",
  });

  const addBook = () => {
    const book = {
      ...newBook,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    addNewBook(book);

    setNewBook({ coverImage: "", title: "", status: "tbr", progress: 0 });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {!loading ? (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add New Book
            </>
          ) : (
            <Loader2 className="animate-spin" />
          )}{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Enter the details of the new book you want to add to your library.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input
              id="author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              className="col-span-3"
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={newBook.status}
              onValueChange={(value) =>
                setNewBook({ ...newBook, status: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="currently reading">
                  Currently Reading
                </SelectItem>
                <SelectItem value="favorite">Favorite</SelectItem>
                <SelectItem value="tbr">To Be Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newBook.status === "currently reading" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                Progress
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <Slider
                  id="progress"
                  min={0}
                  max={100}
                  step={1}
                  value={[newBook.progress]}
                  onValueChange={(value) =>
                    setNewBook({ ...newBook, progress: value[0] })
                  }
                  className="flex-grow"
                />
                <span className="w-12 text-right">{newBook.progress}%</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverImage" className="text-right">
              Cover Image
            </Label>
            <div className="relative col-span-3">
              <ImageIcon className="absolute left-3 top-3 h-5 w-5 text600" />
              <Input
                id="coverImage"
                type="file"
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    coverImage: e.target.files?.[0] || "",
                  })
                }
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={addBook}>
            {!loading ? "Add Book" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewBook;
