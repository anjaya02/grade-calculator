import type { GradeCalculatorController } from "../hooks/use-grade-calculator";
import type { CourseConfig, LevelId } from "../types";
import { ModuleSection } from "./module-section";

type LevelSectionProps = {
  config: CourseConfig;
  controller: GradeCalculatorController;
  level: LevelId;
};

export function LevelSection({ config, controller, level }: LevelSectionProps) {
  const levelNumber = level === "l5" ? 5 : 6;
  return (
    <section aria-labelledby={`heading-${level}`} className="min-w-0 space-y-5">
      <div className="flex items-center justify-between gap-3 pb-1">
        <h2
          id={`heading-${level}`}
          className="font-display text-[1.75rem] tracking-[-0.025em]"
        >
          Level {levelNumber} modules
        </h2>
        <span className="text-[10px] text-muted-foreground">
          {level === "l5" ? "⅓" : "⅔"} weighting
        </span>
      </div>
      <ModuleSection
        config={config}
        controller={controller}
        level={level}
        moduleType="core"
        modules={config.modules[level].core}
      />
      <ModuleSection
        config={config}
        controller={controller}
        level={level}
        moduleType="optional"
        modules={config.modules[level].optional}
      />
    </section>
  );
}
