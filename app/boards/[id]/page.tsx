"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import { useBoard } from "@/lib/hooks/useBoards";
import { useParams } from "next/navigation";

export default function BoardPage() {
  const { id } = useParams() as { id: string }; //board id
  const { board } = useBoard(id);
  console.log("board", board);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-5 py-6 sm:py-8 mt-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            <BreadCrumbs name={board?.title || "Board"} />
          </h1>
        </div>
      </main>
    </div>
  );
}
