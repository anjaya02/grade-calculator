import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeMarkInput, parseMarkInput } from "../src/features/grade-calculator/mark-validation";
import { isValidMark } from "../src/lib/marks";

test("removes repeated leading zeroes while preserving decimal edits", () => {
  for (const [input, expected] of [
    ["00000", "0"], ["00", "0"], ["082.34", "82.34"],
    ["000.05", "0.05"], ["0.05", "0.05"], ["0.00", "0.00"],
    ["0.", "0."], ["82.0", "82.0"], ["", ""], [".", "."],
  ]) {
    assert.equal(normalizeMarkInput(input), expected, input);
  }
});

test("accepts marks from 0 to 100 with at most two decimal places", () => {
  for (const value of ["0", "0.00", "0.01", ".5", "82", "82.3", "82.34", "82.04", "99.99", "100", "100.00"]) {
    assert.equal(parseMarkInput(value), Number(value), value);
  }
});

test("rejects excess precision, out-of-range marks, and malformed pasted input", () => {
  for (const value of ["82.345484849", "82.345", "82.340", "0.001", "100.001", "100.01", "101", "-1", "1e2", "0x10", "82abc", "82.3.4", "NaN", "Infinity", " 82.34 ", "82,34", "+82", "82\n"]) {
    assert.equal(parseMarkInput(value), undefined, value);
  }
});

test("supports clearing and intermediate decimal input without losing zeroes", () => {
  assert.equal(parseMarkInput(""), null);
  assert.equal(parseMarkInput("."), null);
  for (const value of ["82", "82.", "82.0", "82.04"]) {
    assert.equal(parseMarkInput(value), Number(value), value);
  }
});

test("accepts every hundredth from 0 to 100 without floating-point rejection", () => {
  for (let hundredths = 0; hundredths <= 10_000; hundredths++) {
    const value = (hundredths / 100).toFixed(2);
    assert.equal(parseMarkInput(value), hundredths / 100, value);
    assert.equal(isValidMark(hundredths / 100), true, value);
    assert.equal(normalizeMarkInput(`000${value}`), value, value);
  }
});

test("rejects signs, alternate number formats, invisible characters, and long pastes", () => {
  for (const value of [
    "-0", "-0.01", "+0", "1E2", "1e-2", "0b10", "0o10", "1_0",
    "82%", "82/100", "8 2", "8\t2", "82\r", "82\r\n", "\t82", "\u00a082",
    "82\u200b", "８２", "٨٢", "82٫34", "..", "0..1", "0.0.1",
    "9".repeat(10_000), `0.${"0".repeat(10_000)}1`,
  ]) {
    assert.equal(parseMarkInput(value), undefined, JSON.stringify(value.slice(0, 30)));
  }
});

test("numeric validation rejects missing, non-finite, out-of-range, and overprecise marks", () => {
  for (const value of [undefined, null, "82.34", true, {}, [], NaN, Infinity, -Infinity,
    -0.01, 100.01, 82.345, 39.999, 0.001, Number.MIN_VALUE, 0.1 + 0.2]) {
    assert.equal(isValidMark(value), false, String(value));
  }
});
