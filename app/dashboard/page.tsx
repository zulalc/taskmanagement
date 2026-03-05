"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { useUser } from "@clerk/nextjs";
import {
  AlertCircle,
  CheckCheck,
  ClipboardList,
  Filter,
  Grid2X2,
  List,
  Loader2,
  Notebook,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function Page() {
  const { user } = useUser();
  const { createBoard, boards, loading, error } = useBoards();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCreateBoards = async () => {
    await createBoard({ title: "New Board" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <h2 className="text-red-500">Error loading boards</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-5 py-6 sm:py-8 mt-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Welcome back, {user?.username}
          </h1>

          <Button
            variant="default"
            size="sm"
            className="mt-4 flex items-center gap-2 cursor-pointer"
            onClick={handleCreateBoards}
          >
            <Plus size={16} />
            Create New Board
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-lg shadow-sm border border-zinc-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Total Boards
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {boards.length}
                  </p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#d4f5ef] ">
                  <Notebook className="w-5 h-5 sm:w-6 sm:h-6 text-[#008170] " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm border border-zinc-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Total Tasks
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    48
                  </p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100">
                  <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm border border-zinc-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Completed Tasks
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    12
                  </p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100">
                  <CheckCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm border border-zinc-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Overdue Tasks
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">3</p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-100">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/*BOARDS*/}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">
                Your Boards
              </h2>
              <p className="text-sm text-zinc-500">
                Manage your boards and tasks
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0"></div>
            <div className="flex items-center space-x-2 bg-white border p-1">
              <Button
                className="cursor-pointer"
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 />
              </Button>

              <Button
                className="cursor-pointer"
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List />
              </Button>
            </div>

            <Button className="cursor-pointer" variant={"outline"} size="sm">
              <Filter />
              Filter
            </Button>

            <Button onClick={handleCreateBoards} className="cursor-pointer">
              <Plus />
              Create Board
            </Button>
          </div>
        </div>

        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input id="search" placeholder="Search boards..." className="pl-10" />
        </div>

        {boards.length === 0 ? (
          <div>No boards yet.</div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {boards.map((board, key) => (
              <Link href={`/boards/${board.id}`} key={key}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: board.color }}
                      />
                      <Badge className="text-xs" variant={"secondary"}>
                        New
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div
                      style={
                        { "--board-color": board.color } as React.CSSProperties
                      }
                      className="group"
                    >
                      <CardTitle className="text-base sm:text-lg mb-2 transition-colors group-hover:text-(--board-color)">
                        {board.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm mb-4">
                      {board.description}
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-500 space-y-1 sm:space-y-0">
                      <span>
                        Created{" "}
                        {new Date(board.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Updated{" "}
                        {new Date(board.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Card className="border-2 border-dashed border-zinc-300 hover:border-[#008170] cursor-pointer transition-colors group">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 h-full min-h-50">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400 group-hover:text-[#008170]  mb-2" />
                <p className="text-sm sm:text-base text-zinc-600 group-hover:text-[#008170] font-medium">
                  Create New Board
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            {boards.map((board, key) => (
              <div key={key} className={key > 0 ? "mt-4" : ""}>
                <Link href={`/boards/${board.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: board.color }}
                        />
                        <Badge className="text-xs" variant={"secondary"}>
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div
                        style={
                          {
                            "--board-color": board.color,
                          } as React.CSSProperties
                        }
                        className="group"
                      >
                        <CardTitle className="text-base sm:text-lg mb-2 transition-colors group-hover:text-(--board-color)">
                          {board.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm mb-4">
                        {board.description}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-500 space-y-1 sm:space-y-0">
                        <span>
                          Created{" "}
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Updated{" "}
                          {new Date(board.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}

            <Card className="mt-4 border-2 border-dashed border-zinc-300 hover:border-[#008170] cursor-pointer transition-colors group">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 h-full min-h-50">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400 group-hover:text-[#008170]  mb-2" />
                <p className="text-sm sm:text-base text-zinc-600 group-hover:text-[#008170] font-medium">
                  Create New Board
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
