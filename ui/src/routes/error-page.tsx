import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const errorMessage = typeof error === "string" ? error : "Unknown Error";

  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center w-screen mt-4"
    >
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-3xl text-slate-900">
        Oops!
      </h1>
      <p>Something exploded somewhere.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
