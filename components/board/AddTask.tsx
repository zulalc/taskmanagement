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

export const priorityOptions = ["High", "Medium", "Low"];
function AddTask({
  handleCreateTask,
}: {
  handleCreateTask: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto cursor-pointer">
            <Plus /> Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <p className="text-sm text-zinc-600">Add a task to the board</p>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateTask}>
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
                id="dueDate"
                name="dueDate"
                type="date"
                placeholder="Enter due date"
              />
            </div>

            <div className="flex justify-end space-y-2 pt-4">
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddTask;
