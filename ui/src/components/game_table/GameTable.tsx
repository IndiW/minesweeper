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
import { Trash } from "lucide-react";

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
    <Table className="w-full">
      <TableCaption>A list of your recent games.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">GameId</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.games.map((game) => {
          return (
            <TableRow key={game.id}>
              <TableCell className="font-medium">
                <a
                  href={`/${game.id}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  {game.id}
                </a>
              </TableCell>
              <TableCell>{getGameStatus(game.status)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => props.handleDeleteGame(game.id)}
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                >
                  <Trash color={"red"} />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return table;
}
