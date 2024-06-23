import { Env } from "@/lib/utils";
import {
  CreateGameResponse,
  GetAllGamesResponse,
  GetGameResponse,
} from "./types";

export class MinesweeperClient {
  private backendUrl: string;
  constructor() {
    this.backendUrl = Env.get("VITE_BACKEND_URL");
  }

  // TODO add validation
  async createNewGame(gridSize: number = 8): Promise<CreateGameResponse> {
    const response = await fetch(this.backendUrl, {
      method: "POST",
      body: JSON.stringify({
        grid_size: gridSize,
      }),
    });
    const json = await response.json();
    return json as CreateGameResponse;
  }

  async getAllGames(): Promise<GetAllGamesResponse> {
    const response = await fetch(this.backendUrl);
    const json = await response.json();
    return json as GetAllGamesResponse;
  }

  async getGame(gameId: string): Promise<GetGameResponse> {
    const response = await fetch(`${this.backendUrl}${gameId}`);
    const json = await response.json();
    return json as GetGameResponse;
  }

  async updateCell(
    gameId: string,
    row: number,
    column: number
  ): Promise<GetGameResponse> {
    const response = await fetch(`${this.backendUrl}${gameId}`, {
      method: "PUT",
      body: JSON.stringify({
        grid_id: gameId,
        row: row,
        column: column,
      }),
    });
    const json = await response.json();
    return json as GetGameResponse;
  }

  async deleteGame(gameId: string) {
    await fetch(`${this.backendUrl}${gameId}`, {
      method: "DELETE",
    });
  }
}
