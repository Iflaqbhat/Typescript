export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function assertNever(value: never): never {
  throw new Error(`Unexpected request state: ${JSON.stringify(value)}`);
}

export function describeRequest<T>(
  state: RequestState<T>,
  formatData: (data: T) => string,
): string {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading";
    case "success":
      return `Loaded: ${formatData(state.data)}`;
    case "error":
      return `Error: ${state.message}`;
    default:
      return assertNever(state);
  }
}
