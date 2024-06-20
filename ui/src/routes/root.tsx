import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Env } from "@/lib/utils";

export type GameStatus = "P" | "L" | "W";
export type GameMetadata = {
  id: string;
  size: number;
  status: GameStatus;
};

export type Games = Array<GameMetadata>;

function getGameStatus(status: GameStatus) {
  const statusMap: Record<GameStatus, "Win" | "Loss" | "In Progress"> = {
    P: "In Progress",
    W: "Win",
    L: "Loss",
  };

  return statusMap[status];
}

type GameTableProps = {
  handleResumeGame: (gameId: string) => void;
  handleDeleteGame: (gameId: string) => void;
  games: Games | undefined;
  isLoading: boolean;
  error: Error | null;
};
export function GameTable(props: GameTableProps) {
  if (props.isLoading || props.games === undefined)
    return <>Loading games...</>;

  if (props.error) return <>Error occurred: {props.error.message}</>;

  const table = (
    <Table>
      <TableCaption>A list of your recent games.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Game</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.games.map((game) => {
          return (
            <TableRow key={game.id}>
              <TableCell className="font-medium">{game.id}</TableCell>
              <TableCell>{getGameStatus(game.status)}</TableCell>
              <TableCell className="text-right">
                <Button onClick={() => props.handleResumeGame(game.id)}>
                  Resume
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => props.handleDeleteGame(game.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return <div>{table}</div>;
}

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

  const handleResumeGame = (gameId: string) => {
    navigate(`/${gameId}`);
  };
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

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        MINESWEEPER
      </h1>
      {loading ? (
        <h1>...</h1>
      ) : (
        <Button onClick={handleNewGameClick}>New Game</Button>
      )}
      <GameTable
        handleResumeGame={handleResumeGame}
        handleDeleteGame={handleDeleteGameClick}
        games={data?.data}
        isLoading={isPending}
        error={error}
      />
    </div>
  );
}

export default App;
