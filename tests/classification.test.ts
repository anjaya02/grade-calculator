import assert from "node:assert/strict";
import { test } from "node:test";
import { getClassificationBand } from "../src/features/grade-calculator/classification";

for (const [score, label] of [
  [0, "No Honours Classification"],
  [39, "No Honours Classification"],
  [40, "Third Class"],
  [49, "Third Class"],
  [50, "Second Lower"],
  [59, "Second Lower"],
  [60, "Second Upper"],
  [69, "Second Upper"],
  [70, "First Class"],
  [100, "First Class"],
] as const) {
  test(`rounded score ${score} is classified as ${label}`, () => {
    assert.equal(getClassificationBand(score).label, label);
  });
}

test("a failed module prevents an Honours classification at every passing score band", () => {
  for (const score of [40, 50, 60, 70, 100]) {
    assert.equal(
      getClassificationBand(score, true).label,
      "No Honours Classification",
      `A failed module must block Honours even with an indicator of ${score}`,
    );
  }
});
