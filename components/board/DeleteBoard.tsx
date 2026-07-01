"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useBoard } from "@/lib/hooks/useBoards";
import { X } from "lucide-react";
import { useBoardsContext } from "@/lib/contexts/BoardsContext";
import { useRouter } from "next/navigation";

function DeleteBoard({
  boardId,
  buttonSize,
  className,
}: {
  boardId: string;
  buttonSize: "sm" | "xs";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { deleteBoard } = useBoard(boardId);
  const { removeBoard } = useBoardsContext();
  const router = useRouter();

  async function handleDeleteBoard() {
    try {
      await deleteBoard(boardId);
      removeBoard(boardId);
      router.push("/dashboard");
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={buttonSize}
          className={`cursor-pointer hover:bg-red-50 border-red-300 text-red-600 hover:text-red-700 ${className ?? ""}`}
        >
          <X className="w-4 h-4" />
          <span className="sm:hidden ml-1">Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Delete Board</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this board? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant={"outline"}
            className="cursor-pointer hover:bg-gray-200"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
            onClick={handleDeleteBoard}
          >
            Delete Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteBoard;
