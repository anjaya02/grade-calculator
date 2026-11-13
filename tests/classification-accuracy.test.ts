import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateHonoursClassification, type DegreeModule } from "../src/lib/degree-classification";
import { getClassificationBand } from "../src/features/grade-calculator/classification";

type Ticket = { id: string; level: "l5" | "l6"; hundredths: number };

// Independent reference: expand modules into 20-credit tickets and enumerate
// EVERY permitted ticket removal, rather than copying the two-candidate code.
function reference(tickets: Ticket[], drop: number | null) {
  const totals = { l5: { sum: 0, count: 0 }, l6: { sum: 0, count: 0 } };
  tickets.forEach((ticket, index) => {
    if (index !== drop) {
      totals[ticket.level].sum += ticket.hundredths;
      totals[ticket.level].count++;
    }
  });
  const { l5, l6 } = totals;
  const numerator = BigInt(l5.count === 0 ? l6.sum : l5.sum * l6.count + 2 * l6.sum * l5.count);
  const denominator = BigInt(l5.count === 0 ? 100 * l6.count : 300 * l5.count * l6.count);
  // Round by comparing the exact remainder to one half.
  const integer = numerator / denominator;
  const rounded = Number(integer + ((numerator % denominator) * 2n >= denominator ? 1n : 0n));
  return { numerator, denominator, rounded };
}

test("seeded records agree with exhaustive independent credit-ticket classification", () => {
  const count = Number(process.env.CLASSIFICATION_CHECK_CASES ?? 20_000);
  assert.ok(Number.isSafeInteger(count) && count > 0 && count <= 1_000_000);
  let seed = 20261113;
  const random = (max: number) => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed % max;
  };
  for (let run = 0; run < count; run++) {
    const modules: DegreeModule[] = [];
    const tickets: Ticket[] = [];
    const level6Only = run % 4 === 0;
    for (const level of level6Only ? ["l6"] as const : ["l5", "l6"] as const) {
      let remaining = 6;
      let index = 0;
      while (remaining) {
        const volume = run % 3 === 0 ? 1 + random(remaining) : (level === "l6" && index === 0 ? 2 : 1);
        const minimum = run % 4 >= 2 ? 40 : 0;
        const hundredths = run % 2 ? minimum * 100 + random(10001 - minimum * 100)
          : 100 * (minimum + random(101 - minimum));
        const id = `${level}-${index++}`;
        modules.push({ id, name: id, level, credits: volume * 20, mark: hundredths / 100 });
        for (let credit = 0; credit < volume; credit++) tickets.push({ id, level, hundredths });
        remaining -= volume;
      }
    }
    const possibilities = level6Only ? [reference(tickets, null)]
      : tickets.map((_, index) => reference(tickets, index));
    const expected = possibilities.reduce((best, score) =>
      score.numerator * best.denominator > best.numerator * score.denominator ? score : best);
    const actual = calculateHonoursClassification(modules);
    assert.ok(actual, `Missing result at seeded record ${run}`);
    assert.equal(actual.roundedIndicatorScore, expected.rounded, `Rounding at record ${run}`);
    assert.ok(Math.abs(actual.indicatorScore - Number(expected.numerator) / Number(expected.denominator)) < 1e-10);
    assert.equal(actual.totalCredits, level6Only ? 120 : 220);
    const failed = tickets.some((ticket) => ticket.hundredths < 4000);
    const expectedClass = failed || expected.rounded < 40 ? "No Honours Classification"
      : expected.rounded >= 70 ? "First Class" : expected.rounded >= 60 ? "Second Upper"
      : expected.rounded >= 50 ? "Second Lower" : "Third Class";
    assert.equal(getClassificationBand(actual.roundedIndicatorScore, actual.modulesBelowPassMark.length > 0).label, expectedClass);
    if (level6Only) {
      assert.equal(actual.disregardedModule, null);
      assert.equal(actual.disregardedCredits, 0);
    } else {
      const removed = tickets.findIndex((ticket) => ticket.id === actual.disregardedModule?.id);
      assert.ok(removed >= 0);
      const chosen = reference(tickets, removed);
      assert.equal(chosen.numerator * expected.denominator, expected.numerator * chosen.denominator, `Selection at record ${run}`);
    }
  }
});
