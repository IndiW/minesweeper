export type GameStatus = "P" | "L" | "W";
export type GameMetadata = {
  id: string;
  size: number;
  status: GameStatus;
  total_mines: number;
};

export type Games = Array<GameMetadata>;

export type Cell = {
  row: number;
  column: number;
  value?: number;
  is_revealed?: boolean;
  is_mine?: boolean;
  grid?: string;
  id?: number;
  is_flagged?: boolean;
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
