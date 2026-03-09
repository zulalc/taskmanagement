"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ColorPanel from "@/components/color/colorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/lib/hooks/useBoards";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Filter, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function BoardPage() {
  const { id } = useParams() as { id: string };
  const { board, updateBoard, stages } = useBoard(id);

  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const [isFiltering, setIsFiltering] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  // onFilterClick={() => {}}
  //filterCount = {2}

  const handleEditBoard = () => {
    if (!board) return;

    setNewColor(board.color ?? "");
    setNewTitle(board.title ?? "");
    setIsEditingBoard(true);
  };

  async function handleUpdateBoard(e: React.SubmitEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingBoard(false);
    } catch (error) {
      console.error("Failed to update board:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="max-w-7xl mx-auto px-5 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <BreadCrumbs name={board?.title || "Board"} />
          <div className="flex items-center gap-1">
            <Button
              variant={"outline"}
              size={"sm"}
              className={`cursor-pointer text-xs sm:text-sm ${filterCount > 0 ? "bg-[#008170] border-[#008170] text-white" : ""}`}
              onClick={() => setIsFiltering(true)}
            >
              <Filter className="w-3 h-3 sm:w-4 h:w-4 " /> Filter
              {filterCount > 0 && (
                <Badge variant={"secondary"} className="text-xs">
                  {filterCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleEditBoard}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        <Dialog open={isEditingBoard} onOpenChange={setIsEditingBoard}>
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
                  onClick={() => setIsEditingBoard(false)}
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

        <Dialog open={isFiltering} onOpenChange={setIsFiltering}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
            <DialogHeader>
              <DialogTitle>Filter Tasks</DialogTitle>
              <p className="text-sm text-zinc-600">
                Filter tasks by priority, assignee, or due date
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {["High", "Medium", "Low"].map((priority, key) => (
                    <Button
                      key={key}
                      variant={"outline"}
                      size={"sm"}
                      className="cursor-pointer"
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>

              {/*<div className="space-y-2">
                <Label>Assignee</Label>
                <div className="flex flex-wrap gap-2">
                  {["High", "Medium", "Low"].map((priority, key) => (
                    <Button key={key} variant={"outline"} size={"sm"}>
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>
            */}

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" className="cursor-pointer" />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant={"outline"}
                  className="cursor-pointer"
                >
                  Clear Filters
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsFiltering(false)}
                  className="cursor-pointer"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/*Board Content*/}
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-sm text-zinc-600">
                <span className="font-medium">Total Tasks: </span>
                {stages.reduce((total, stage) => total + stage.tasks.length, 0)}
              </div>
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}
