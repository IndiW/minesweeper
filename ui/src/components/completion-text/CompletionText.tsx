import { GameStatus } from "@/client/types";

interface CompletionTextProps {
  type: GameStatus;
}

export function CompletionText({ type }: CompletionTextProps) {
  if (type === "P") {
    return <></>;
  }

  return (
    <>
      {type === "W" ? (
        <h1
          className={`animate-slidein max-w-lg text-6xl font-semibold leading-relaxed bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text`}
        >
          Victory!
        </h1>
      ) : (
        <h1
          className={`animate-slidein max-w-lg text-center text-6xl font-semibold leading-relaxed bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 inline-block text-transparent bg-clip-text`}
        >
          You exploded!
        </h1>
      )}
    </>
  );
}
