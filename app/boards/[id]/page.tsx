"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ColorPanel from "@/components/color/colorPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/lib/hooks/useBoards";
import { DialogTitle } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function BoardPage() {
  const { id } = useParams() as { id: string };
  const { board, updateBoard } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const handleEditBoard = () => {
    if (!board) return;

    setNewColor(board.color ?? "");
    setNewTitle(board.title ?? "");
    setIsEditingTitle(true);
  };

  async function handleUpdateBoard(e: React.SubmitEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Failed to update board:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-5 py-6 sm:py-8 mt-6">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <BreadCrumbs name={board?.title || "Board"} />

          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleEditBoard}
          >
            <MoreHorizontal />
          </Button>
        </div>

        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Board</DialogTitle>
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
              <div>
                <Label className="mb-4">Board Color</Label>
                <ColorPanel value={newColor} onChange={setNewColor} />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant={"outline"}
                  className="cursor-pointer"
                  onClick={() => setIsEditingTitle(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="cursor-pointer">
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
