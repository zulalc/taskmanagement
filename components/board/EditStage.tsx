"use client";
import { Stage } from "@/lib/supabase/models";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useBoard } from "@/lib/hooks/useBoards";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

function EditStage({ stage, boardId }: { stage: Stage; boardId: string }) {
  const { updateStage } = useBoard(boardId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(stage.title);
  const [isCompleted, setIsCompleted] = useState(stage.is_completed);

  async function handleUpdateStage(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      await updateStage(stage.id, title.trim(), isCompleted);

      setOpen(false);
      setTitle("");
      setIsCompleted(false);
    } catch (error) {
      console.error("Failed to update stage:", error);
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
            <DialogTitle>Edit Stage</DialogTitle>
            <DialogDescription>
              Update the title of your stage
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleUpdateStage}>
            <div className="space-y-2">
              <Label htmlFor="title" className="mb-4">
                Stage Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter stage title"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_completed"
                checked={isCompleted}
                onCheckedChange={(checked) =>
                  setIsCompleted(checked as boolean)
                }
              />
              <Label
                htmlFor="is_completed"
                className="cursor-pointer font-normal"
              >
                Mark as completion stage
              </Label>
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
                Edit Stage
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditStage;
