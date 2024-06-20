import { useParams } from "react-router-dom";
import { GameMetadata } from "./root";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Cell = {
  row: number;
  column: number;
  value?: number;
  isRevealed: boolean;
  isMine?: boolean;
  grid: string;
  id: number;
};

type Cells = Array<Cell>;

export default function MinesweeperGame() {
  const { gameId } = useParams();
  const [gameMetadata, setGameMetadata] = useState<GameMetadata | undefined>(
    undefined
  );
  const [cells, setCells] = useState<Cells>([]);

  useEffect(() => {
    const getGameCells = async (gameId: string) => {
      const response = await fetch(
        "http://127.0.0.1:8000/minesweeper/" + gameId
      );
      const json = await response.json();
      console.log(json);
      setCells(json.data.cells);
      setGameMetadata(json.data.grid);
    };

    if (gameId !== undefined) {
      getGameCells(gameId);
    }
  }, [gameId]);

  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <h1>Don't explode</h1>
      {cells.length !== 0 && gameMetadata !== undefined ? (
        <div className={`grid grid-cols-${gameMetadata?.size}`}>
          {cells.map((cell) => (
            <Button
              key={cell.id}
              className="flex items-center justify-center w-8 h-8 border-solid border-2 border-sky-500 "
              style={{ gridColumn: cell.column + 1, gridRow: cell.row + 1 }}
            >
              {cell.isMine ? "M" : cell.value}
            </Button>
          ))}
        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
}
