"use client";
import { Stage } from "@/lib/supabase/models";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useBoard } from "@/lib/hooks/useBoards";
import { Button } from "../ui/button";

function EditStage({
  stage,
  isEditingStage,
  setIsEditingStage,
  boardId,
}: {
  stage: Stage;
  isEditingStage: boolean;
  setIsEditingStage: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: string;
}) {
  const { updateStage } = useBoard(boardId);

  const [title, setTitle] = useState(stage.title);

  async function handleUpdateStage(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const result = await updateStage(stage.id, title.trim());

      setIsEditingStage(false);
      setTitle("");
    } catch (error) {
      console.error("Failed to update stage:", error);
    }
  }
  return (
    <div>
      <Dialog open={isEditingStage} onOpenChange={setIsEditingStage}>
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
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => setIsEditingStage(false)}
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
