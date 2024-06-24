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

  async createDailyGame(): Promise<CreateGameResponse> {
    const response = await fetch(this.backendUrl, {
      method: "POST",
      body: JSON.stringify({
        daily: true,
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
    const response = await fetch(`${this.backendUrl}/${gameId}`);
    const json = await response.json();
    return json as GetGameResponse;
  }

  async loseGame(gameId: string): Promise<GetGameResponse> {
    const response = await fetch(`${this.backendUrl}/${gameId}/lose`, {
      method: "POST",
    });
    const json = await response.json();
    return json as GetGameResponse;
  }

  async flagCell(
    gameId: string,
    row: number,
    column: number
  ): Promise<GetGameResponse> {
    const response = await fetch(`${this.backendUrl}/${gameId}/flag`, {
      method: "POST",
      body: JSON.stringify({
        grid_id: gameId,
        row: row,
        column: column,
      }),
    });
    const json = await response.json();
    return json as GetGameResponse;
  }

  async revealCell(
    gameId: string,
    row: number,
    column: number
  ): Promise<GetGameResponse> {
    const response = await fetch(`${this.backendUrl}/${gameId}/reveal`, {
      method: "POST",
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
    await fetch(`${this.backendUrl}/${gameId}`, {
      method: "DELETE",
    });
  }
}
