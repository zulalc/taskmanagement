import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { priorityOptions } from "./AddTask";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function FilterTasks({
  isFiltering,
  setIsFiltering,
}: {
  isFiltering: boolean;
  setIsFiltering: (value: boolean) => void;
}) {
  return (
    <div>
      <Dialog open={isFiltering} onOpenChange={setIsFiltering}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <p className="text-sm text-zinc-600">
              Filter tasks by priority, assignee, or due date
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority, key) => (
                  <Button
                    key={key}
                    variant={"outline"}
                    size={"sm"}
                    className="cursor-pointer"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            {/*<div className="space-y-2">
                <Label>Assignee</Label>
                <div className="flex flex-wrap gap-2">
                  {["High", "Medium", "Low"].map((priority, key) => (
                    <Button key={key} variant={"outline"} size={"sm"}>
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>
            */}

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" className="cursor-pointer" />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
              >
                Clear Filters
              </Button>
              <Button
                type="button"
                onClick={() => setIsFiltering(false)}
                className="cursor-pointer"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FilterTasks;
