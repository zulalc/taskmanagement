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
          variant="outline"
          size="sm"
          className={`cursor-pointer text-xs sm:text-sm ${
            filterCount > 0
              ? "bg-brand-card-bg border-brand-primary text-brand-primary"
              : "border-brand-mint"
          }`}
        >
          <Filter className="w-3 h-3 sm:w-4 h:w-4 " /> Filter
          {filterCount > 0 && (
            <Badge className="text-xs text-white bg-brand-primary">
              {filterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-dark">Filter Boards</DialogTitle>
          <p className="text-sm" style={{ color: "#3a5a54" }}>
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
              className="border border-brand-card-bg"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: "#3a5a54" }}>
                  Start Date
                </Label>
                <Input
                  type="date"
                  className="border border-brand-card-bg"
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
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: "#3a5a54" }}>
                  End Date
                </Label>
                <Input
                  type="date"
                  className="border border-brand-card-bg"
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
              variant="outline"
              className="cursor-pointer border border-brand-primary text-brand-primary"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              className="cursor-pointer bg-brand-primary"
              onClick={() => setOpen(false)}
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
