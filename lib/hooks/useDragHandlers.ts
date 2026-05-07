import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { StageWithTasks, Task } from "../supabase/models";

type useDragHandlersProps = {
  stages: StageWithTasks[];
  setStages: React.Dispatch<React.SetStateAction<StageWithTasks[]>>;
  setActiveTask: (task: Task | null) => void;
  moveTask: (
    taskId: number,
    targetStageId: number,
    index: number,
  ) => Promise<void>;
};

export function useDragHandlers({
  stages,
  setStages,
  setActiveTask,
  moveTask,
}: useDragHandlersProps) {
  function handleDragStart(event: DragStartEvent) {
    const taskId = Number(event.active.id);
    const task = stages
      .flatMap((stage) => stage.tasks)
      .find((t) => Number(t.id) === taskId);
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const sourceStage = stages.find((stage) =>
      stage.tasks.some((task) => Number(task.id) === activeId),
    );

    const targetStage = stages.find((stage) =>
      stage.tasks.some((task) => Number(task.id) === overId),
    );

    if (!sourceStage || !targetStage) return;

    if (sourceStage.id === targetStage.id) {
      const activeIndex = sourceStage.tasks.findIndex(
        (task) => Number(task.id) === activeId,
      );

      const overIndex = targetStage.tasks.findIndex(
        (task) => Number(task.id) === overId,
      );

      if (activeIndex !== overIndex) {
        setStages((prev) => {
          const newStages = [...prev];
          const stage = newStages.find((s) => s.id === sourceStage.id);
          if (stage) {
            const tasks = [...stage.tasks];
            const [movedTask] = tasks.splice(activeIndex, 1);
            tasks.splice(overIndex, 0, movedTask);
            stage.tasks = tasks;
          }
          return newStages;
        });
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const targetStage = stages.find((s) => s.id === overId);

    if (targetStage) {
      const sourceStage = stages.find((s) =>
        s.tasks.some((task) => Number(task.id) === activeId),
      );

      if (sourceStage && sourceStage.id !== targetStage.id) {
        await moveTask(activeId, targetStage.id, targetStage.tasks.length);
      }
    } else {
      const sourceStage = stages.find((s) =>
        s.tasks.some((task) => Number(task.id) === activeId),
      );

      const targetStage = stages.find((s) =>
        s.tasks.some((task) => Number(task.id) === overId),
      );
      if (sourceStage && targetStage) {
        const oldIndex = sourceStage.tasks.findIndex(
          (task) => Number(task.id) === activeId,
        );

        const newIndex = targetStage.tasks.findIndex(
          (task) => Number(task.id) === overId,
        );

        if (oldIndex !== newIndex) {
          await moveTask(activeId, targetStage.id, newIndex);
        }
      }
    }
  }
  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
