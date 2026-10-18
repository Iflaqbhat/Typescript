import { describeRequest, type RequestState } from "./01-discriminated-unions.js";

type Lesson = { title: string; completed: boolean };

const states: RequestState<Lesson>[] = [
  { status: "idle" },
  { status: "loading" },
  { status: "success", data: { title: "Union types", completed: false } },
  { status: "error", message: "Could not load the lesson" },
];

for (const state of states) {
  console.log(describeRequest(state, (lesson) => lesson.title));
}
