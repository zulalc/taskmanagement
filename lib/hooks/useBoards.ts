"use client";
import { useUser } from "@clerk/nextjs";
import {
  boardDataServices,
  boardService,
  stageService,
  taskService,
} from "../services";
import { useEffect, useState } from "react";
import { Board, StageWithTasks, Task, taskData } from "../supabase/models";
import { useSupabase } from "../supabase/SupabaseProvider";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBoards();
    }
  }, [user, supabase]);

  async function fetchBoards() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch boards.");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    try {
      const newBoard = await boardDataServices.createBoardWithDefaultStages(
        supabase!,
        {
          ...boardData,
          userId: user?.id,
        },
      );

      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board.");
    }
  }

  return { boards, loading, error, createBoard };
}

export function useBoard(boardId: string) {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [board, setBoard] = useState<Board | null>(null);
  const [stages, setStages] = useState<StageWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [boardId, supabase]);

  async function loadBoard(boardId: string) {
    if (!boardId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await boardDataServices.getBoardWithStages(
        supabase!,
        boardId,
      );
      setBoard(data.board);
      setStages(data.stagesWithTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load board.");
    } finally {
      setLoading(false);
    }
  }

  async function updateBoard(boardId: string, updates: Partial<Board>) {
    try {
      const updatedBoard = await boardService.updateBoard(
        supabase!,
        boardId,
        updates,
      );
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update board.");
    }
  }

  async function createTaskHook(stageId: number, taskData: taskData) {
    try {
      const rawPriority = (taskData.priority || "Medium").toLowerCase();
      const safePriority = rawPriority as "low" | "medium" | "high";
      const payload = {
        stage_id: stageId,
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.due_date || taskData.due_date || null,
        sort_order: stages.find((s) => s.id === stageId)?.tasks.length || 0,
        priority: safePriority,
      };

      const newTask = await taskService.createTask(supabase!, payload);

      //new task add end of the list
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId //find correct stage
            ? { ...stage, tasks: [...stage.tasks, newTask] }
            : stage,
        ),
      );
      return newTask;
    } catch (error) {
      console.error("CREATE TASK ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to create task.",
      );

      throw error;
    }
  }

  async function moveTask(
    taskId: number,
    newStageId: number,
    newOrder: number,
  ) {
    try {
      await taskService.moveTask(supabase!, taskId, newStageId, newOrder);

      setStages((prev) => {
        const newStages = [...prev];

        // Find and remove task from old stage
        let taskToMove: Task | null = null;
        let oldStageId: number | null = null;

        for (const stage of newStages) {
          console.log(
            "Checking stage:",
            stage.id,
            "Tasks:",
            stage.tasks.map((t) => ({
              id: t.id,
              title: t.title,
            })),
          );

          const taskIndex = stage.tasks.findIndex(
            (task) => Number(task.id) === taskId,
          );

          if (taskIndex !== -1) {
            taskToMove = stage.tasks[taskIndex];
            oldStageId = stage.id;

            stage.tasks.splice(taskIndex, 1);

            break;
          }
        }

        if (!taskToMove) {
          console.error("Task was NOT found in any stage");
        }

        const targetStage = newStages.find(
          (stage) => stage.id === Number(newStageId),
        );

        if (taskToMove && targetStage) {
          targetStage.tasks.splice(newOrder, 0, taskToMove);
        } else {
          console.error("Move failed:");
          console.error("taskToMove:", taskToMove);
          console.error("targetStage:", targetStage);
        }

        return newStages;
      });
    } catch (err) {
      console.error("MOVE TASK ERROR:", err);

      setError(err instanceof Error ? err.message : "Failed to move task.");
    }
  }

  async function createStage(title: string, isCompleted: boolean) {
    if (!board || !user) throw new Error("Board or user not found");

    try {
      const newStage = await stageService.createStage(supabase!, {
        title,
        board_id: board.id,
        sort_order: stages.length,
        user_id: user.id,
        is_completed: isCompleted,
      });

      setStages((prev) => [...prev, { ...newStage, tasks: [] }]);
      return newStage;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create stage.",
      );
      throw error;
    }
  }

  async function updateStage(
    stageId: number,
    title: string,
    isCompleted: boolean,
  ) {
    try {
      const updatedStage = await stageService.updateStage(
        supabase!,
        stageId,
        title,
        isCompleted,
      );

      setStages((prev) => {
        const updated = prev.map((stage) =>
          stage.id === stageId ? { ...stage, ...updatedStage } : stage,
        );

        return updated;
      });

      return updatedStage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update stage.");

      throw err;
    }
  }
  return {
    board,
    stages,
    loading,
    error,
    updateBoard,
    createTaskHook,
    setStages,
    moveTask,
    createStage,
    updateStage,
  };
}

export function useDashboardStats() {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalTasks: 0,
    overdueTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && supabase) loadStats();
  }, [user, supabase]);

  async function loadStats() {
    try {
      setLoading(true);
      const today = new Date().toISOString();

      const { data: tasks } = (await supabase!
        .from("tasks")
        .select(
          "id, due_date, stage:stages!inner(title, user_id, is_completed)",
        )
        .eq("stages.user_id", user!.id)) as any;

      if (!tasks) return;
      console.log(tasks[0]?.stage);

      setStats({
        totalTasks: tasks.length,
        overdueTasks: tasks.filter(
          (t: any) =>
            t.due_date && t.due_date < today && !t.stage?.is_completed,
        ).length,
        completedTasks: tasks.filter((t: any) => t.stage?.is_completed === true)
          .length,
      });
    } finally {
      setLoading(false);
    }
  }

  return { stats, loading };
}
