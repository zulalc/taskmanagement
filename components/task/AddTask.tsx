"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { taskData } from "@/lib/supabase/models";
import { useParams } from "next/navigation";
import { useBoard } from "@/lib/hooks/useBoards";

export const priorityOptions = ["High", "Medium", "Low"];

function AddTask({
  onSubmit,
  buttonVariant,
  targetStageId,
}: {
  onSubmit: (data: taskData) => Promise<void>;
  buttonVariant?: "ghost" | "default";
  targetStageId?: number;
}) {
  const [open, setOpen] = useState(false);

  const { id } = useParams() as { id: string };
  const { stages } = useBoard(id);
  const [stageId, setStageId] = useState<string>("");

  useEffect(() => {
    if (targetStageId) {
      setStageId(String(targetStageId));
    } else if (stages.length > 0 && !stageId) {
      setStageId(String(stages[0].id));
    }
  }, [targetStageId, stages]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const taskData: taskData = {
      stage_id: Number(stageId),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignee: formData.get("assignee") as string,
      priority:
        (formData.get("priority") as "Low" | "Medium" | "High") || "Medium",
      due_date: formData.get("due_date") as string,
    };

    await onSubmit(taskData);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={buttonVariant}
            className={
              buttonVariant === "ghost"
                ? "w-full mt-3 text-zinc-500 hover:text-gray-700 cursor-pointer"
                : "w-full sm:w-auto cursor-pointer"
            }
          >
            <Plus />
            {buttonVariant !== "ghost" && " Add Task"}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <p className="text-sm text-zinc-600">Add a task to the board</p>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={stageId}
                onValueChange={(value) => setStageId(value)}
                name="stage_id"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={String(stage.id)}>
                      {stage.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input
                id="assignee"
                name="assignee"
                placeholder="Enter task assignee"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select name="priority" defaultValue="Medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority, key) => (
                    <SelectItem key={key} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                placeholder="Enter due date"
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
                Create Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddTask;
