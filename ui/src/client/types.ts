export type GameStatus = "P" | "L" | "W";
export type GameMetadata = {
  id: string;
  size: number;
  status: GameStatus;
};

export type Games = Array<GameMetadata>;

export type Cell = {
  row: number;
  column: number;
  value?: number;
  isRevealed?: boolean;
  isMine?: boolean;
  grid?: string;
  id?: number;
};

export type Cells = Array<Cell>;

export type CreateGameResponse = {
  grid_id: string;
};

export type GetAllGamesResponse = {
  data: Games;
};

export type GetGameResponse = {
  data: {
    grid: GameMetadata;
    cells: Cells;
  };
};
