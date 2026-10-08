export type TrainingExample = { prompt: string; answer: string };

export function parseExample(row: string): TrainingExample {
  const value: unknown = JSON.parse(row);
  if (
    typeof value !== "object" || value === null ||
    !("prompt" in value) || typeof value.prompt !== "string" ||
    !("answer" in value) || typeof value.answer !== "string"
  ) {
    throw new TypeError("Expected a prompt and answer, both strings");
  }
  return { prompt: value.prompt, answer: value.answer };
}

export function createLazyDataset(
  rows: readonly string[],
  parse: (row: string) => TrainingExample = parseExample,
) {
  // Copy the row references so later changes to the caller's array are isolated.
  const source = rows.slice();
  return {
    length: source.length,
    get(index: number): TrainingExample {
      const row = source[index];
      if (!Number.isInteger(index) || index < 0 || row === undefined) {
        throw new RangeError("Example index is out of range");
      }
      return parse(row);
    },
  };
}
