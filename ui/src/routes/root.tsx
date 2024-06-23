import { Button } from "@/components/ui/button";
import { useNavigate, Outlet } from "react-router-dom";

export default function RootPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-screen mt-4">
      <Button
        className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-3xl text-slate-900"
        onClick={() => navigate("/")}
        variant="ghost"
      >
        Minesweeper
      </Button>
      <hr className="h-px my-4 bg-gray-800 border-1 dark:bg-gray-700 w-full"></hr>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
