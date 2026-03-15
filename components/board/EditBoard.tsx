import ColorPanel from "../color/colorPanel";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function EditBoard({
  isEditingBoard,
  setIsEditingBoard,
  newTitle,
  setNewTitle,
  newColor,
  setNewColor,
  handleUpdateBoard,
}: {
  isEditingBoard: boolean;
  setIsEditingBoard: (value: boolean) => void;
  newTitle: string;
  setNewTitle: (value: string) => void;
  newColor: string;
  setNewColor: (value: string) => void;
  handleUpdateBoard: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) {
  return (
    <div>
      <Dialog open={isEditingBoard} onOpenChange={setIsEditingBoard}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleUpdateBoard}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle" className="mb-4">
                Board Title
              </Label>
              <Input
                id="boardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title"
                required
              />
            </div>
            <div>
              <Label className="mb-4">Board Color</Label>
              <ColorPanel value={newColor} onChange={setNewColor} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => setIsEditingBoard(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBoard;
