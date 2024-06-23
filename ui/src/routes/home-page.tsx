import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { MinesweeperClient } from "@/client/MinesweeperClient";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNewGameClick = async () => {
    try {
      setLoading(true);
      const client = new MinesweeperClient();
      const data = await client.createNewGame();
      navigate(`/${data.grid_id}`);
    } catch (err) {
      console.error("Whomp whomp what happened");
    } finally {
      setLoading(false);
    }
  };

  const newGameButton = (
    <Button onClick={handleNewGameClick} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Placing bombs
        </>
      ) : (
        "New Game"
      )}
    </Button>
  );

  return (
    <div>
      {newGameButton}
      <Button onClick={() => navigate("/games")}>Game History</Button>
    </div>
  );
}
