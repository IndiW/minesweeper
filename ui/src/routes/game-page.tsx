import { useParams } from "react-router-dom";
import { GameMetadata, Cells } from "@/client/types";
import { useEffect, useState } from "react";
import { MinesweeperClient } from "@/client/MinesweeperClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GameGrid } from "@/components/game-grid";
import { BombLoading } from "@/components/bomb-loading";
import { GameStatusBar } from "@/components/game-status-bar";
import { CompletionText } from "@/components/completion-text";

export default function MinesweeperGame() {
  const { gameId } = useParams();

  const [gameMetadata, setGameMetadata] = useState<GameMetadata | undefined>(
    undefined
  );
  const [cells, setCells] = useState<Cells>([]);
  const [disableGame, setDisableGame] = useState(false);
  const [flagCount, setFlagCount] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (gameId === undefined) throw new Error("No gameId");
      const client = new MinesweeperClient();
      const response = await client.getGame(gameId);
      return response.data;
    },
    enabled: !!gameId,
  });

  useEffect(() => {
    if (data) {
      setCells(data.cells);
      setGameMetadata(data.grid);
      setFlagCount(
        data.grid.total_mines -
          data.cells.filter((cell) => cell.is_flagged).length
      );
      setDisableGame(["L", "W"].includes(data.grid.status));
    }
  }, [data]);

  const loseGameMutation = useMutation({
    mutationFn: async ({ gameId }: { gameId: string }) => {
      const client = new MinesweeperClient();
      const response = await client.loseGame(gameId);
      return response.data;
    },
    onSuccess: (data) => {
      setCells(data.cells);
      setGameMetadata(data.grid);
      setDisableGame(["L", "W"].includes(data.grid.status));
    },
  });

  const revealCellMutation = useMutation({
    mutationFn: async ({
      gameId,
      row,
      column,
    }: {
      gameId: string;
      row: number;
      column: number;
    }) => {
      const client = new MinesweeperClient();
      const response = await client.revealCell(gameId, row, column);
      return response.data;
    },
    onSuccess: (data) => {
      setCells(data.cells);
      setGameMetadata(data.grid);
      setDisableGame(["L", "W"].includes(data.grid.status));
    },
  });

  const flagCellMutation = useMutation({
    mutationFn: async ({
      gameId,
      row,
      column,
    }: {
      gameId: string;
      row: number;
      column: number;
    }) => {
      const client = new MinesweeperClient();
      const response = await client.flagCell(gameId, row, column);
      return response.data;
    },
    onSuccess: (data) => {
      setCells(data.cells);
      setGameMetadata(data.grid);
      setDisableGame(["L", "W"].includes(data.grid.status));
      setFlagCount(
        data.grid.total_mines - cells.filter((cell) => cell.is_flagged).length
      );
    },
  });

  const handleRightClick = async (row: number, column: number) => {
    if (disableGame || gameId === undefined) return;
    flagCellMutation.mutate({ gameId, row, column });
  };

  const handleCellClick = async (row: number, column: number) => {
    if (disableGame || gameId === undefined) return;

    revealCellMutation.mutate({ gameId, row, column });
  };

  if (gameMetadata === undefined || gameId === undefined)
    return <BombLoading />;

  const handleOnTimeExpiry = () => {
    if (gameMetadata.status === "P") {
      loseGameMutation.mutate({ gameId });
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CompletionText type={gameMetadata.status} />
      </div>
      <GameStatusBar
        key={gameId + "-timer"}
        onTimeExpiry={handleOnTimeExpiry}
        flagCount={flagCount}
        gameStatus={gameMetadata.status}
      />
      <GameGrid
        gameMetadata={gameMetadata}
        cells={cells}
        isLoading={isLoading}
        error={error}
        disableGame={disableGame}
        onCellLeftClick={handleCellClick}
        onCellRightClick={handleRightClick}
      />
    </div>
  );
}
