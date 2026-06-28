"use client";
import { useEffect, useState } from "react";
import ColorPanel from "../color/colorPanel";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MoreHorizontal } from "lucide-react";
import { useBoardContext } from "@/lib/contexts/BoardContext";

function EditBoard({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const { board, updateBoard } = useBoardContext();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#008170");

  useEffect(() => {
    if (board) {
      setNewTitle(board.title);
      setNewColor(board.color ?? "#008170");
      setNewDesc(board.description ?? "");
    }
  }, [board]);

  async function handleUpdateBoard(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newTitle.trim()) {
      return;
    }

    try {
      await updateBoard(boardId, {
        title: newTitle.trim(),
        color: newColor,
        description: newDesc,
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to update board:", error);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <MoreHorizontal />
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>Edit your board</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleUpdateBoard}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle" className="mb-4">
                Board Title
              </Label>
              <Input
                id="boardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boardDescription" className="mb-4">
                Board Description
              </Label>
              <Input
                id="boardDescription"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Enter board description"
              />
            </div>

            <div>
              <Label className="mb-4">Board Color</Label>
              <ColorPanel value={newColor} onChange={setNewColor} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Edit Board
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBoard;
