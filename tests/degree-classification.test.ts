import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateHonoursClassification,
  type DegreeModule,
} from "../src/lib/degree-classification";
import { getClassificationBand } from "../src/features/grade-calculator/classification";
import { computerScienceConfig } from "../src/features/grade-calculator/data/computer-science";
import { softwareEngineeringConfig } from "../src/features/grade-calculator/data/software-engineering";
import type { Mark } from "../src/lib/marks";

// A full 240-credit degree: six 20-credit L5 modules, a 40-credit L6
// project, and four 20-credit L6 modules. Expectations below are hand-calculated.
function degree(l5Marks: Mark[], l6Marks: Mark[]): DegreeModule[] {
  assert.equal(l5Marks.length, 6);
  assert.equal(l6Marks.length, 5);
  return [
    ...l5Marks.map((mark, index): DegreeModule => ({
      id: `l5-${index}`, name: `Level 5 module ${index}`, level: "l5",
      credits: 20, mark,
    })),
    ...l6Marks.map((mark, index): DegreeModule => ({
      id: `l6-${index}`, name: index === 0 ? "Final Year Project" : `Level 6 module ${index}`,
      level: "l6", credits: index === 0 ? 40 : 20, mark,
    })),
  ];
}

function uniformDegree(mark: Mark): DegreeModule[] {
  return degree(Array<Mark>(6).fill(mark), Array<Mark>(5).fill(mark));
}

function calculate(modules: DegreeModule[]) {
  const result = calculateHonoursClassification(modules);
  assert.ok(result, "Expected a calculated result");
  return result;
}

function closeTo(actual: number | null, expected: number) {
  assert.ok(actual !== null);
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `Expected ${actual} to be within 1e-9 of ${expected}`,
  );
}

test("no result is produced without any modules or without Level 6 credits", () => {
  assert.equal(calculateHonoursClassification([]), null);
  assert.equal(
    calculateHonoursClassification(uniformDegree(75).filter((module) => module.level === "l5")),
    null,
  );
});

test("invalid marks never produce a classification, even if they would be disregarded", () => {
  for (const mark of [NaN, Infinity, -Infinity, -0.01, 100.01, "100.000000000000000001", "NaN", "70%", ""]) {
    for (const index of [0, 6]) {
      const modules = uniformDegree(75);
      modules[index].mark = mark;
      assert.equal(calculateHonoursClassification(modules), null, `${index}: ${mark}`);
    }
  }
});

test("disregards the lowest Level 5 module and weights the remaining levels one-third/two-thirds", () => {
  const result = calculate(degree([40, 60, 70, 80, 90, 100], [75, 75, 75, 75, 75]));

  assert.equal(result.disregardedModule?.id, "l5-0");
  assert.equal(result.disregardedCredits, 20);
  assert.equal(result.l5Credits, 100);
  assert.equal(result.l6Credits, 120);
  assert.equal(result.totalCredits, 220);
  assert.equal(result.l5Average, 80);
  assert.equal(result.l6Average, 75);
  closeTo(result.indicatorScore, 230 / 3);
  assert.equal(result.roundedIndicatorScore, 77);
});

test("disregards a lowest 20-credit Level 6 module and gives the project double weight", () => {
  const result = calculate(degree([70, 70, 70, 70, 70, 70], [80, 40, 60, 70, 90]));

  // Retained L6 marks are 80 twice, 60, 70, 90: average 76.
  assert.equal(result.disregardedModule?.id, "l6-1");
  assert.equal(result.disregardedCredits, 20);
  assert.equal(result.l5Credits, 120);
  assert.equal(result.l6Credits, 100);
  assert.equal(result.totalCredits, 220);
  assert.equal(result.l5Average, 70);
  assert.equal(result.l6Average, 76);
  assert.equal(result.indicatorScore, 74);
  assert.equal(result.roundedIndicatorScore, 74);
});

test("disregards only 20 credits of a lowest 40-credit project and retains its other 20 credits", () => {
  const result = calculate(degree([70, 70, 70, 70, 70, 70], [40, 60, 70, 80, 90]));

  // The retained project mark of 40 still counts: (40+60+70+80+90)/5 = 68.
  assert.equal(result.disregardedModule?.id, "l6-0");
  assert.equal(result.disregardedModule?.credits, 40);
  assert.equal(result.disregardedCredits, 20);
  assert.equal(result.l6Credits, 100);
  assert.equal(result.totalCredits, 220);
  assert.equal(result.l6Average, 68);
  closeTo(result.indicatorScore, 206 / 3);
  assert.equal(result.roundedIndicatorScore, 69);
});

test("compares indicators even when lowest marks tie across levels, regardless of input order", () => {
  const modules = degree([40, 70, 70, 70, 70, 70], [80, 40, 70, 70, 70]);

  for (const input of [modules, [...modules].reverse()]) {
    const result = calculate(input);
    assert.equal(result.disregardedModule?.id, "l6-1");
    assert.equal(result.l5Credits, 120);
    assert.equal(result.l6Credits, 100);
    assert.equal(result.l5Average, 65);
    assert.equal(result.l6Average, 74);
    assert.equal(result.indicatorScore, 71);
  }
});

test("2026–27 uses the higher candidate even when the other level has the lowest mark overall", () => {
  const result = calculate(degree([40, 65, 65, 65, 65, 65], [75, 50, 75, 75, 75]));
  assert.equal(result.disregardedModule?.id, "l6-1");
  assert.equal(result.l5Credits, 120);
  assert.equal(result.l6Credits, 100);
  closeTo(result.l5Average, 365 / 6);
  assert.equal(result.l6Average, 75);
  closeTo(result.indicatorScore, 1265 / 18);
  assert.equal(result.roundedIndicatorScore, 70);
  assert.equal(result.candidates.length, 2);
  assert.equal(getClassificationBand(result.roundedIndicatorScore).label, "First Class");
});

test("a tied lowest mark can require dropping Level 5 instead of Level 6", () => {
  const result = calculate(degree([40, 100, 100, 100, 100, 100], [42, 40, 42, 42, 42]));
  assert.equal(result.disregardedModule?.id, "l5-0");
  assert.equal(result.roundedIndicatorScore, 61);
});

test("mixed decimal marks with an exact 69.5 indicator round to First Class", () => {
  const result = calculate(degree(
    [40, 74.72, 66.55, 64.97, 72.51, 69.70],
    [73.14, 68.39, 71.22, 64.36, 66.18],
  ));
  assert.equal(result.disregardedModule?.id, "l5-0");
  assert.equal(result.indicatorScoreDisplay, "69.5");
  assert.equal(result.roundedIndicatorScore, 70);
});

test("decimal boundaries remain exact beyond Number precision", () => {
  for (const boundary of [49, 59, 69]) {
    for (const level6Only of [false, true]) {
      const record = (mark: Mark) => uniformDegree(mark).filter((module) => !level6Only || module.level === "l6");
      const below = calculate(record(`${boundary}.499999999999999999999999`));
      const half = calculate(record(`${boundary}.5`));
      const above = calculate(record(`${boundary}.500000000000000000000001`));
      assert.equal(below.roundedIndicatorScore, boundary);
      assert.equal(half.roundedIndicatorScore, boundary + 1);
      assert.equal(above.roundedIndicatorScore, boundary + 1);
      assert.equal(below.indicatorScoreDisplay, `${boundary}.499999…`);
    }
  }
  assert.equal(calculate(uniformDegree("39.999999999999999999999999")).modulesBelowPassMark.length, 11);
  assert.equal(calculate(uniformDegree("40.000000000000000000000001")).modulesBelowPassMark.length, 0);
});

test("marks far beyond binary floating-point precision do not overflow the calculation", () => {
  const mark = `69.5${"0".repeat(900)}1`;
  const result = calculate(uniformDegree(mark));
  assert.equal(result.roundedIndicatorScore, 70);
  assert.equal(result.indicatorScoreDisplay, "69.500000…");
  assert.ok(Number.isFinite(result.indicatorScore));
});

test("invalid credit metadata, duplicate IDs, and unsupported totals produce no result", () => {
  for (const credits of [0, -20, 10, 20.5, NaN, Infinity, 140]) {
    const modules = uniformDegree(70);
    modules[0].credits = credits;
    assert.equal(calculateHonoursClassification(modules), null, String(credits));
  }
  for (const change of [
    (modules: DegreeModule[]) => { modules[1].id = modules[0].id; },
    (modules: DegreeModule[]) => { modules[0].id = " "; },
    (modules: DegreeModule[]) => { modules[0].name = ""; },
    (modules: DegreeModule[]) => { modules[0].credits = 40; },
    (modules: DegreeModule[]) => { modules[0].level = "l4" as "l5"; },
    (modules: DegreeModule[]) => { modules.pop(); },
    (modules: DegreeModule[]) => { modules.shift(); },
  ]) {
    const modules = uniformDegree(70);
    change(modules);
    assert.equal(calculateHonoursClassification(modules), null);
  }
});

test("equal provisional indicators have an order-independent result", () => {
  const modules = uniformDegree("70.66");
  const forward = calculate(modules);
  const reverse = calculate([...modules].reverse());
  assert.equal(forward.roundedIndicatorScore, 71);
  assert.equal(forward.indicatorScoreDisplay, "70.66");
  assert.equal(forward.disregardedModule?.id, reverse.disregardedModule?.id);
});

test("retains fractional level averages until the final indicator is rounded", () => {
  const result = calculate(degree(
    Array<number>(6).fill(61.49),
    Array<number>(5).fill(60.49),
  ));

  closeTo(result.l5Average, 61.49);
  closeTo(result.l6Average, 60.49);
  closeTo(result.indicatorScore, 60.82333333333333);
  // Rounding the two level averages first would incorrectly produce 60.
  assert.equal(result.roundedIndicatorScore, 61);
});

for (const [mark, rounded, label] of [
  [49.49, 49, "Third Class"],
  [49.5, 50, "Second Lower"],
  [59.49, 59, "Second Lower"],
  [59.5, 60, "Second Upper"],
  [69.49, 69, "Second Upper"],
  [69.5, 70, "First Class"],
] as const) {
  test(`indicator ${mark} rounds to ${rounded} before classification as ${label}`, () => {
    const result = calculate(uniformDegree(mark));
    closeTo(result.indicatorScore, mark);
    assert.equal(result.roundedIndicatorScore, rounded);
    assert.equal(
      getClassificationBand(result.roundedIndicatorScore, result.modulesBelowPassMark.length > 0).label,
      label,
    );
  });
}

for (const mark of [0, 40, 50, 60, 70, 100]) {
  test(`uniform ${mark}% marks retain their score and exactly 220 credits`, () => {
    const result = calculate(uniformDegree(mark));
    assert.equal(result.l5Average, mark);
    assert.equal(result.l6Average, mark);
    closeTo(result.indicatorScore, mark);
    assert.equal(result.roundedIndicatorScore, mark);
    assert.equal(result.disregardedModule?.level, "l6");
    assert.equal(result.disregardedCredits, 20);
    assert.equal(result.totalCredits, 220);
    assert.equal(result.modulesBelowPassMark.length, mark < 40 ? 11 : 0);
  });
}

test("a disregarded failing module still blocks Honours despite a 90% indicator", () => {
  for (const failingMark of [0, 39, 39.99]) {
    const result = calculate(degree([failingMark, 90, 90, 90, 90, 90], [90, 90, 90, 90, 90]));
    assert.equal(result.roundedIndicatorScore, 90);
    assert.equal(result.disregardedModule?.id, "l5-0");
    assert.deepEqual(result.modulesBelowPassMark.map((module) => module.id), ["l5-0"]);
    assert.equal(
      getClassificationBand(result.roundedIndicatorScore, result.modulesBelowPassMark.length > 0).label,
      "No Honours Classification",
    );
  }
});

test("a mark of exactly 40 passes while a fractional mark below 40 fails", () => {
  const result = calculate(degree([40, 90, 90, 90, 90, 90], [90, 90, 90, 90, 90]));
  assert.deepEqual(result.modulesBelowPassMark, []);
  assert.equal(getClassificationBand(result.roundedIndicatorScore, false).label, "First Class");

  // A 39.5 indicator rounds to 40, but the original failed module marks remain.
  const failed = calculate(uniformDegree(39.5));
  assert.equal(failed.roundedIndicatorScore, 40);
  assert.equal(failed.modulesBelowPassMark.length, 11);
  assert.equal(
    getClassificationBand(failed.roundedIndicatorScore, failed.modulesBelowPassMark.length > 0).label,
    "No Honours Classification",
  );
});

test("reports both disregarded and retained failures, including a 40-credit project", () => {
  const result = calculate(degree([80, 80, 80, 80, 80, 80], [39, 20, 80, 80, 80]));
  assert.equal(result.disregardedModule?.id, "l6-1");
  assert.deepEqual(result.modulesBelowPassMark.map((module) => module.id), ["l6-0", "l6-1"]);
  assert.equal(result.modulesBelowPassMark[0].credits, 40);
  assert.equal(
    getClassificationBand(result.roundedIndicatorScore, true).label,
    "No Honours Classification",
  );
});

test("Level 6 alone uses all its credits at 100% without disregarding a module", () => {
  const modules = degree([70, 70, 70, 70, 70, 70], [40, 60, 70, 80, 90])
    .filter((module) => module.level === "l6");
  const result = calculate(modules);

  assert.equal(result.l5Average, null);
  assert.equal(result.l5Credits, 0);
  assert.equal(result.l6Credits, 120);
  assert.equal(result.totalCredits, 120);
  closeTo(result.l6Average, 190 / 3);
  closeTo(result.indicatorScore, 190 / 3);
  assert.equal(result.roundedIndicatorScore, 63);
  assert.equal(result.disregardedModule, null);
  assert.equal(result.disregardedCredits, 0);
});

test("calculation preserves supplied module order, marks, and project credits", () => {
  const modules = degree([70, 70, 70, 70, 70, 70], [40, 60, 70, 80, 90]);
  const original = structuredClone(modules);
  modules.forEach(Object.freeze);
  Object.freeze(modules);

  calculate(modules);
  assert.deepEqual(modules, original);
});

for (const config of [computerScienceConfig, softwareEngineeringConfig]) {
  test(`${config.id.toUpperCase()} configured modules produce the expected weighted result and credit totals`, () => {
    const marks = { l5: [40, 50, 60, 70, 80, 90], l6: [50, 60, 70, 80, 90] };
    const modules = (["l5", "l6"] as const).flatMap((level) => {
      const selected = [
        ...config.modules[level].core,
        ...config.modules[level].optional.slice(0, config.optionalModulesPerLevel),
      ];
      assert.equal(selected.length, marks[level].length);
      assert.equal(selected.reduce((total, module) => total + module.credits, 0), 120);
      return selected.map((module, index) => ({ ...module, level, mark: marks[level][index] }));
    });
    const result = calculate(modules);

    // Higher candidate: retain all L5 (average 65), remove 20 credits of
    // the 50-mark project so the remaining five L6 units average 70.
    assert.equal(result.l5Average, 65);
    assert.equal(result.l6Average, 70);
    closeTo(result.indicatorScore, 205 / 3);
    assert.equal(result.roundedIndicatorScore, 68);
    assert.equal(result.l5Credits, 120);
    assert.equal(result.l6Credits, 100);
    assert.equal(result.totalCredits, 220);
    assert.deepEqual(result.modulesBelowPassMark, []);
    assert.equal(getClassificationBand(result.roundedIndicatorScore, false).label, "Second Upper");
  });
}
