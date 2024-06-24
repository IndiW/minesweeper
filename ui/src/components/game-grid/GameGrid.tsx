import { Cells, GameMetadata } from "@/client/types";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { GameCell } from "../game-cell";
import { Fragment } from "react/jsx-runtime";

type GameGridProps = {
  gameMetadata: GameMetadata;
  cells: Cells;
  isLoading: boolean;
  error: Error | null;
  disableGame: boolean;
  onCellLeftClick: (row: number, column: number) => void;
  onCellRightClick: (row: number, column: number) => void;
};
export function GameGrid(props: GameGridProps): JSX.Element {
  if (props.isLoading) return <>Loading</>;
  if (props.error) return <>Error</>;

  return (
    <>
      <div>
        {props.gameMetadata.status === "W" ? (
          <Realistic autorun={{ speed: 10, duration: 10 }} />
        ) : (
          <></>
        )}
      </div>
      <div className={`grid grid-cols-${props.gameMetadata.size}`}>
        {props.cells.map((cell) => {
          return (
            <Fragment key={props.gameMetadata.id + cell.row + cell.column}>
              {cell.is_mine ? (
                <Explosion
                  autorun={{ speed: 30, duration: 30 }}
                  decorateOptions={() => {
                    return {
                      particleCount: 50,
                      spread: 200,
                      ticks: 60,
                      colors: ["#ff0000"],
                      shapes: ["circle"],
                      gravity: 0.6,
                    };
                  }}
                />
              ) : (
                <></>
              )}
              <GameCell
                isMine={!!cell.is_mine}
                isDisabled={props.disableGame}
                gridColumn={cell.column + 1}
                gridRow={cell.row + 1}
                onLeftClick={() => props.onCellLeftClick(cell.row, cell.column)}
                onRightClick={(e) => {
                  e.preventDefault();
                  props.onCellRightClick(cell.row, cell.column);
                }}
                value={cell.value}
                isFlagged={!!cell.is_flagged}
              />
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
