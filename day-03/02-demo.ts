import { getProperty } from "./01-keyof-generics.js";

const lesson = {
  title: "Generic keys",
  durationMinutes: 15,
  completed: false,
};

console.log(getProperty(lesson, "title"));
console.log(getProperty(lesson, "durationMinutes"));
console.log(getProperty(lesson, "completed"));
