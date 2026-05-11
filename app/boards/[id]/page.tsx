"use client";

import AddTask from "@/components/board/AddTask";
import EditBoard from "@/components/board/EditBoard";
import FilterTasks from "@/components/board/FilterTasks";
import Stage from "@/components/board/Stage";
import TaskCard from "@/components/board/TaskCard";
import BreadCrumbs from "@/components/BreadCrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/lib/hooks/useBoards";
import { Task, taskData } from "@/lib/supabase/models";
import { Filter, MoreHorizontal, Pointer } from "lucide-react";
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
import AddStage from "@/components/board/AddStage";

export default function BoardPage() {
  const { id } = useParams() as { id: string };
  const {
    board,
    updateBoard,
    stages,
    createTaskHook,
    setStages,
    moveTask,
    createStage,
  } = useBoard(id);
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

  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const [isFiltering, setIsFiltering] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  // onFilterClick={() => {}}
  //filterCount = {2}

  const handleEditBoard = () => {
    if (!board) return;

    setNewColor(board.color ?? "");
    setNewTitle(board.title ?? "");
    setIsEditingBoard(true);
  };

  async function handleUpdateBoard(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingBoard(false);
    } catch (error) {
      console.error("Failed to update board:", error);
    }
  }

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
      console.log("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="max-w-7xl mx-auto px-5 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-2">
          <BreadCrumbs name={board?.title || "Board"} />
          <div className="flex items-center gap-1">
            <Button
              variant={"outline"}
              size={"sm"}
              className={`cursor-pointer text-xs sm:text-sm ${filterCount > 0 ? "bg-[#008170] border-[#008170] text-white" : ""}`}
              onClick={() => setIsFiltering(true)}
            >
              <Filter className="w-3 h-3 sm:w-4 h:w-4 " /> Filter
              {filterCount > 0 && (
                <Badge variant={"secondary"} className="text-xs">
                  {filterCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleEditBoard}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        <EditBoard
          isEditingBoard={isEditingBoard}
          setIsEditingBoard={setIsEditingBoard}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newColor={newColor}
          setNewColor={setNewColor}
          handleUpdateBoard={handleUpdateBoard}
        />

        <FilterTasks
          isFiltering={isFiltering}
          setIsFiltering={setIsFiltering}
        />

        {/*Board Content*/}
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
              {stages.map((stage, key) => (
                <Stage
                  key={key}
                  stage={stage}
                  onCreateTask={createTask}
                  onEditStage={() => {}}
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
