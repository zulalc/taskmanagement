import { BoardsProvider } from "@/lib/contexts/BoardsContext";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BoardsProvider>{children}</BoardsProvider>;
}
