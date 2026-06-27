"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Task, taskData } from "@/lib/supabase/models";
import { Pencil } from "lucide-react";
import { useBoardContext } from "@/lib/contexts/BoardContext";
import { priorityOptions } from "./AddTask";

function EditTask({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  const { updateTask } = useBoardContext();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: taskData = {
      stage_id: task.stage_id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignee: formData.get("assignee") as string,
      priority:
        (formData.get("priority") as "Low" | "Medium" | "High") || "Medium",
      due_date: formData.get("due_date") as string,
    };

    try {
      await updateTask(Number(task.id), data);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs" className="cursor-pointer">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <p className="text-sm text-zinc-600">Update task details</p>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              name="title"
              placeholder="Enter task title"
              defaultValue={task.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Enter task description"
              defaultValue={task.description || ""}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Assignee</Label>
            <Input
              name="assignee"
              placeholder="Enter task assignee"
              defaultValue={task.assignee || ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              name="priority"
              required
              defaultValue={
                task.priority
                  ? task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)
                  : "Medium"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              name="due_date"
              type="date"
              required
              defaultValue={task.due_date?.split("T")[0] || ""}
            />
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTask;
