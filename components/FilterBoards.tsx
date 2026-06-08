"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export type FilterBoardsProps = {
  filters: {
    title: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      title: string;
      dateRange: {
        start: string | null;
        end: string | null;
      };
    }>
  >;
};

function FilterBoards({ filters, setFilters }: FilterBoardsProps) {
  const [open, setOpen] = useState(false);

  const filterCount =
    filters.title.length +
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0);

  function toggleFilter(
    type: "title" | "dateRange",
    value: string | string[] | null,
  ) {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      title: "",
      dateRange: {
        start: null as string | null,
        end: null as string | null,
      },
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
          <DialogTitle>Filter Boards</DialogTitle>
          <p className="text-sm text-zinc-600">
            Filter boards by title, start date or end date
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Search board by title"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        start: e.target.value || null,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        end: e.target.value || null,
                      },
                    }))
                  }
                />
              </div>
            </div>
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

export default FilterBoards;
