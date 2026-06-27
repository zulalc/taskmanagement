"use client";
import { StageWithTasks, taskData } from "@/lib/supabase/models";
import { Badge } from "../ui/badge";
import AddTask from "../task/AddTask";
import { useDroppable } from "@dnd-kit/core";
import EditStage from "./EditStage";
import DeleteStage from "./DeleteStage";

function Stage({
  stage,
  children,
  onCreateTask,
  boardId,
  boardColor,
}: {
  stage: StageWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: taskData) => Promise<void>;
  boardId: string;
  boardColor?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className={`*:w-full lg:shrink-0 lg:w-80 ${isOver ? "ring-2 ring-brand-primary rounded-xl" : ""}`}
    >
      <div className="bg-white rounded-xl border border-brand-card-bg shadow-sm">
        <div className="px-4 py-3 border-b border-brand-card-bg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              {stage.is_completed && (
                <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
              )}

              <h3 className="font-semibold text-sm sm:text-base truncate">
                {stage.title}
              </h3>
              <Badge variant={"secondary"} className="text-xs shrink-0">
                {stage.tasks.length}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <EditStage stage={stage} boardId={boardId} />
              <DeleteStage stageId={stage.id} />
            </div>
          </div>
        </div>

        {/*Content*/}
        <div
          className="p-2 rounded-b-xl"
          style={{
            background: boardColor
              ? boardColor + "15"
              : "var(--color-brand-tint)",
          }}
        >
          {children}
          <AddTask
            onSubmit={onCreateTask}
            buttonVariant="ghost"
            targetStageId={stage.id}
          />
        </div>
      </div>
    </div>
  );
}

export default Stage;
