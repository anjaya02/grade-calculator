"use client";

import Footer from "@/components/Footer";
import { useCalculationUsage } from "../hooks/use-calculation-usage";
import { useGradeCalculator } from "../hooks/use-grade-calculator";
import type { CourseConfig } from "../types";
import { CalculationMethod } from "./calculation-method";
import { CalculatorHeader } from "./calculator-header";
import { Disclaimer } from "./disclaimer";
import { LevelSection } from "./level-section";
import { ResultsCard } from "./results-card";

type GradeCalculatorProps = { config: CourseConfig };

export function GradeCalculator({ config }: GradeCalculatorProps) {
  const controller = useGradeCalculator(config);
  useCalculationUsage(config.id, controller.results !== null);

  return (
    <div className="flex min-h-screen flex-col">
      <CalculatorHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-14 pt-10 sm:px-8 sm:pt-12">
        <div className="page-enter mb-10 border-b border-border pb-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
            {config.id} / Degree classification worksheet
          </p>
          <h1 className="font-display text-[2.5rem] font-bold uppercase leading-[1.05] tracking-[-0.025em] sm:text-[3.5rem]">
            {config.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Select your optional modules and enter your marks. Your weighted
            result updates as soon as every required mark is in.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <div className="grid min-w-0 items-start gap-8 xl:grid-cols-2">
            <LevelSection config={config} controller={controller} level="l5" />
            <LevelSection config={config} controller={controller} level="l6" />
          </div>
          <aside
            className="min-w-0 lg:sticky lg:top-24"
            aria-label="Your classification summary"
          >
            <ResultsCard controller={controller} config={config} />
          </aside>
        </div>

        <div className="mt-12">
          <CalculationMethod
            optionalModulesPerLevel={config.optionalModulesPerLevel}
          />
          <Disclaimer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
