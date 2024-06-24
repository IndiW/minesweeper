import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GameTable } from "@/components/game-table";

import { MinesweeperClient } from "@/client/MinesweeperClient";
import { Games } from "@/client/types";

export function GameHistoryPage(): JSX.Element {
  const client = new MinesweeperClient();
  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery<{ data: Games }>({
    queryKey: ["games"],
    queryFn: () => client.getAllGames(),
  });

  const mutation = useMutation({
    mutationFn: (gameId: string) => {
      return client.deleteGame(gameId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  const handleDeleteGameClick = async (gameId: string) => {
    mutation.mutate(gameId);
  };

  return (
    <GameTable
      handleDeleteGame={handleDeleteGameClick}
      games={data?.data}
      isLoading={isPending}
      error={error}
    />
  );
}
