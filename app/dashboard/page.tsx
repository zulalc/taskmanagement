"use client";
import CreateBoard from "@/components/board/CreateBoard";
import DeleteBoard from "@/components/board/DeleteBoard";
import FilterBoards from "@/components/FilterBoards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardsContext } from "@/lib/contexts/BoardsContext";
import { usePlan } from "@/lib/contexts/PlanContext";
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Grid2X2,
  List,
  Loader2,
  Notebook,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function Page() {
  const { boards, stats, refreshStats, loading, error } = useBoardsContext();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { isFreeUser } = usePlan();

  const canCreateBoard = !isFreeUser || (isFreeUser && boards.length < 1);

  const isNew = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  };

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const [filters, setFilters] = useState({
    title: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
  });

  const hasActiveFilters =
    filters.title.length > 0 ||
    !!filters.dateRange.start ||
    !!filters.dateRange.end;

  const filteredBoards = boards.filter((board) => {
    const titleMatch = board.title
      .toLowerCase()
      .includes(filters.title.toLowerCase());

    const matchesDateRange =
      (!filters.dateRange.start ||
        new Date(board.created_at) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end ||
        new Date(board.created_at) <= new Date(filters.dateRange.end));

    return titleMatch && matchesDateRange;
  });

  const visibleBoards = hasActiveFilters ? filteredBoards : boards;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-brand-tint text-brand-dark">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-8">
          <p className="text-xs text-brand-primary font-semibold tracking-widest uppercase mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl text-brand-dark sm:text-3xl font-bold">
            Welcome back!
          </h1>
          <p className="text-sm mt-1" style={{ color: "#3a5a54" }}>
            Here's where things stand today.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Boards",
              value: boards.length,
              icon: Notebook,
              iconBg: "#e0f2fe",
              iconColor: "#0ea5e9",
            },
            {
              label: "Total Tasks",
              value: stats.totalTasks,
              icon: ClipboardList,
              iconBg: "#ede9fe",
              iconColor: "#7c3aed",
            },
            {
              label: "Overdue",
              value: stats.overdueTasks,
              icon: AlertCircle,
              iconBg: "#fee2e2",
              iconColor: "#dc2626",
            },
            {
              label: "Completion",
              value: `${completionRate}%`,
              icon: CheckCircle,
              iconBg: "#dcfce7",
              iconColor: "#16a34a",
            },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="rounded-xl p-4 bg-white sm:p-5 border border-brand-card-bg flex items-center justify-between"
            >
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "#3a5a54" }}
                >
                  {label}
                </p>
                <p className="text-2xl font-bold text-brand-dark">{value}</p>
              </div>
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-dark">
              Your Boards
            </h2>
            {isFreeUser && (
              <p className="text-xs mt-0.5" style={{ color: "#7aada3" }}>
                Free plan · {boards.length} / 1 board used
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center rounded-lg border p-1 gap-1 bg-white border-brand-card-bg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className={`cursor-pointer h-7 w-7 ${viewMode === "grid" ? "bg-brand-primary" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className={`cursor-pointer h-7 w-7 ${viewMode === "list" ? "bg-brand-primary" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <FilterBoards filters={filters} setFilters={setFilters} />
            <CreateBoard canCreateBoard={canCreateBoard} />
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mint" />
          <Input
            placeholder="Search boards..."
            className="pl-10 bg-white border border-brand-card-bg"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        {boards.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-brand-mint flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-brand-card-bg rounded-full flex items-center justify-center mb-4">
              <Notebook className="w-6 h-6 text-brand-primary" />
            </div>
            <p className="font-semibold mb-1 text-brand-dark">No boards yet</p>
            <p className="text-sm mb-6" style={{ color: "#7aada3" }}>
              Create your first board to start organising your work.
            </p>
            <CreateBoard canCreateBoard={canCreateBoard} />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleBoards.map((board) => (
              <Link href={`/boards/${board.id}`} key={board.id}>
                <div className="rounded-xl bg-white border border-brand-card-bg p-5 cursor-pointer hover:shadow-md transition-all group h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{
                          background: board.color + "22",
                          border: `2px solid ${board.color}`,
                        }}
                      >
                        <div
                          className="w-full h-full rounded-md opacity-80"
                          style={{ background: board.color }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {isNew(board.created_at) && (
                          <Badge className="text-xs bg-brand-card-bg text-brand-primary border-none">
                            New
                          </Badge>
                        )}
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <DeleteBoard boardId={board.id} buttonSize="xs" />
                        </div>
                      </div>
                    </div>

                    <p className="font-semibold text-sm mb-1 text-brand-dark group-hover:transition-colors">
                      {board.title}
                    </p>
                    {board.description && (
                      <p
                        className="text-xs leading-relaxed line-clamp-2"
                        style={{ color: "#3a5a54" }}
                      >
                        {board.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-card-bg">
                    <span className="text-xs" style={{ color: "#7aada3" }}>
                      {new Date(board.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs" style={{ color: "#7aada3" }}>
                      Updated {new Date(board.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <CreateBoard
              buttonVariant="ghost"
              canCreateBoard={canCreateBoard}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleBoards.map((board) => (
              <Link href={`/boards/${board.id}`} key={board.id}>
                <div className="bg-white  rounded-xl border border-brand-card-bg px-5 py-4 cursor-pointer hover:shadow-md transition-all group flex items-center gap-4">
                  <div
                    className="w-3 h-10 rounded-full shrink-0"
                    style={{ background: board.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm truncate text-brand-dark">
                        {board.title}
                      </p>
                      {isNew(board.created_at) && (
                        <Badge className="text-xs shrink-0 bg-brand-card-bg text-brand-primary border-none">
                          New
                        </Badge>
                      )}
                    </div>
                    {board.description && (
                      <p
                        className="text-xs truncate"
                        style={{ color: "#3a5a54" }}
                      >
                        {board.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs" style={{ color: "#7aada3" }}>
                      {new Date(board.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs" style={{ color: "#7aada3" }}>
                      Updated {new Date(board.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <DeleteBoard boardId={board.id} buttonSize="sm" />
                  </div>
                </div>
              </Link>
            ))}
            <div className="mt-1">
              <CreateBoard
                buttonVariant="ghost"
                canCreateBoard={canCreateBoard}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Page;
