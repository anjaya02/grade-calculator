import assert from "node:assert/strict";
import { test } from "node:test";
import { parseMarkInput } from "../src/features/grade-calculator/mark-validation";

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
