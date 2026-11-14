import type { UsageCourse } from "@/lib/usage";
import { isValidMark, normalizeMark } from "@/lib/marks";
import type {
  CalculatorState,
  CourseConfig,
  CourseModule,
  LevelId,
  LevelState,
  Marks,
  OtherModule,
} from "./types";

export const CALCULATOR_STORAGE_VERSION = 2;

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
  return { l5: createEmptyLevelState(), l6: createEmptyLevelState(), level6Only: false };
}

export function hasCalculatorDraft(state: CalculatorState): boolean {
  return state.level6Only || LEVELS.some((level) => {
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
    level6Only: state.level6Only,
    levels: { l5: serializeLevel("l5"), l6: serializeLevel("l6") },
    updatedAt: new Date().toISOString(),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function moduleIdMap(modules: readonly CourseModule[]): Map<string, string> {
  const ids = new Map<string, string>();
  for (const courseModule of modules) {
    ids.set(courseModule.id, courseModule.id);
    for (const legacyId of courseModule.legacyIds ?? []) ids.set(legacyId, courseModule.id);
  }
  return ids;
}

function parseMarks(value: unknown, allowedIds: Set<string>, ids: Map<string, string>) {
  if (!isRecord(value)) return null;

  const marks: Marks = {};
  const conflicts = new Set<string>();
  for (const [id, mark] of Object.entries(value)) {
    if (!allowedIds.has(id) || !isValidMark(mark)) return null;
    const canonicalId = ids.get(id);
    if (!canonicalId) return null;
    // Retain numeric legacy marks without rounding them. New marks are decimal
    // strings, including any digits that would be lost by a Number conversion.
    if (conflicts.has(canonicalId)) continue;
    if (marks[canonicalId] !== undefined && normalizeMark(marks[canonicalId]) !== normalizeMark(mark)) {
      // Aliases can reveal two old entries for one module. A conflicting mark
      // needs re-entry; choosing either value would invent a student's result.
      delete marks[canonicalId];
      conflicts.add(canonicalId);
    } else {
      marks[canonicalId] = mark;
    }
  }
  return { marks, needsReview: conflicts.size > 0 };
}

function parseLevel(
  value: unknown,
  config: CourseConfig,
  level: LevelId,
) {
  if (
    !isRecord(value) ||
    !Array.isArray(value.selectedOptionals) ||
    !Array.isArray(value.otherModules) ||
    value.selectedOptionals.length > config.optionalModulesPerLevel
  ) {
    return null;
  }

  const coreIds = moduleIdMap(config.modules[level].core);
  const optionalIds = moduleIdMap(config.modules[level].optional);
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
    optionalIds.set(customModule.id, customModule.id);
    otherModules.push({
      id: customModule.id,
      name: customModule.name.trim(),
      credits: 20,
      isOther: true,
    });
  }

  const selectedOptionals = new Set<string>();
  const rawSelections = new Set<string>();
  let needsReview = false;
  for (const id of value.selectedOptionals) {
    if (
      typeof id !== "string" ||
      !optionalIds.has(id) ||
      rawSelections.has(id)
    ) {
      return null;
    }
    rawSelections.add(id);
    const canonicalId = optionalIds.get(id)!;
    if (selectedOptionals.has(canonicalId)) needsReview = true;
    selectedOptionals.add(canonicalId);
  }

  const coreMarks = parseMarks(value.coreMarks, new Set(coreIds.keys()), coreIds);
  const optionalMarks = parseMarks(value.optionalMarks, rawSelections, optionalIds);
  if (!coreMarks || !optionalMarks) return null;

  return {
    state: {
      coreMarks: coreMarks.marks,
      optionalMarks: optionalMarks.marks,
      selectedOptionals,
      otherModules,
      showAddForm: false,
      newModuleName: "",
    } satisfies LevelState,
    needsReview: needsReview || coreMarks.needsReview || optionalMarks.needsReview,
  };
}

export function restoreCalculatorDraft(
  raw: string,
  config: CourseConfig,
) {
  try {
    if (raw.length > MAX_DRAFT_LENGTH) return null;
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      (value.version !== 1 && value.version !== CALCULATOR_STORAGE_VERSION) ||
      (value.version === CALCULATOR_STORAGE_VERSION && typeof value.level6Only !== "boolean") ||
      value.course !== config.id ||
      typeof value.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(value.updatedAt)) ||
      !isRecord(value.levels)
    ) {
      return null;
    }

    const l5 = parseLevel(value.levels.l5, config, "l5");
    const l6 = parseLevel(value.levels.l6, config, "l6");
    if (!l5 || !l6) return null;
    return {
      state: {
        l5: l5.state, l6: l6.state,
        // IIT CS and SE always require both levels, including in older drafts.
        level6Only: false,
      } satisfies CalculatorState,
      needsReview: l5.needsReview || l6.needsReview,
    };
  } catch {
    return null;
  }
}

export function parseCalculatorDraft(raw: string, config: CourseConfig): CalculatorState | null {
  return restoreCalculatorDraft(raw, config)?.state ?? null;
}
