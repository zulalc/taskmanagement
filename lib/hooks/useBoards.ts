"use client";
import { useUser } from "@clerk/nextjs";
import { boardDataServices, boardService, taskService } from "../services";
import { useEffect, useState } from "react";
import { Board, Stage, StageWithTasks, taskData } from "../supabase/models";
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

  async function createTaskHook(stageId: string, taskData: taskData) {
    try {
      const newTask = await taskService.createTask(supabase!, {
        stage_id: stageId,
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        sort_order: stages.find((s) => s.id === stageId)?.tasks.length || 0,
        priority:
          (taskData.priority.toLowerCase() as "low" | "medium" | "high") ||
          "medium",
      });

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
      setError(
        error instanceof Error ? error.message : "Failed to create task.",
      );
    }
  }

  return { board, stages, loading, error, updateBoard, createTaskHook };
}
