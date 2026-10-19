import type { GradeCalculatorController } from "../hooks/use-grade-calculator";
import type { CourseConfig, CourseModule, LevelId, ModuleType } from "../types";
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
  const allModules = isCore
    ? modules
    : [...modules, ...levelState.otherModules];
  const selectedCount = levelState.selectedOptionals.size;
  const markStore = isCore ? levelState.coreMarks : levelState.optionalMarks;

  return (
    <section
      className="overflow-hidden rounded-lg border border-border bg-white"
      aria-labelledby={`heading-${level} ${level}-${moduleType}-heading`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-4">
        <h3
          id={`${level}-${moduleType}-heading`}
          className="text-[13px] font-semibold"
        >
          {isCore ? "Core modules" : "Optional modules"}
        </h3>
        <span
          aria-live={isCore ? undefined : "polite"}
          className={`text-[10px] ${!isCore && selectedCount === config.optionalModulesPerLevel ? "text-primary" : "text-muted-foreground"}`}
        >
          {isCore
            ? "All required"
            : `${selectedCount} / ${config.optionalModulesPerLevel} selected`}
        </span>
      </div>
      <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
        <span>
          {isCore ? "Module" : `Choose ${config.optionalModulesPerLevel}`}
        </span>
        <span>Mark / 100</span>
      </div>
      <div className="space-y-1 p-2">
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
              onRemove={() => controller.removeOtherModule(level, module.id)}
            />
          );
        })}
        {!isCore && (
          <div className="px-1 pb-1 pt-2">
            <AddModuleForm
              level={level}
              name={levelState.newModuleName}
              visible={levelState.showAddForm}
              onNameChange={(name) => controller.setNewModuleName(level, name)}
              onAdd={() => controller.addOtherModule(level)}
              onVisibleChange={(visible) =>
                controller.setAddForm(level, visible)
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
