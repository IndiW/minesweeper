import { Bomb, Flag } from "lucide-react";
import { Button } from "../ui/button";

type GameCellProps = {
  isDisabled: boolean;
  isFlagged: boolean;
  isMine: boolean;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  value: string | number | JSX.Element | undefined;
  gridColumn: number;
  gridRow: number;
};

// TODO handle mobile click scenario
export function GameCell(props: GameCellProps): JSX.Element {
  const getCellValue = () => {
    if (props.isMine) {
      return <Bomb className="h-4 w-4" />;
    } else if (props.isFlagged) {
      return (
        <Flag
          color="red"
          fill="red"
          className="h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
        />
      );
    } else if (props.value !== undefined) {
      return <>{props.value.toString()}</>;
    } else {
      return <></>;
    }
  };

  return (
    <Button
      disabled={props.isDisabled}
      className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border-solid border-2 border-slate-700 ${
        props.isMine
          ? "bg-red-800 disabled:bg-red-800"
          : "bg-slate-800 disabled:bg-slate-800"
      } hover:bg-slate-600 disabled:opacity-100`}
      style={{ gridColumn: props.gridColumn, gridRow: props.gridRow }}
      onClick={props.isFlagged ? undefined : props.onLeftClick}
      onContextMenu={props.onRightClick}
      size={"icon"}
    >
      {getCellValue()}
    </Button>
  );
}
