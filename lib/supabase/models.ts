export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: string;
  board_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  user_id: string;
}

export interface Task {
  id: string;
  stage_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type StageWithTasks = Stage & { tasks: Task[] };

export type taskData = {
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  priority?: string;
};
