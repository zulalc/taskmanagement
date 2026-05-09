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

function AddStage({
  createStage,
}: {
  createStage: (title: string) => Promise<Stage>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  async function handleCreateStage(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createStage(title);

      setTitle("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create stage:", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Stage</Button>
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
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">Create Stage</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStage;
