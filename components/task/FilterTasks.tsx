"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { priorityOptions } from "../task/AddTask";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Filter } from "lucide-react";
import { Badge } from "../ui/badge";

type FilterTasksProps = {
  filters: {
    priority: string[];
    assignee: string[];
    due_date: string | null;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      priority: string[];
      assignee: string[];
      due_date: string | null;
    }>
  >;
};

function FilterTasks({ filters, setFilters }: FilterTasksProps) {
  const [open, setOpen] = useState(false);

  const filterCount =
    filters.priority.length +
    filters.assignee.length +
    (filters.due_date ? 1 : 0);

  function toggleFilter(
    type: "priority" | "assignee" | "due_date",
    value: string | string[] | null,
  ) {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      priority: [] as string[],
      assignee: [] as string[],
      due_date: null as string | null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className={`cursor-pointer text-xs sm:text-sm ${filterCount > 0 ? "bg-[#BFEAE4] border-[#008170] text-[#005F54] hover:bg-[#A8E0D8]" : ""}`}
          onClick={() => setOpen(true)}
        >
          <Filter className="w-3 h-3 sm:w-4 h:w-4 " /> Filter
          {filterCount > 0 && (
            <Badge variant={"secondary"} className="text-xs">
              {filterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
          <p className="text-sm text-zinc-600">
            Filter tasks by priority, assignee or due date
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((priority, key) => (
                <Button
                  key={key}
                  variant={
                    filters.priority.includes(priority) ? "default" : "outline"
                  }
                  size={"sm"}
                  className="cursor-pointer"
                  onClick={() => {
                    const current = filters.priority;
                    if (current.includes(priority)) {
                      toggleFilter(
                        "priority",
                        current.filter((p) => p !== priority),
                      );
                    } else {
                      toggleFilter("priority", [...current, priority]);
                    }
                  }}
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
            <Input
              type="date"
              value={filters.due_date || ""}
              onChange={(e) => toggleFilter("due_date", e.target.value || null)}
              className="cursor-pointer"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant={"outline"}
              className="cursor-pointer"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FilterTasks;
