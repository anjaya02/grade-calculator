import assert from "node:assert/strict";
import { test } from "node:test";
import { computerScienceConfig } from "../src/features/grade-calculator/data/computer-science";
import { softwareEngineeringConfig } from "../src/features/grade-calculator/data/software-engineering";
import type { CourseConfig } from "../src/features/grade-calculator/types";

const courses: CourseConfig[] = [computerScienceConfig, softwareEngineeringConfig];

for (const config of courses) {
  test(`${config.id}: current IIT codes and migration aliases identify unique modules`, () => {
    const modules = ["l5", "l6"].flatMap((level) => {
      const group = config.modules[level as "l5" | "l6"];
      return [...group.core, ...group.optional];
    });
    const ids = new Set(modules.map((item) => item.id));
    assert.equal(ids.size, modules.length);
    const legacy = new Set<string>();
    for (const item of modules) {
      assert.match(item.id, /^[56][A-Z]+\d+C$/, item.name);
      for (const alias of item.legacyIds ?? []) {
        assert.ok(!ids.has(alias), `Alias ${alias} must not be a second selectable module`);
        assert.ok(!legacy.has(alias), `Ambiguous alias ${alias}`);
        legacy.add(alias);
      }
    }
  });
}

test("CS retains historical IT Security and has one entry per physical media/XR module", () => {
  const l5 = computerScienceConfig.modules.l5.optional;
  const l6 = computerScienceConfig.modules.l6.optional;
  assert.equal(l5.filter((item) => item.id === "5CCGD013C").length, 1);
  const earlier = l5.find((item) => item.id === "5BUIS020C");
  assert.ok(earlier && "earlierCohortsOnly" in earlier && earlier.earlierCohortsOnly);
  assert.equal(l6.filter((item) => item.name === "Advanced Interactive Media Development").length, 1);
  assert.ok(l6.some((item) => item.id === "6MMCS008C"));
});

test("non-classification and not-offered modules are absent from both catalogues", () => {
  for (const config of courses) {
    const modules = (["l5", "l6"] as const).flatMap((level) => [
      ...config.modules[level].core, ...config.modules[level].optional,
    ]);
    for (const id of ["5COSC999C", "6COSC018C", "6CCGD006C"]) {
      assert.ok(!modules.some((item) => item.id === id), `${config.id}: ${id}`);
    }
    assert.equal(config.modules.l5.core.reduce((sum, item) => sum + item.credits, 0) + config.optionalModulesPerLevel * 20, 120);
    assert.equal(config.modules.l6.core.reduce((sum, item) => sum + item.credits, 0) + config.optionalModulesPerLevel * 20, 120);
  }
});
