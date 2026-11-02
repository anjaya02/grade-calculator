"use client";

import { useEffect, useReducer, useState } from "react";
import {
  calculateHonoursClassification,
  type DegreeModule,
} from "@/lib/degree-classification";
import {
  createEmptyCalculatorState,
  getCalculatorStorageKey,
  hasCalculatorDraft,
  parseCalculatorDraft,
  serializeCalculatorDraft,
} from "../draft-storage";
import type {
  CalculatorState,
  CourseConfig,
  LevelId,
  LevelState,
  ModuleType,
  OtherModule,
} from "../types";
import { parseMarkInput } from "../mark-validation";

type LevelAction =
  | {
      type: "set-mark";
      level: LevelId;
      moduleType: ModuleType;
      moduleId: string;
      value: string;
    }
  | {
      type: "toggle-optional";
      level: LevelId;
      moduleId: string;
      checked: boolean;
      limit: number;
    }
  | { type: "set-add-form"; level: LevelId; visible: boolean }
  | { type: "set-new-module-name"; level: LevelId; name: string }
  | { type: "add-other-module"; level: LevelId }
  | { type: "remove-other-module"; level: LevelId; moduleId: string };

type CalculatorAction =
  | LevelAction
  | { type: "restore"; course: CourseConfig["id"]; levels: CalculatorState }
  | { type: "reset" };

type CalculatorSession = {
  course: CourseConfig["id"] | null;
  levels: CalculatorState;
  hasUserChanges: boolean;
};

export type DraftStorageStatus =
  | "loading"
  | "ready"
  | "saved"
  | "invalid"
  | "unavailable"
  | "reset-error";

function updateLevel(
  state: CalculatorState,
  level: LevelId,
  update: Partial<LevelState>,
): CalculatorState {
  return {
    ...state,
    [level]: {
      ...state[level],
      ...update,
    },
  };
}

function calculatorReducer(
  state: CalculatorState,
  action: LevelAction,
): CalculatorState {
  const levelState = state[action.level];

  switch (action.type) {
    case "set-mark": {
      const marksKey =
        action.moduleType === "core" ? "coreMarks" : "optionalMarks";
      const marks = { ...levelState[marksKey] };
      const value = parseMarkInput(action.value);

      if (value === undefined) return state;
      if (value !== null) {
        if (marks[action.moduleId] === value) return state;
        marks[action.moduleId] = value;
      } else {
        if (marks[action.moduleId] === undefined) return state;
        delete marks[action.moduleId];
      }

      return updateLevel(state, action.level, { [marksKey]: marks });
    }

    case "toggle-optional": {
      if (levelState.selectedOptionals.has(action.moduleId) === action.checked) {
        return state;
      }
      const selectedOptionals = new Set(levelState.selectedOptionals);

      if (action.checked) {
        if (selectedOptionals.size >= action.limit) return state;
        selectedOptionals.add(action.moduleId);
        return updateLevel(state, action.level, { selectedOptionals });
      }

      selectedOptionals.delete(action.moduleId);
      const optionalMarks = { ...levelState.optionalMarks };
      delete optionalMarks[action.moduleId];

      return updateLevel(state, action.level, {
        selectedOptionals,
        optionalMarks,
      });
    }

    case "set-add-form":
      return updateLevel(state, action.level, {
        showAddForm: action.visible,
        newModuleName: action.visible ? levelState.newModuleName : "",
      });

    case "set-new-module-name":
      return updateLevel(state, action.level, {
        newModuleName: action.name,
      });

    case "add-other-module": {
      const name = levelState.newModuleName.trim();
      if (!name) return state;

      const newModule: OtherModule = {
        id: `OTHER-${action.level.toUpperCase()}-${Date.now()}`,
        name,
        credits: 20,
        isOther: true,
      };

      return updateLevel(state, action.level, {
        otherModules: [...levelState.otherModules, newModule],
        showAddForm: false,
        newModuleName: "",
      });
    }

    case "remove-other-module": {
      const selectedOptionals = new Set(levelState.selectedOptionals);
      selectedOptionals.delete(action.moduleId);

      const optionalMarks = { ...levelState.optionalMarks };
      delete optionalMarks[action.moduleId];

      return updateLevel(state, action.level, {
        otherModules: levelState.otherModules.filter(
          (module) => module.id !== action.moduleId,
        ),
        selectedOptionals,
        optionalMarks,
      });
    }
  }
}

function sessionReducer(
  state: CalculatorSession,
  action: CalculatorAction,
): CalculatorSession {
  if (action.type === "restore") {
    return { course: action.course, levels: action.levels, hasUserChanges: false };
  }
  if (action.type === "reset") {
    return {
      ...state,
      levels: createEmptyCalculatorState(),
      hasUserChanges: false,
    };
  }
  // Ignore interactions until the initial browser draft has been read.
  if (state.course === null) return state;

  const levels = calculatorReducer(state.levels, action);
  if (levels === state.levels) return state;

  return {
    ...state,
    levels,
    hasUserChanges:
      state.hasUserChanges ||
      (action.type !== "set-add-form" && action.type !== "set-new-module-name"),
  };
}

function isLevelComplete(
  config: CourseConfig,
  state: CalculatorState,
  level: LevelId,
) {
  const levelState = state[level];

  return (
    config.modules[level].core.every(
      (module) => levelState.coreMarks[module.id] !== undefined,
    ) &&
    levelState.selectedOptionals.size === config.optionalModulesPerLevel &&
    [...levelState.selectedOptionals].every(
      (id) => levelState.optionalMarks[id] !== undefined,
    )
  );
}

function buildModuleList(
  config: CourseConfig,
  state: CalculatorState,
): DegreeModule[] {
  const modules: DegreeModule[] = [];

  (["l5", "l6"] as const).forEach((level) => {
    const levelState = state[level];

    config.modules[level].core.forEach((module) => {
      modules.push({
        ...module,
        level,
        mark: levelState.coreMarks[module.id],
      });
    });

    levelState.selectedOptionals.forEach((id) => {
      const selectedModule =
        config.modules[level].optional.find((item) => item.id === id) ??
        levelState.otherModules.find((item) => item.id === id);

      if (selectedModule) {
        modules.push({
          ...selectedModule,
          level,
          mark: levelState.optionalMarks[id],
        });
      }
    });
  });

  return modules;
}

export function useGradeCalculator(config: CourseConfig) {
  const [session, dispatch] = useReducer(sessionReducer, null, () => ({
    course: null,
    levels: createEmptyCalculatorState(),
    hasUserChanges: false,
  }));
  const [storageStatus, setStorageStatus] =
    useState<DraftStorageStatus>("loading");
  const { levels, hasUserChanges } = session;
  const isReady = session.course === config.id;
  const hasDraft = hasCalculatorDraft(levels);

  useEffect(() => {
    let restored = createEmptyCalculatorState();
    let status: DraftStorageStatus = "ready";
    try {
      const key = getCalculatorStorageKey(config.id);
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const saved = parseCalculatorDraft(raw, config);
        if (saved) {
          restored = saved;
          status = hasCalculatorDraft(saved) ? "saved" : "ready";
        } else {
          window.localStorage.removeItem(key);
          status = "invalid";
        }
      }
    } catch {
      status = "unavailable";
    }
    dispatch({ type: "restore", course: config.id, levels: restored });
    setStorageStatus(status);
  }, [config]);

  useEffect(() => {
    // Never overwrite a saved draft with the empty server-rendered state.
    // Restoration itself also needs no write and is not a new calculation.
    if (!isReady || !hasUserChanges) return;
    try {
      const key = getCalculatorStorageKey(config.id);
      if (hasDraft) {
        window.localStorage.setItem(key, serializeCalculatorDraft(config, levels));
        setStorageStatus("saved");
      } else {
        window.localStorage.removeItem(key);
        setStorageStatus("ready");
      }
    } catch {
      setStorageStatus("unavailable");
    }
  }, [config, levels, isReady, hasUserChanges, hasDraft]);

  const isComplete =
    isLevelComplete(config, levels, "l5") &&
    isLevelComplete(config, levels, "l6");
  const results = isComplete
    ? calculateHonoursClassification(buildModuleList(config, levels))
    : null;
  const hasOtherModulesSelected = (["l5", "l6"] as const).some((level) => {
    const otherIds = new Set(
      levels[level].otherModules.map((module) => module.id),
    );
    return [...levels[level].selectedOptionals].some((id) => otherIds.has(id));
  });

  return {
    levels,
    results,
    hasOtherModulesSelected,
    isReady,
    hasUserChanges,
    storageStatus,
    canReset:
      hasDraft ||
      storageStatus === "reset-error" ||
      Object.values(levels).some(
        (level) => level.showAddForm || level.newModuleName !== "",
      ),
    reset: () => {
      // Removing this course's key leaves the other course's draft untouched.
      try {
        window.localStorage.removeItem(getCalculatorStorageKey(config.id));
        setStorageStatus("ready");
      } catch {
        setStorageStatus("reset-error");
      }
      dispatch({ type: "reset" });
    },
    setMark: (
      level: LevelId,
      moduleType: ModuleType,
      moduleId: string,
      value: string,
    ) =>
      dispatch({
        type: "set-mark",
        level,
        moduleType,
        moduleId,
        value,
      }),
    toggleOptional: (level: LevelId, moduleId: string, checked: boolean) =>
      dispatch({
        type: "toggle-optional",
        level,
        moduleId,
        checked,
        limit: config.optionalModulesPerLevel,
      }),
    setAddForm: (level: LevelId, visible: boolean) =>
      dispatch({ type: "set-add-form", level, visible }),
    setNewModuleName: (level: LevelId, name: string) =>
      dispatch({ type: "set-new-module-name", level, name }),
    addOtherModule: (level: LevelId) =>
      dispatch({ type: "add-other-module", level }),
    removeOtherModule: (level: LevelId, moduleId: string) =>
      dispatch({ type: "remove-other-module", level, moduleId }),
  };
}

export type GradeCalculatorController = ReturnType<
  typeof useGradeCalculator
>;
