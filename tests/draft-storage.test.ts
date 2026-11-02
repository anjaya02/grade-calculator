import assert from "node:assert/strict";
import { test } from "node:test";
import { computerScienceConfig } from "../src/features/grade-calculator/data/computer-science";
import { softwareEngineeringConfig } from "../src/features/grade-calculator/data/software-engineering";
import {
  CALCULATOR_STORAGE_VERSION,
  createEmptyCalculatorState,
  getCalculatorStorageKey,
  hasCalculatorDraft,
  parseCalculatorDraft,
  serializeCalculatorDraft,
} from "../src/features/grade-calculator/draft-storage";
import type { CalculatorState, CourseConfig } from "../src/features/grade-calculator/types";

function draft(config: CourseConfig = computerScienceConfig) {
  return JSON.parse(serializeCalculatorDraft(config, createEmptyCalculatorState()));
}

test("roundtrips partial marks including zero and decimals, selections, and custom modules", () => {
  const state = createEmptyCalculatorState();
  state.l5.coreMarks = { "5COSC019C": 0, "5COSC020C": 76.25 };
  state.l5.selectedOptionals.add("5SENG003C");
  state.l5.optionalMarks["5SENG003C"] = 65.5;
  state.l6.otherModules.push({
    id: "OTHER-L6-1730000000000", name: "Prediction module", credits: 20, isOther: true,
  });
  state.l6.selectedOptionals.add("OTHER-L6-1730000000000");
  state.l6.optionalMarks["OTHER-L6-1730000000000"] = 100;

  const raw = serializeCalculatorDraft(computerScienceConfig, state);
  assert.deepEqual(parseCalculatorDraft(raw, computerScienceConfig), state);
  const serialized = JSON.parse(raw);
  assert.equal(serialized.version, CALCULATOR_STORAGE_VERSION);
  assert.equal(serialized.course, "cs");
  assert.equal(new Date(serialized.updatedAt).toISOString(), serialized.updatedAt);
  assert.deepEqual(serialized.levels.l5.selectedOptionals, ["5SENG003C"]);
});

test("complete calculations roundtrip for both course configurations", () => {
  for (const config of [computerScienceConfig, softwareEngineeringConfig]) {
    const state = createEmptyCalculatorState();
    for (const level of ["l5", "l6"] as const) {
      for (const courseModule of config.modules[level].core) state[level].coreMarks[courseModule.id] = 72.75;
      for (const courseModule of config.modules[level].optional.slice(0, config.optionalModulesPerLevel)) {
        state[level].selectedOptionals.add(courseModule.id);
        state[level].optionalMarks[courseModule.id] = 69;
      }
    }
    assert.deepEqual(parseCalculatorDraft(serializeCalculatorDraft(config, state), config), state);
  }
});

test("legacy overprecise marks need re-entry while other marks and selections survive", () => {
  for (const config of [computerScienceConfig, softwareEngineeringConfig]) {
    const state = createEmptyCalculatorState();
    for (const level of ["l5", "l6"] as const) {
      state[level].coreMarks[config.modules[level].core[0].id] = 82.345484849;
      state[level].coreMarks[config.modules[level].core[1].id] = 82.34;
      const optional = config.modules[level].optional[0].id;
      const custom = `OTHER-${level.toUpperCase()}-1`;
      state[level].otherModules.push({ id: custom, name: "Custom", credits: 20, isOther: true });
      const selected = level === "l5" ? optional : custom;
      state[level].selectedOptionals = new Set([selected]);
      state[level].optionalMarks = { [selected]: level === "l5" ? 39.999 : 0.001 };
    }
    const restored = parseCalculatorDraft(serializeCalculatorDraft(config, state), config);
    assert.ok(restored);
    for (const level of ["l5", "l6"] as const) {
      assert.deepEqual(restored[level].coreMarks, { [config.modules[level].core[1].id]: 82.34 });
      assert.deepEqual(restored[level].optionalMarks, {});
      assert.deepEqual(restored[level].selectedOptionals, state[level].selectedOptionals);
      assert.deepEqual(restored[level].otherModules, state[level].otherModules);
    }
  }
});

test("draft keys and payloads keep courses separate", () => {
  assert.equal(getCalculatorStorageKey("cs"), "grade-calculator:draft:cs");
  assert.equal(getCalculatorStorageKey("se"), "grade-calculator:draft:se");
  assert.equal(parseCalculatorDraft(serializeCalculatorDraft(computerScienceConfig, createEmptyCalculatorState()), softwareEngineeringConfig), null);
});

test("empty state uses independent objects, sets, and arrays on every call and level", () => {
  const first = createEmptyCalculatorState();
  const second = createEmptyCalculatorState();
  first.l5.coreMarks["5COSC019C"] = 75;
  first.l5.optionalMarks["5SENG003C"] = 55;
  first.l5.selectedOptionals.add("5SENG003C");
  first.l5.otherModules.push({ id: "OTHER-L5-1", name: "Other", credits: 20, isOther: true });
  assert.deepEqual(first.l6, second.l5);
  assert.deepEqual(second.l5, second.l6);
  assert.equal(hasCalculatorDraft(second), false);
});

test("draft detection includes all substantive fields and excludes unfinished add forms", () => {
  const transient = createEmptyCalculatorState();
  transient.l5.showAddForm = true;
  transient.l5.newModuleName = "Still typing";
  assert.equal(hasCalculatorDraft(transient), false);

  const changes: Array<(state: CalculatorState) => void> = [
    (state) => { state.l5.coreMarks["5COSC019C"] = 0; },
    (state) => { state.l6.optionalMarks["6COSC021C"] = 0; },
    (state) => { state.l5.selectedOptionals.add("5SENG003C"); },
    (state) => { state.l6.otherModules.push({ id: "OTHER-L6-1", name: "Other", credits: 20, isOther: true }); },
  ];
  for (const change of changes) {
    const state = createEmptyCalculatorState();
    change(state);
    assert.equal(hasCalculatorDraft(state), true);
  }
});

test("transient form fields are neither saved nor restored", () => {
  const state = createEmptyCalculatorState();
  state.l5.showAddForm = true;
  state.l5.newModuleName = "Unfinished module";
  const raw = serializeCalculatorDraft(computerScienceConfig, state);
  assert.equal(raw.includes("showAddForm"), false);
  assert.equal(raw.includes("newModuleName"), false);
  const injected = JSON.parse(raw);
  injected.levels.l5.showAddForm = true;
  injected.levels.l5.newModuleName = "Injected unfinished module";
  assert.deepEqual(parseCalculatorDraft(JSON.stringify(injected), computerScienceConfig), createEmptyCalculatorState());
});

test("corrupt, outdated, malformed, and excessively large payloads are rejected safely", () => {
  for (const raw of ["", "{", "null", "[]", "true", "1", '"text"', " ".repeat(1_000_001)]) {
    assert.equal(parseCalculatorDraft(raw, computerScienceConfig), null);
  }
  for (const mutate of [
    (value: ReturnType<typeof draft>) => { value.version = 0; },
    (value: ReturnType<typeof draft>) => { value.version = 2; },
    (value: ReturnType<typeof draft>) => { value.version = "1"; },
    (value: ReturnType<typeof draft>) => { value.updatedAt = "invalid"; },
    (value: ReturnType<typeof draft>) => { delete value.updatedAt; },
    (value: ReturnType<typeof draft>) => { value.levels = []; },
    (value: ReturnType<typeof draft>) => { delete value.levels.l6; },
    (value: ReturnType<typeof draft>) => { value.levels.l5 = null; },
    (value: ReturnType<typeof draft>) => { value.levels.l5.coreMarks = []; },
    (value: ReturnType<typeof draft>) => { value.levels.l5.optionalMarks = null; },
    (value: ReturnType<typeof draft>) => { value.levels.l5.selectedOptionals = {}; },
    (value: ReturnType<typeof draft>) => { value.levels.l5.otherModules = {}; },
  ]) {
    const value = draft();
    mutate(value);
    assert.equal(parseCalculatorDraft(JSON.stringify(value), computerScienceConfig), null);
  }
});

test("invalid marks, unknown core IDs, and prototype-like keys are rejected", () => {
  for (const mark of [-0.01, 100.01, "75", null, true, {}, []]) {
    const value = draft();
    value.levels.l5.coreMarks["5COSC019C"] = mark;
    assert.equal(parseCalculatorDraft(JSON.stringify(value), computerScienceConfig), null);
  }
  for (const id of ["unknown", "5SENG003C", "6COSC023C", "__proto__", "constructor", "toString"]) {
    const value = draft();
    value.levels.l5.coreMarks = JSON.parse(`{"${id}":75}`);
    assert.equal(parseCalculatorDraft(JSON.stringify(value), computerScienceConfig), null);
  }
  const value = draft();
  const raw = JSON.stringify(value).replace('"coreMarks":{}', '"coreMarks":{"5COSC019C":1e999}');
  assert.equal(parseCalculatorDraft(raw, computerScienceConfig), null);
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
});

test("optional selections enforce known IDs, unique IDs, and each course limit", () => {
  for (const config of [computerScienceConfig, softwareEngineeringConfig]) {
    const first = config.modules.l5.optional[0].id;
    for (const selections of [
      ["unknown"], ["__proto__"], ["5COSC019C"], [first, first], [75],
      config.modules.l5.optional.slice(0, config.optionalModulesPerLevel + 1).map((module) => module.id),
    ]) {
      const value = draft(config);
      value.levels.l5.selectedOptionals = selections;
      assert.equal(parseCalculatorDraft(JSON.stringify(value), config), null);
    }
    const unselectedMark = draft(config);
    unselectedMark.levels.l5.optionalMarks[first] = 75;
    assert.equal(parseCalculatorDraft(JSON.stringify(unselectedMark), config), null);
    const invalidMark = draft(config);
    invalidMark.levels.l5.selectedOptionals = [first];
    invalidMark.levels.l5.optionalMarks[first] = -1;
    assert.equal(parseCalculatorDraft(JSON.stringify(invalidMark), config), null);
  }
});

test("custom module validation prevents invalid IDs, credits, empty names, and duplicates", () => {
  const valid = { id: "OTHER-L5-1730000000000", name: "Other", credits: 20, isOther: true };
  for (const customModule of [
    null, [], "Other", {},
    { ...valid, id: "OTHER-L6-1" },
    { ...valid, id: "OTHER-L5-abc" },
    { ...valid, id: "__proto__" },
    { ...valid, id: "5SENG003C" },
    { ...valid, id: "OTHER-L5-1\n" },
    { ...valid, name: "  " },
    { ...valid, name: 123 },
    { ...valid, credits: 40 },
    { ...valid, isOther: false },
  ]) {
    const value = draft();
    value.levels.l5.otherModules = [customModule];
    assert.equal(parseCalculatorDraft(JSON.stringify(value), computerScienceConfig), null);
  }
  const duplicates = draft();
  duplicates.levels.l5.otherModules = [valid, valid];
  assert.equal(parseCalculatorDraft(JSON.stringify(duplicates), computerScienceConfig), null);
});

test("stored built-in module metadata is ignored and never overrides the course configuration", () => {
  const value = draft();
  value.levels.l5.core = [{ id: "5COSC019C", name: "Changed", credits: 999 }];
  value.levels.l5.coreMarks["5COSC019C"] = 75;
  const restored = parseCalculatorDraft(JSON.stringify(value), computerScienceConfig);
  assert.ok(restored);
  assert.deepEqual(Object.keys(restored.l5).sort(), Object.keys(createEmptyCalculatorState().l5).sort());
  assert.equal(computerScienceConfig.modules.l5.core[0].name, "Object Oriented Programming");
  assert.equal(computerScienceConfig.modules.l5.core[0].credits, 20);
});
