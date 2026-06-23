"use client";
import { createContext, useContext } from "react";
import { useBoard } from "../hooks/useBoards";

const BoardContext = createContext<ReturnType<typeof useBoard> | null>(null);

export function BoardProvider({
  boardId,
  children,
}: {
  boardId: string;
  children: React.ReactNode;
}) {
  const board = useBoard(boardId);
  return (
    <BoardContext.Provider value={board}>{children}</BoardContext.Provider>
  );
}

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx)
    throw new Error("useBoardContext must be used within BoardProvider");
  return ctx;
}
