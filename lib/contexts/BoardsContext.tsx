"use client";
import { createContext, useContext } from "react";
import { useBoards } from "../hooks/useBoards";

const BoardsContext = createContext<ReturnType<typeof useBoards> | null>(null);

export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const boards = useBoards();
  return (
    <BoardsContext.Provider value={boards}>{children}</BoardsContext.Provider>
  );
}

export function useBoardsContext() {
  const ctx = useContext(BoardsContext);
  if (!ctx)
    throw new Error("useBoardsContext must be used within BoardsProvider");
  return ctx;
}
