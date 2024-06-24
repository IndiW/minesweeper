import { Bomb } from "lucide-react";

export function BombLoading() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Bomb className="animate-bounce" />
      <p>Loading</p>
    </div>
  );
}
