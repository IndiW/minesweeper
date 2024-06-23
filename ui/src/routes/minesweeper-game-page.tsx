import { useParams } from "react-router-dom";
import { GameMetadata, Cells } from "@/client/types";
import { useEffect, useState } from "react";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { MinesweeperClient } from "@/client/MinesweeperClient";
import { GameCell } from "@/components/game-cell";
import { Bomb, Flag, Timer } from "lucide-react";

type FlagsMap = {
  totalFlags: number;
  flagStates: Record<string, boolean>;
};

export default function MinesweeperGame() {
  const { gameId } = useParams();
  const [gameMetadata, setGameMetadata] = useState<GameMetadata | undefined>(
    undefined
  );
  const [cells, setCells] = useState<Cells>([]);

  const [flags, setFlags] = useState<FlagsMap>({
    totalFlags: 0,
    flagStates: {},
  });
  const [disableGame, setDisableGame] = useState(false);

  const handleRightClick = (
    row: number,
    column: number,
    isRevealed: boolean
  ) => {
    if (disableGame || isRevealed) return;
    const flagKey = `${row}-${column}`;
    const currentTotal = flags.totalFlags;
    const newTotalCount = flags.flagStates[flagKey]
      ? currentTotal - 1
      : currentTotal + 1;
    setFlags((f) => ({
      totalFlags: newTotalCount,
      flagStates: {
        ...f.flagStates,
        [flagKey]: !flags.flagStates[flagKey],
      },
    }));
  };

  const handleCellClick = async (
    row: number,
    column: number,
    isRevealed: boolean
  ) => {
    if (isRevealed || disableGame || gameId === undefined) return;

    // practice mode
    if (gameMetadata && gameMetadata?.status !== "P") {
      return;
    }

    const client = new MinesweeperClient();
    const data = await client.updateCell(gameId, row, column);

    setCells(data.data.cells);
    setGameMetadata(data.data.grid);
    if (["L", "W"].includes(data.data.grid.status)) {
      setDisableGame(true);
    }
  };

  // TODO use useQuery
  // TODO add loading, error handling
  useEffect(() => {
    const getGameCells = async (gameId: string) => {
      const client = new MinesweeperClient();
      const data = await client.getGame(gameId);
      setCells(data.data.cells);
      setGameMetadata(data.data.grid);

      if (["L", "W"].includes(data.data.grid.status)) {
        setDisableGame(true);
      }

      for (const cell of data.data.cells) {
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

  const gameStatusBar = (
    <div className="grid grid-cols-2 divide-x">
      <div className="flex items-center justify-center">
        <Flag color="black" className="h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        <h1>: {flags.totalFlags}</h1>
      </div>
      <div className="flex items-center justify-center">
        <Timer color="black" className="h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        <h1>: 0</h1>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        {gameMetadata?.status === "W" ? (
          <Realistic autorun={{ speed: 10, duration: 10 }} />
        ) : (
          <></>
        )}
      </div>

      {gameStatusBar}
      {cells.length !== 0 && gameMetadata !== undefined ? (
        <div className={`grid grid-cols-${gameMetadata?.size}`}>
          {cells.map((cell) => {
            const hasFlag = flags.flagStates[`${cell.row}-${cell.column}`];
            const cellValue = cell.isMine ? (
              <Bomb className="h-4 w-4" />
            ) : cell.value !== undefined ? (
              cell.value.toString()
            ) : undefined;

            return (
              <GameCell
                isMine={!!cell.isMine}
                isDisabled={disableGame}
                key={gameMetadata.id + cell.row + cell.column}
                gridColumn={cell.column + 1}
                gridRow={cell.row + 1}
                onLeftClick={() =>
                  handleCellClick(cell.row, cell.column, !!cell.isRevealed)
                }
                onRightClick={(e) => {
                  e.preventDefault();
                  handleRightClick(cell.row, cell.column, !!cell.isRevealed);
                }}
                value={cellValue}
                isFlagged={hasFlag}
              />
            );
          })}
        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
}
