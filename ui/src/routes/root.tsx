import { useEffect, useState } from "react";
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
};
export function GameTable(props: GameTableProps) {
  const [games, setGames] = useState<Games>([]);

  // TODO Add useQuery
  useEffect(() => {
    const getGames = async () => {
      // TODO add to env variable  or constant
      const response = await fetch("http://127.0.0.1:8000/minesweeper/");
      const json = await response.json();
      setGames(json.data);
    };

    getGames();
  }, []);

  const table = (
    <Table>
      <TableCaption>A list of your recent games.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Game</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => {
          return (
            <TableRow key={game.id}>
              <TableCell className="font-medium">{game.id}</TableCell>
              <TableCell>{getGameStatus(game.status)}</TableCell>
              <TableCell className="text-right">
                <Button onClick={() => props.handleResumeGame(game.id)}>
                  Resume
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
  const navigate = useNavigate();
  const handleResumeGame = (gameId: string) => {
    console.log(gameId);
    navigate(`/${gameId}`);
  };
  const handleNewGameClick = async () => {
    const response = await fetch("http://127.0.0.1:8000/minesweeper/", {
      method: "POST",
    });
    const json = await response.json();
    console.log(json["grid_id"]);
  };

  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        MINESWEEPER
      </h1>
      <Button onClick={handleNewGameClick}>New Game</Button>
      <GameTable handleResumeGame={handleResumeGame} />
    </div>
  );
}

export default App;
