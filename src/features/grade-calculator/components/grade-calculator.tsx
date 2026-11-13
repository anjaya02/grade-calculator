"use client";

import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { useCalculationUsage } from "../hooks/use-calculation-usage";
import { useGradeCalculator } from "../hooks/use-grade-calculator";
import type { CourseConfig } from "../types";
import { CalculationMethod } from "./calculation-method";
import { CalculatorHeader } from "./calculator-header";
import { Disclaimer } from "./disclaimer";
import { DraftControls } from "./draft-controls";
import { LevelSection } from "./level-section";
import { ResultsCard } from "./results-card";

type GradeCalculatorProps = { config: CourseConfig };

export function GradeCalculator({ config }: GradeCalculatorProps) {
  const controller = useGradeCalculator(config);
  useCalculationUsage(
    config.id,
    controller.hasUserChanges && controller.results !== null,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <CalculatorHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-14 pt-10 sm:px-8 sm:pt-12">
        <div className="page-enter mb-10 border-b border-border pb-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
            {config.id} / Degree classification worksheet
          </p>
          <h1 className="text-balance font-display text-[clamp(2rem,8vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.025em] [overflow-wrap:anywhere]">
            {config.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Select your optional modules and enter your marks. Your weighted
            result updates as soon as every required mark is in. Enter marks from
            0 to 100, including all recorded decimal places.
          </p>
          <div className="mt-5 max-w-xl text-xs leading-5">
            <label className="flex cursor-pointer items-start gap-2.5" htmlFor="level6-only">
              <Checkbox id="level6-only" checked={controller.level6Only}
                disabled={!controller.isReady}
                onCheckedChange={(checked) => controller.setLevel6Only(checked === true)} />
              <span>My Level 5 credits were transferred or recognised, with no Level 5 marks.</span>
            </label>
            {controller.level6Only && (
              <p className="mt-2 text-muted-foreground">
                All 120 Level 6 credits count at 100%; no credits are disregarded.
                Partial credit transfers are not supported by this worksheet.
              </p>
            )}
          </div>
          <DraftControls controller={controller} />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <fieldset
            key={controller.formVersion}
            disabled={!controller.isReady}
            aria-busy={!controller.isReady}
            className={`grid min-w-0 items-start gap-8 ${controller.level6Only ? "" : "xl:grid-cols-2"}`}
          >
            <legend className="sr-only">Module marks</legend>
            {!controller.level6Only && <LevelSection config={config} controller={controller} level="l5" />}
            <LevelSection config={config} controller={controller} level="l6" />
          </fieldset>
          <aside
            className="min-w-0"
            aria-label="Your classification summary"
          >
            <ResultsCard controller={controller} config={config} />
          </aside>
        </div>

        <div className="mt-12">
          <CalculationMethod
            optionalModulesPerLevel={config.optionalModulesPerLevel}
            level6Only={controller.level6Only}
          />
          <Disclaimer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
