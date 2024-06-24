import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MinesweeperClient } from "@/client/MinesweeperClient";
import { BombLoading } from "@/components/bomb-loading";

const getDateInYYYYMMDD = () => {
  const yourDate = new Date();
  const dateString = yourDate.toISOString().split("T")[0];
  return dateString;
};
export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const createDailyGame = async () => {
      const client = new MinesweeperClient();
      try {
        const data = await client.getGame(`daily-${getDateInYYYYMMDD()}`);
        navigate("/" + data.data.grid.id);
      } catch (err) {
        const response = await client.createDailyGame();
        navigate("/" + response.grid_id);
      }
    };

    createDailyGame();
  }, [navigate]);

  return <BombLoading />;
}
