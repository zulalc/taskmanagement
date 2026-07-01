"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Stage } from "@/lib/supabase/models";
import { Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

function AddStage({
  createStage,
  buttonVariant,
}: {
  createStage: (title: string, isCompleted: boolean) => Promise<Stage>;
  buttonVariant?: "ghost" | "default";
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  async function handleCreateStage(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createStage(title, isCompleted);

      setTitle("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create stage:", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonVariant === "ghost" ? (
          <Card
            className="
        min-w-70
        mt-1
        border-2 border-dashed
        border-zinc-300
        hover:border-[#008170]
        bg-transparent
        hover:bg-[#008170]/5
        cursor-pointer
        transition-all
        duration-200
        group
        shrink-0
      "
          >
            <CardContent
              className="flex flex-col items-center justify-center h-full min-h-55 p-6
        "
            >
              <Plus
                className="w-8 h-8 text-zinc-400 group-hover:text-[#008170] transition-colors mb-3
          "
              />

              <p
                className="text-sm sm:text-base font-medium text-zinc-500 group-hover:text-[#008170] transition-colors text-center
          "
              >
                Create New Stage
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button className="w-full sm:w-auto cursor-pointer">
            <Plus />
            Create Stage
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Stage</DialogTitle>
          <p className="text-sm text-zinc-600">Add a stage to the board</p>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateStage}>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>

            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter stage title"
              required
              maxLength={50}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_completed"
              checked={isCompleted}
              onCheckedChange={(checked) => setIsCompleted(checked as boolean)}
            />
            <Label
              htmlFor="is_completed"
              className="cursor-pointer font-normal"
            >
              Mark as completion stage
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="cursor-pointer">
              Create Stage
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStage;
