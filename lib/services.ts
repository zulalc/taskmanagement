import { Board, Stage, Task, taskData } from "./supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const boardService = {
  async getBoard(
    supabase: SupabaseClient,
    boardId: string,
  ): Promise<Board | null> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) throw error;

    return data;
  },

  async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">,
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: Partial<Board>,
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", boardId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteBoard(supabase: SupabaseClient, boardId: string): Promise<void> {
    const { error, count } = await supabase
      .from("boards")
      .delete({ count: "exact" })
      .eq("id", boardId);
    if (error) throw error;
    if (count === 0) throw new Error(`Board ${boardId} not found`);
  },
};

export const stageService = {
  async getStages(supabase: SupabaseClient, boardId: string): Promise<Stage[]> {
    const { data, error } = await supabase
      .from("stages")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async createStage(
    supabase: SupabaseClient,
    stage: Omit<Stage, "id" | "created_at">,
  ): Promise<Stage> {
    const { data, error } = await supabase
      .from("stages")
      .insert(stage)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateStage(
    supabase: SupabaseClient,
    stageId: number,
    title: string,
    isCompleted: boolean,
  ): Promise<Stage> {
    const query = supabase
      .from("stages")
      .update({ title, is_completed: isCompleted })
      .eq("id", stageId)
      .select()
      .single();

    const { data, error } = await query;

    if (error) throw error;

    return data;
  },

  async deleteStage(supabase: SupabaseClient, stageId: number): Promise<void> {
    const { error, count } = await supabase
      .from("stages")
      .delete({ count: "exact" })
      .eq("id", stageId);
    if (error) throw error;
    if (count === 0) throw new Error(`Stage ${stageId} not found`);
  },
};

export const taskService = {
  async getTasksByBoard(
    supabase: SupabaseClient,
    boardId: string,
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        stages!inner(board_id)
        `,
      )
      .eq("stages.board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async createTask(
    supabase: SupabaseClient,
    task: Omit<Task, "id" | "created_at" | "updated_at">,
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async moveTask(
    supabase: SupabaseClient,
    taskId: number,
    newStageId: number,
    newOrder: number,
  ) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        stage_id: Number(newStageId),
        sort_order: newOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) throw error;

    return data;
  },

  async updateTask(
    supabase: SupabaseClient,
    taskId: number,
    data: taskData,
  ): Promise<Task> {
    const { data: updated, error } = await supabase
      .from("tasks")
      .update({
        title: data.title,
        description: data.description,
        assignee: data.assignee,
        due_date: data.due_date,
        priority: data.priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select("*, stages(board_id)")
      .single();

    if (error) throw error;
    return updated;
  },

  async deleteTask(supabase: SupabaseClient, taskId: number): Promise<void> {
    const { error, count } = await supabase
      .from("tasks")
      .delete({ count: "exact" })
      .eq("id", taskId);
    if (error) throw error;
    if (count === 0) throw new Error(`Task ${taskId} not found`);
  },
};

export const boardDataServices = {
  async getBoardWithStages(supabase: SupabaseClient, boardId: string) {
    const [board, stages] = await Promise.all([
      boardService.getBoard(supabase, boardId),
      stageService.getStages(supabase, boardId),
    ]);

    if (!board) throw new Error("Board not found");

    const tasks = await taskService.getTasksByBoard(supabase, boardId);

    const stagesWithTasks = stages.map((stage) => ({
      ...stage,
      tasks: tasks.filter((task) => task.stage_id === stage.id),
    }));

    return {
      board,
      stagesWithTasks,
    };
  },

  async createBoardWithDefaultStages(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
    },
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || "bg-[#008170]",
      user_id: boardData.userId,
    });

    const defaultStages = [
      { title: "To Do", sort_order: 0, is_completed: false },
      { title: "In Progress", sort_order: 1, is_completed: false },
      { title: "Review", sort_order: 2, is_completed: false },
      { title: "Done", sort_order: 3, is_completed: true },
    ];

    await Promise.all(
      defaultStages.map((stage) =>
        stageService.createStage(supabase, {
          ...stage,
          board_id: board.id,
          user_id: boardData.userId,
        }),
      ),
    );

    return board;
  },
};
