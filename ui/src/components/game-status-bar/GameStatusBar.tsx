import { GameStatus } from "@/client/types";
import { Flag, Timer } from "lucide-react";
import { useTimer } from "react-timer-hook";

type GameStatusBarProps = {
  flagCount: number;
  onTimeExpiry: () => void;
  gameStatus: GameStatus;
};

export function GameStatusBar(props: GameStatusBarProps): JSX.Element {
  const time = new Date(Date.now() + 60 * 5000);

  const { seconds, minutes } = useTimer({
    expiryTimestamp: time,
    onExpire: props.onTimeExpiry,
  });

  return (
    <div className="grid grid-cols-2 divide-x">
      <div className="flex items-center justify-center">
        <Flag color="black" className="h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        <h1>: {props.flagCount !== undefined ? props.flagCount : "..."}</h1>
      </div>
      <div className="flex items-center justify-center">
        <Timer color="black" className="h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        {props.gameStatus === "P" ? (
          <h1>
            : {padTime(minutes)}:{padTime(seconds)}
          </h1>
        ) : (
          <h1>: 00:00</h1>
        )}
      </div>
    </div>
  );
}

function padTime(value: number): string {
  return String(value).padStart(2, "0");
}
