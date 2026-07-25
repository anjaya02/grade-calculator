import { BookOpen, Code } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GradeCalculatorController } from "../hooks/use-grade-calculator";
import { calculatorThemes } from "../theme";
import type {
  CourseConfig,
  CourseModule,
  LevelId,
  ModuleType,
} from "../types";
import { AddModuleForm } from "./add-module-form";
import { ModuleCard } from "./module-card";

type ModuleSectionProps = {
  config: CourseConfig;
  controller: GradeCalculatorController;
  level: LevelId;
  moduleType: ModuleType;
  modules: readonly CourseModule[];
};

export function ModuleSection({
  config,
  controller,
  level,
  moduleType,
  modules,
}: ModuleSectionProps) {
  const levelState = controller.levels[level];
  const isCore = moduleType === "core";
  const Icon = config.icon === "book" ? BookOpen : Code;
  const allModules = isCore
    ? modules
    : [...modules, ...levelState.otherModules];
  const selectedCount = levelState.selectedOptionals.size;
  const markStore = isCore
    ? levelState.coreMarks
    : levelState.optionalMarks;
  const levelLabel = level === "l5" ? "L5" : "L6";

  return (
    <Card className="border border-indigo-50/50 bg-white/60 shadow-xl shadow-indigo-100/40 backdrop-blur-xl transition-all duration-300 hover:shadow-indigo-200/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {levelLabel} {isCore ? "Core" : "Optional"} Modules
          {isCore ? (
            <span className="text-sm text-red-600">(Required)</span>
          ) : (
            <span
              className={`text-sm ${calculatorThemes[config.theme].optionalLabel}`}
            >
              (Choose {config.optionalModulesPerLevel})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allModules.map((module) => {
          const selected =
            isCore || levelState.selectedOptionals.has(module.id);

          return (
            <ModuleCard
              key={module.id}
              module={module}
              level={level}
              moduleType={moduleType}
              theme={config.theme}
              optionalLimitReached={
                selectedCount >= config.optionalModulesPerLevel
              }
              selected={selected}
              mark={markStore[module.id]}
              onMarkChange={(value) =>
                controller.setMark(level, moduleType, module.id, value)
              }
              onOptionalToggle={(checked) =>
                controller.toggleOptional(level, module.id, checked)
              }
              onRemove={() =>
                controller.removeOtherModule(level, module.id)
              }
            />
          );
        })}

        {!isCore && (
          <div className="mt-4">
            <AddModuleForm
              level={level}
              name={levelState.newModuleName}
              visible={levelState.showAddForm}
              onNameChange={(name) =>
                controller.setNewModuleName(level, name)
              }
              onAdd={() => controller.addOtherModule(level)}
              onVisibleChange={(visible) =>
                controller.setAddForm(level, visible)
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
