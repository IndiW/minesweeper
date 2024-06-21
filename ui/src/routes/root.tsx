import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Env } from "@/lib/utils";
import { GameTable, Games } from "@/components/game_table";
import { Loader2 } from "lucide-react";

function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery<{ data: Games }>({
    queryKey: ["games"],
    queryFn: () => fetch(Env.get("VITE_BACKEND_URL")).then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: (gameId: string) => {
      return fetch(Env.get("VITE_BACKEND_URL") + gameId, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  const handleNewGameClick = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/minesweeper/", {
        method: "POST",
      });
      const json = await response.json();
      navigate(`/${json["grid_id"]}`);
    } catch (err) {
      console.error("Whomp whomp what happened");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGameClick = async (gameId: string) => {
    mutation.mutate(gameId);
  };

  const newGameButton = (
    <Button onClick={handleNewGameClick} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Placing bombs
        </>
      ) : (
        "New Game"
      )}
    </Button>
  );

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-screen">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
        Minesweeper
      </h1>
      {newGameButton}
      <GameTable
        handleDeleteGame={handleDeleteGameClick}
        games={data?.data}
        isLoading={isPending}
        error={error}
      />
    </div>
  );
}

export default App;
