"use client";
import { useBoards } from "@/lib/hooks/useBoards";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ColorPanel from "../color/colorPanel";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";

function CreateBoard({
  buttonVariant,
  canCreateBoard,
}: {
  buttonVariant?: "ghost" | "default";
  canCreateBoard: boolean;
}) {
  const { createBoard } = useBoards();
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#008170");
  const [description, setDescription] = useState("");
  const router = useRouter();

  function handleTriggerClick() {
    if (!canCreateBoard) {
      setUpgradeOpen(true);
      return;
    }
    setOpen(true);
  }

  async function handleCreateBoard(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createBoard({
        title,
        color,
        description: description.trim() || undefined,
      });

      setTitle("");
      setColor("#008170");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {buttonVariant === "ghost" ? (
          <Card
            onClick={handleTriggerClick}
            className="
        h-full
        border-2 border-dashed
        border-zinc-300
        hover:border-[#008170]
        bg-transparent
        hover:bg-[#008170]/5
        cursor-pointer
        transition-all
        duration-200
        group
      "
          >
            <CardContent className="flex flex-col items-center justify-center h-full  min-h-33 p-6">
              <Plus className="w-8 h-8 text-zinc-400 group-hover:text-[#008170] transition-colors mb-3" />

              <p className="text-sm sm:text-base font-medium text-zinc-500 group-hover:text-[#008170] transition-colors text-center">
                Create New Board
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="cursor-pointer"
            onClick={handleTriggerClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Board
          </Button>
        )}

        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateBoard}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle" className="mb-4">
                Board Title *
              </Label>
              <Input
                id="boardTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter board title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter board description"
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label className="mb-4">Board Color</Label>
              <ColorPanel value={color} onChange={setColor} />
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
                Create Board
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <DialogTitle>Board Limit Reached</DialogTitle>
            </div>
            <p className="text-sm text-gray-600">
              Free users can only create one board.
            </p>
            <p className="text-sm font-semibold text-gray-600">
              Upgrade to Pro or Enterprise to create unlimited boards.
            </p>
          </DialogHeader>
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => router.push("/pricing")}
            >
              View Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateBoard;
