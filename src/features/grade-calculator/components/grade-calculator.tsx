"use client";

import Footer from "@/components/Footer";
import { useGradeCalculator } from "../hooks/use-grade-calculator";
import { calculatorThemes } from "../theme";
import type { CourseConfig } from "../types";
import { CalculationMethod } from "./calculation-method";
import { CalculatorHeader } from "./calculator-header";
import { Disclaimer } from "./disclaimer";
import { LevelSection } from "./level-section";
import { ResultsCard } from "./results-card";

type GradeCalculatorProps = {
  config: CourseConfig;
};

export function GradeCalculator({ config }: GradeCalculatorProps) {
  const controller = useGradeCalculator(config);
  const theme = calculatorThemes[config.theme];

  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.page}`}
    >
      <div
        className={`pointer-events-none absolute top-0 -left-4 h-96 w-96 animate-pulse rounded-full opacity-20 mix-blend-multiply blur-3xl ${theme.backgroundShape}`}
      />
      <div className="pointer-events-none absolute top-0 -right-4 h-96 w-96 animate-pulse rounded-full bg-sky-300 opacity-20 mix-blend-multiply blur-3xl delay-1000" />

      <CalculatorHeader
        name={config.name}
        icon={config.icon}
        theme={config.theme}
      />

      <main>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <LevelSection
              config={config}
              controller={controller}
              level="l5"
            />
            <LevelSection
              config={config}
              controller={controller}
              level="l6"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ResultsCard
            controller={controller}
            optionalModulesPerLevel={config.optionalModulesPerLevel}
          />
        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-4xl px-4 sm:px-6 lg:px-8">
          <CalculationMethod
            optionalModulesPerLevel={config.optionalModulesPerLevel}
          />
        </div>

        <div className="relative z-10 mx-auto mb-6 mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
          <Disclaimer />
        </div>
      </main>

      <Footer />
    </div>
  );
}
