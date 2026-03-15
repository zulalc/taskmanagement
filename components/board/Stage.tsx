import { StageWithTasks } from "@/lib/supabase/models";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function Stage({
  stage,
  children,
  onCreateTask,
  onEditStage,
}: {
  stage: StageWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditStage: (stage: StageWithTasks) => void;
}) {
  return (
    <div className="w-full lg:shrink-0 lg:w-80">
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
            <Button
              variant={"ghost"}
              size={"sm"}
              className="shrink-0 cursor-pointer"
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/*Content*/}
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}

export default Stage;
