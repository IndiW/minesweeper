import { useNavigate, useParams } from "react-router-dom";
import { GameMetadata } from "@/components/game_table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

type Cell = {
  row: number;
  column: number;
  value?: number;
  isRevealed?: boolean;
  isMine?: boolean;
  grid?: string;
  id?: number;
};

type Cells = Array<Cell>;

type FlagsMap = Record<string, boolean>;

export default function MinesweeperGame() {
  const { gameId } = useParams();
  const [gameMetadata, setGameMetadata] = useState<GameMetadata | undefined>(
    undefined
  );
  const [cells, setCells] = useState<Cells>([]);
  const navigate = useNavigate();
  const [flags, setFlags] = useState<FlagsMap>({});

  const handleHome = () => {
    navigate("/");
  };

  const handleRightClick = (row: number, column: number) => {
    setFlags((f) => ({
      ...f,
      [`${row}-${column}`]: !flags[`${row}-${column}`],
    }));
  };

  const handleCellClick = async (row: number, column: number) => {
    if (gameMetadata && gameMetadata?.status !== "P") {
      return;
    }
    const response = await fetch(
      "http://127.0.0.1:8000/minesweeper/" + gameId,
      {
        method: "PUT",
        body: JSON.stringify({
          grid_id: gameId,
          row: row,
          column: column,
        }),
      }
    );

    const json = await response.json();
    setCells(json.data.cells);
    setGameMetadata(json.data.grid);
  };

  useEffect(() => {
    const getGameCells = async (gameId: string) => {
      const response = await fetch(
        "http://127.0.0.1:8000/minesweeper/" + gameId
      );
      const json = await response.json();
      console.log(json);
      setCells(json.data.cells);
      setGameMetadata(json.data.grid);

      for (const cell of json.data.cells) {
        setFlags((f) => ({
          ...f,
          ...{ [`${cell["row"]}-${cell["column"]}`]: false },
        }));
      }
    };

    if (gameId !== undefined) {
      getGameCells(gameId);
    }
  }, [gameId]);

  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <div>
        {gameMetadata?.status === "W" ? (
          <Realistic autorun={{ speed: 10, duration: 10 }} />
        ) : (
          <></>
        )}
      </div>

      <h1>Don't explode</h1>
      {cells.length !== 0 && gameMetadata !== undefined ? (
        <div className={`grid grid-cols-${gameMetadata?.size}`}>
          {cells.map((cell) => (
            <Button
              key={gameMetadata.id + cell.row + cell.column}
              className={`flex items-center justify-center w-8 h-8 border-solid border-2 border-sky-500 ${
                flags[`${cell.row}-${cell.column}`] ? "bg-red-700" : ""
              }`}
              style={{ gridColumn: cell.column + 1, gridRow: cell.row + 1 }}
              onClick={() => handleCellClick(cell.row, cell.column)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleRightClick(cell.row, cell.column);
              }}
            >
              {cell.isMine ? "M" : cell.value}
            </Button>
          ))}
        </div>
      ) : (
        <h1>Loading</h1>
      )}
      <Button onClick={handleHome}>Home</Button>
    </div>
  );
}
