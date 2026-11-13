import assert from "node:assert/strict";
import { test } from "node:test";
import { displayAverage, displayRatio, roundRatio } from "../src/lib/exact-arithmetic";

test("display prefixes never promote a value across a rounding boundary", () => {
  for (const [numerator, denominator, display, rounded] of [
    [139n, 2n, "69.5", 70],
    [6949999999n, 100000000n, "69.499999…", 69],
    [6950000001n, 100000000n, "69.500000…", 70],
    [100n, 1n, "100", 100],
    [610n, 9n, "67.777777…", 68],
    [0n, 1n, "0", 0],
  ] as const) {
    const ratio = { numerator, denominator };
    assert.equal(displayRatio(ratio), display);
    assert.equal(roundRatio(ratio), rounded);
  }
});

test("compact averages mark display rounding without changing the exact value", () => {
  for (const [numerator, denominator, display] of [
    [7066n, 100n, "70.66"], [69405n, 1000n, "≈69.41"],
    [100n, 1n, "100"], [0n, 1n, "0"],
    [61777666n, 1000000n, "≈61.78"], [99999n, 1000n, "≈100"],
  ] as const) {
    assert.equal(displayAverage({ numerator, denominator }), display);
  }
});
