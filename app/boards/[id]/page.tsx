"use client";

import AddTask from "@/components/task/AddTask";
import EditBoard from "@/components/board/EditBoard";
import FilterTasks from "@/components/task/FilterTasks";
import Stage from "@/components/stage/Stage";
import TaskCard from "@/components/task/TaskCard";
import BreadCrumbs from "@/components/BreadCrumbs";
import { Task, taskData } from "@/lib/supabase/models";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDragHandlers } from "@/lib/hooks/useDragHandlers";
import AddStage from "@/components/stage/AddStage";
import DeleteBoard from "@/components/board/DeleteBoard";
import { BoardProvider } from "@/lib/contexts/BoardContext";
import { useBoardContext } from "@/lib/contexts/BoardContext";

function BoardPageContent() {
  const { board, stages, createTaskHook, setStages, moveTask, createStage } =
    useBoardContext();
  const { id } = useParams() as { id: string };
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { handleDragStart, handleDragOver, handleDragEnd } = useDragHandlers({
    stages,
    setStages,
    setActiveTask,
    moveTask,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: [] as string[],
    due_date: null as string | null,
  });

  const hasActiveFilters =
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.due_date;

  const filteredStages = stages.map((stage) => ({
    ...stage,
    tasks: stage.tasks.filter((task) => {
      const priorityMatch =
        filters.priority.length === 0 ||
        filters.priority
          .map((p) => p.toLowerCase())
          .includes(task.priority?.toLowerCase());

      const dueDateMatch =
        !filters.due_date || task.due_date?.split("T")[0] === filters.due_date;

      return priorityMatch && dueDateMatch;
    }),
  }));

  const visibleStages = hasActiveFilters ? filteredStages : stages;

  async function createTask(taskData: taskData) {
    const targetStage =
      taskData.stage_id !== undefined && taskData.stage_id !== null
        ? Number(taskData.stage_id)
        : Number(stages[0].id);
    if (!targetStage) {
      throw new Error("No stages available to add the task");
    }

    await createTaskHook(targetStage, {
      ...taskData,
      stage_id: targetStage,
    });
  }

  async function handleCreateTask(taskData: taskData) {
    if (!taskData.title.trim()) {
      console.error("Title is required!");
      return;
    }

    try {
      await createTask(taskData);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="max-w-7xl mx-auto px-5 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-2">
          <BreadCrumbs
            name={board?.title || "Board"}
            color={board?.color || "#008170"}
          />
          <div className="flex items-center gap-1">
            <FilterTasks filters={filters} setFilters={setFilters} />
            <EditBoard boardId={id} />
            <DeleteBoard boardId={id} buttonSize="sm" />
          </div>
        </div>

        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-sm text-zinc-600">
                <span className="font-medium">Total Tasks: </span>
                {stages.reduce((total, stage) => total + stage.tasks.length, 0)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:w-auto">
              <AddTask onSubmit={handleCreateTask} />
              <AddStage createStage={createStage} />
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveTask(null)}
          >
            <div
              className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
          lg:pb-6 lg:px-2 lg:mx-2 lg:[&::-webkit-scrollbar]:h-2
          lg:[&::-webkit-scrollbar-track]:bg-zinc-100
          lg:[&::-webkit-scrollbar-thumb]:bg-zinc-300
          lg:[&::-webkit-scrollbar-thumb]:rounded-full
          space-y-4 lg:space-y-0
          "
            >
              {visibleStages.map((stage, key) => (
                <Stage
                  key={key}
                  stage={stage}
                  onCreateTask={createTask}
                  boardId={id}
                  boardColor={board?.color}
                >
                  <SortableContext
                    items={stage.tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {stage.tasks.map((task, key) => (
                        <TaskCard key={key} task={task} />
                      ))}
                    </div>
                  </SortableContext>
                </Stage>
              ))}

              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
              </DragOverlay>

              <AddStage createStage={createStage} buttonVariant="ghost" />
            </div>
          </DndContext>
        </main>
      </main>
    </div>
  );
}

export default function BoardPage() {
  const { id } = useParams() as { id: string };

  return (
    <BoardProvider boardId={id}>
      <BoardPageContent />
    </BoardProvider>
  );
}
