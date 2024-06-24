import { Button } from "@/components/ui/button";
import { useNavigate, Outlet } from "react-router-dom";
import { Bomb, Loader2 } from "lucide-react";
import { MinesweeperClient } from "@/client/MinesweeperClient";
import { useMutation } from "@tanstack/react-query";

export default function RootPage() {
  const navigate = useNavigate();

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const client = new MinesweeperClient();
      const data = await client.createNewGame();
      return data;
    },
    onSuccess: (data) => {
      navigate(`/${data.grid_id}`);
    },
    onError: (error) => {
      console.error("Whomp whomp what happened", error);
    },
  });

  const handleNewGameClick = async () => {
    createGameMutation.mutate();
  };

  const newGameButton = (
    <Button
      onClick={handleNewGameClick}
      disabled={createGameMutation.isPending}
      variant="link"
    >
      {createGameMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Placing bombs
        </>
      ) : (
        "Random New Game"
      )}
    </Button>
  );

  const logo = (
    <Button
      className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-3xl text-slate-900"
      onClick={() => navigate("/")}
      variant="ghost"
    >
      <Bomb className="h-8 w-8" />
      Sweeper
    </Button>
  );

  return (
    <div className="flex flex-col items-center justify-center w-screen mt-4">
      <div className="flex flex-row items-center justify-center w-screen mt-4">
        {logo}
        <Button variant="link" onClick={() => navigate("/games")}>
          Game History
        </Button>
        {newGameButton}
      </div>
      <hr className="h-px my-4 bg-gray-800 border-1 dark:bg-gray-700 w-full"></hr>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
