import { Task } from "@/lib/supabase/models";
import { Card, CardContent } from "../ui/card";
import { Calendar, User } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteTask from "./DeleteTask";

function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  function getPriorityColor(priority: "low" | "medium" | "high") {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  }

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/*HEADER*/}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-zinc-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
              <DeleteTask taskId={task.id} />
            </div>

            <p className="text-xs text-zinc-600 line-clamp-2">
              {task.description || "No description."}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-zinc-500">
                    <User className="w-3 h-3" />
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}

                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    <span className="truncate">{task.due_date}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(task.priority)}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskCard;
