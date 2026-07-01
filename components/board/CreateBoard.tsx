"use client";
import { useBoards } from "@/lib/hooks/useBoards";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ColorPanel from "../color/colorPanel";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { useBoardsContext } from "@/lib/contexts/BoardsContext";

function CreateBoard({
  buttonVariant,
  canCreateBoard,
}: {
  buttonVariant?: "ghost" | "default";
  canCreateBoard: boolean;
}) {
  const { createBoard } = useBoardsContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#008170");
  const [description, setDescription] = useState("");

  function handleTriggerClick() {
    if (!canCreateBoard) {
      setUpgradeOpen(true);
      return;
    }
    setOpen(true);
  }

  async function handleCreateBoard(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createBoard({
        title,
        color,
        description: description.trim() || undefined,
      });

      setTitle("");
      setColor("#008170");
      setDescription("");
      setOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {buttonVariant === "ghost" ? (
          <Card
            onClick={handleTriggerClick}
            className="h-full border-2 border-dashed cursor-pointer transition-all duration-200 group"
            style={{
              borderColor: "var(--brand-mint)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-primary)";
              e.currentTarget.style.background = "var(--brand-primary)08";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-mint)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-33 p-6">
              <div className="w-10 h-10 bg-brand-card-bg rounded-full flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-5 h-5 text-brand-primary" />
              </div>
              <p className="text-sm font-medium text-center text-brand-primary">
                Create New Board
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button
            size="sm"
            className="cursor-pointer bg-brand-primary"
            onClick={handleTriggerClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Board
          </Button>
        )}

        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-dark">Create Board</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateBoard}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle">Board Title *</Label>
              <Input
                id="boardTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter board title"
                required
                maxLength={50}
                className="bg-brand-card-bg"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter board description"
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={200}
                className="border border-brand-card-bg"
              />
            </div>
            <div className="space-y-2">
              <Label>Board Color</Label>
              <ColorPanel value={color} onChange={setColor} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer bg-brand-primary">
                Create Board
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <DialogTitle className="text-brand-dark">
                Board Limit Reached
              </DialogTitle>
            </div>
            <p className="text-sm" style={{ color: "#3a5a54" }}>
              Free users can only create one board. Upgrade to Pro or Enterprise
              to create unlimited boards.
            </p>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setUpgradeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-amber-500 hover:bg-amber-600"
              onClick={() => router.push("/pricing")}
            >
              View Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateBoard;
