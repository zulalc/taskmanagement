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
}: {
  stage: StageWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: taskData) => Promise<void>;
  boardId: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className={`*:w-full lg:shrink-0 lg:w-80 ${isOver ? "ring-2 ring-[#008170] rounded-lg" : ""} `}
    >
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-zinc-900 text-sm sm:text-base truncate">
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
        <div className="p-2">
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
