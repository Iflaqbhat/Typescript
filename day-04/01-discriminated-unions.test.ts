import assert from "node:assert/strict";
import test from "node:test";
import { describeRequest, type RequestState } from "./01-discriminated-unions.js";

test("describes states that do not contain data", () => {
  const format = () => assert.fail("Only a successful request has data");
  assert.equal(describeRequest({ status: "idle" }, format), "Not started");
  assert.equal(describeRequest({ status: "loading" }, format), "Loading");
  assert.equal(
    describeRequest({ status: "error", message: "Connection lost" }, format),
    "Error: Connection lost",
  );
});

test("passes success data to the formatter exactly once", () => {
  const lesson = { title: "Discriminated unions", minutes: 15 };
  const calls: (typeof lesson)[] = [];
  const description = describeRequest(
    { status: "success", data: lesson },
    (data) => {
      calls.push(data);
      return `${data.title} (${data.minutes} minutes)`;
    },
  );
  assert.equal(description, "Loaded: Discriminated unions (15 minutes)");
  assert.deepEqual(calls, [lesson]);
});

test("does not mistake falsy success data for a missing result", () => {
  for (const data of [0, false, "", null]) {
    assert.equal(
      describeRequest({ status: "success", data }, String),
      `Loaded: ${String(data)}`,
    );
  }
});

// This function is checked by tsc, not called with invalid runtime values.
function checkTypes(state: RequestState<number>): void {
  // @ts-expect-error Data is not available until status is narrowed to success.
  const premature: number = state.data;
  void premature;

  if (state.status === "success") {
    const result: number = state.data;
    void result;
  }

  // @ts-expect-error A successful request must contain its data.
  const missingData: RequestState<number> = { status: "success" };
  // @ts-expect-error Success data must match the declared generic type.
  const wrongData: RequestState<number> = { status: "success", data: "15" };
  // @ts-expect-error An error requires a message, not success data.
  const wrongError: RequestState<number> = { status: "error", data: 15 };
  void missingData;
  void wrongData;
  void wrongError;
}
void checkTypes;
