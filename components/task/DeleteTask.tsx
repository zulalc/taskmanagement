"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { X } from "lucide-react";
import { useBoardContext } from "@/lib/contexts/BoardContext";
function DeleteTask({ taskId }: { taskId: String }) {
  const [open, setOpen] = useState(false);
  const { deleteTask } = useBoardContext();

  async function handleDeleteTask() {
    try {
      await deleteTask(Number(taskId));
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            className="cursor-pointer hover:bg-red-50 border-red-300 text-red-600 hover:text-red-700"
          >
            <X />
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant={"outline"}
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteTask}
            >
              Delete Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleteTask;
