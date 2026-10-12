import assert from "node:assert/strict";
import test from "node:test";
import { getProperty } from "./01-keyof-generics.js";

const learner = { name: "Mina", lessonsCompleted: 3, active: true };

test("returns a property value with its original type", () => {
  const name: string = getProperty(learner, "name");
  const lessonsCompleted: number = getProperty(learner, "lessonsCompleted");
  const active: boolean = getProperty(learner, "active");

  assert.equal(name, "Mina");
  assert.equal(lessonsCompleted, 3);
  assert.equal(active, true);
});

// @ts-expect-error "email" is not a key of learner.
getProperty(learner, "email");

// @ts-expect-error The selected property's value type is inferred as number.
const wrongType: string = getProperty(learner, "lessonsCompleted");
void wrongType;
