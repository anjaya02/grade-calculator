import type { GradeCalculatorController } from "../hooks/use-grade-calculator";
import type { CourseConfig, LevelId } from "../types";
import { ModuleSection } from "./module-section";

type LevelSectionProps = {
  config: CourseConfig;
  controller: GradeCalculatorController;
  level: LevelId;
};

export function LevelSection({
  config,
  controller,
  level,
}: LevelSectionProps) {
  const levelNumber = level === "l5" ? 5 : 6;

  return (
    <section className="space-y-6">
      <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900">
        Level {levelNumber} Modules
      </h2>
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
