import React from "react";
import ReactDOM from "react-dom/client";
import RootPage from "./routes/root";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error-page";
import MinesweeperGame from "./routes/minesweeper-game-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameHistoryPage } from "./routes/game-history-page";
import HomePage from "./routes/home-page";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/:gameId",
        element: <MinesweeperGame />,
      },
      {
        path: "/games",
        element: <GameHistoryPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
