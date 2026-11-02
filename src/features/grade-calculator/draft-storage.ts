import type { UsageCourse } from "@/lib/usage";
import { isValidMark } from "@/lib/marks";
import type {
  CalculatorState,
  CourseConfig,
  LevelId,
  LevelState,
  Marks,
  OtherModule,
} from "./types";

export const CALCULATOR_STORAGE_VERSION = 1;

// Keep corrupt storage from causing an unbounded synchronous JSON parse.
const MAX_DRAFT_LENGTH = 1_000_000;
const LEVELS = ["l5", "l6"] as const;

export function getCalculatorStorageKey(courseId: UsageCourse): string {
  return `grade-calculator:draft:${courseId}`;
}

function createEmptyLevelState(): LevelState {
  return {
    coreMarks: {},
    optionalMarks: {},
    selectedOptionals: new Set(),
    otherModules: [],
    showAddForm: false,
    newModuleName: "",
  };
}

export function createEmptyCalculatorState(): CalculatorState {
  return { l5: createEmptyLevelState(), l6: createEmptyLevelState() };
}

export function hasCalculatorDraft(state: CalculatorState): boolean {
  return LEVELS.some((level) => {
    const draft = state[level];
    return (
      Object.keys(draft.coreMarks).length > 0 ||
      Object.keys(draft.optionalMarks).length > 0 ||
      draft.selectedOptionals.size > 0 ||
      draft.otherModules.length > 0
    );
  });
}

export function serializeCalculatorDraft(
  config: CourseConfig,
  state: CalculatorState,
): string {
  const serializeLevel = (level: LevelId) => ({
    coreMarks: state[level].coreMarks,
    optionalMarks: state[level].optionalMarks,
    selectedOptionals: [...state[level].selectedOptionals],
    otherModules: state[level].otherModules.map((module) => ({
      id: module.id,
      name: module.name,
      credits: module.credits,
      isOther: module.isOther,
    })),
  });

  return JSON.stringify({
    version: CALCULATOR_STORAGE_VERSION,
    course: config.id,
    levels: { l5: serializeLevel("l5"), l6: serializeLevel("l6") },
    updatedAt: new Date().toISOString(),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMarks(value: unknown, allowedIds: Set<string>): Marks | null {
  if (!isRecord(value)) return null;

  const marks: Marks = {};
  for (const [id, mark] of Object.entries(value)) {
    if (
      !allowedIds.has(id) ||
      typeof mark !== "number" ||
      !Number.isFinite(mark) ||
      mark < 0 ||
      mark > 100
    ) {
      return null;
    }
    // Older drafts allowed arbitrary precision. Keep the rest of the draft
    // and require re-entry of these marks instead of silently rounding them.
    if (isValidMark(mark)) marks[id] = mark;
  }
  return marks;
}

function parseLevel(
  value: unknown,
  config: CourseConfig,
  level: LevelId,
): LevelState | null {
  if (
    !isRecord(value) ||
    !Array.isArray(value.selectedOptionals) ||
    !Array.isArray(value.otherModules) ||
    value.selectedOptionals.length > config.optionalModulesPerLevel
  ) {
    return null;
  }

  const coreIds = new Set(config.modules[level].core.map((module) => module.id));
  const optionalIds = new Set(
    config.modules[level].optional.map((module) => module.id),
  );
  const otherModules: OtherModule[] = [];
  const otherIdPattern = new RegExp(`^OTHER-${level.toUpperCase()}-[0-9]+$`);

  for (const customModule of value.otherModules) {
    if (
      !isRecord(customModule) ||
      typeof customModule.id !== "string" ||
      !otherIdPattern.test(customModule.id) ||
      optionalIds.has(customModule.id) ||
      coreIds.has(customModule.id) ||
      typeof customModule.name !== "string" ||
      !customModule.name.trim() ||
      customModule.credits !== 20 ||
      customModule.isOther !== true
    ) {
      return null;
    }
    optionalIds.add(customModule.id);
    otherModules.push({
      id: customModule.id,
      name: customModule.name.trim(),
      credits: 20,
      isOther: true,
    });
  }

  const selectedOptionals = new Set<string>();
  for (const id of value.selectedOptionals) {
    if (
      typeof id !== "string" ||
      !optionalIds.has(id) ||
      selectedOptionals.has(id)
    ) {
      return null;
    }
    selectedOptionals.add(id);
  }

  const coreMarks = parseMarks(value.coreMarks, coreIds);
  const optionalMarks = parseMarks(value.optionalMarks, selectedOptionals);
  if (!coreMarks || !optionalMarks) return null;

  return {
    coreMarks,
    optionalMarks,
    selectedOptionals,
    otherModules,
    showAddForm: false,
    newModuleName: "",
  };
}

export function parseCalculatorDraft(
  raw: string,
  config: CourseConfig,
): CalculatorState | null {
  try {
    if (raw.length > MAX_DRAFT_LENGTH) return null;
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      value.version !== CALCULATOR_STORAGE_VERSION ||
      value.course !== config.id ||
      typeof value.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(value.updatedAt)) ||
      !isRecord(value.levels)
    ) {
      return null;
    }

    const l5 = parseLevel(value.levels.l5, config, "l5");
    const l6 = parseLevel(value.levels.l6, config, "l6");
    return l5 && l6 ? { l5, l6 } : null;
  } catch {
    return null;
  }
}
