"use client";

import { useReducer } from "react";
import {
  calculateHonoursClassification,
  type DegreeModule,
} from "@/lib/degree-classification";
import type {
  CourseConfig,
  LevelId,
  LevelState,
  ModuleType,
  OtherModule,
} from "../types";

type CalculatorState = Record<LevelId, LevelState>;

type CalculatorAction =
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

const createLevelState = (): LevelState => ({
  coreMarks: {},
  optionalMarks: {},
  selectedOptionals: new Set(),
  otherModules: [],
  showAddForm: false,
  newModuleName: "",
});

const initialState: CalculatorState = {
  l5: createLevelState(),
  l6: createLevelState(),
};

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
  action: CalculatorAction,
): CalculatorState {
  const levelState = state[action.level];

  switch (action.type) {
    case "set-mark": {
      const marksKey =
        action.moduleType === "core" ? "coreMarks" : "optionalMarks";
      const marks = { ...levelState[marksKey] };
      const value = Number.parseFloat(action.value);

      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        marks[action.moduleId] = value;
      } else if (action.value === "") {
        delete marks[action.moduleId];
      } else {
        return state;
      }

      return updateLevel(state, action.level, { [marksKey]: marks });
    }

    case "toggle-optional": {
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
  const [levels, dispatch] = useReducer(calculatorReducer, initialState);
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
