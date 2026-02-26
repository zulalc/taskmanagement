import { Board, Stage } from "./supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const boardService = {
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

    return data || [];
  },
};

export const stageService = {
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
};

export const boardDataServices = {
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
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
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
