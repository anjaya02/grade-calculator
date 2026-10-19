import { AlertCircle, Check, ChevronDown, LockKeyhole } from "lucide-react";
import {
  describeOptionalCount,
  getClassificationBand,
} from "../classification";
import type { GradeCalculatorController } from "../hooks/use-grade-calculator";
import type { CourseConfig } from "../types";

type ResultsCardProps = {
  controller: GradeCalculatorController;
  config: CourseConfig;
};

export function ResultsCard({ controller, config }: ResultsCardProps) {
  const { results, hasOtherModulesSelected } = controller;
  const progress = (["l5", "l6"] as const).map((level) => {
    const state = controller.levels[level];
    const entered =
      config.modules[level].core.filter(
        (module) => state.coreMarks[module.id] !== undefined,
      ).length +
      [...state.selectedOptionals].filter(
        (id) => state.optionalMarks[id] !== undefined,
      ).length;
    return {
      level,
      entered,
      total: config.modules[level].core.length + config.optionalModulesPerLevel,
    };
  });
  const hasFailedModules = Boolean(results?.modulesBelowPassMark.length);
  const classification = results
    ? getClassificationBand(results.roundedIndicatorScore, hasFailedModules)
    : null;

  return (
    <section
      id="classification-results"
      aria-labelledby="results-heading"
      className="scroll-mt-24 overflow-hidden rounded-lg border border-[#c7d3c3] bg-white"
    >
      <div className="bg-[#234333] px-6 pb-7 pt-6 text-white">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
          <h2
            id="results-heading"
            className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#d0dfd0]"
          >
            Classification results
          </h2>
          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 px-2 py-1 text-[9px] text-[#e1eadd]">
            {results ? (
              hasFailedModules ? (
                <AlertCircle className="size-3" aria-hidden="true" />
              ) : (
                <Check className="size-3" aria-hidden="true" />
              )
            ) : (
              <span
                className="size-1 rounded-full bg-[#c6d8ba]"
                aria-hidden="true"
              />
            )}
            {results
              ? hasFailedModules
                ? "Check modules"
                : "Calculated"
              : "In progress"}
          </span>
        </div>
        <div aria-live="polite" aria-atomic="true">
          <p className="mb-1 text-[11px] text-[#c4d4c4]">
            Weighted indicator score
          </p>
          <output
            aria-label="Rounded indicator score"
            className="font-score flex items-baseline gap-1 text-[6.5rem] font-extrabold leading-none tabular-nums tracking-[-0.055em]"
          >
            {results ? results.roundedIndicatorScore : "—"}
            <span className="ml-1 font-sans text-[1.75rem] font-normal tracking-[-0.03em] text-[#bdceba]">
              %
            </span>
          </output>
          <p
            className={`mt-3 text-balance font-display text-[1.625rem] font-bold uppercase leading-[1.1] tracking-[-0.01em] ${hasFailedModules ? "text-[#f1d4b1]" : ""}`}
          >
            {classification?.label ?? "Your result starts here."}
          </p>
          <p className="mt-3 text-[11px] leading-5 text-[#c4d4c4]">
            {results
              ? `Rounded from an indicator of ${results.indicatorScore.toFixed(2)}%.`
              : "A clear summary of your Level 5 and 6 marks."}
          </p>
        </div>
      </div>

      <div className="p-6">
        {results ? (
          <>
            <dl className="grid grid-cols-2 divide-x divide-border">
              <div className="pr-4">
                <dt className="text-[11px] text-muted-foreground">
                  Level 5 average
                </dt>
                <dd className="mt-2 text-2xl font-medium tabular-nums tracking-[-0.04em]">
                  {results.l5Average !== null
                    ? `${results.l5Average.toFixed(1)}%`
                    : "Not used"}
                  <span className="mt-1 block text-[10px] font-normal tracking-normal text-muted-foreground">
                    ⅓ of the indicator
                  </span>
                </dd>
              </div>
              <div className="pl-5">
                <dt className="text-[11px] text-muted-foreground">
                  Level 6 average
                </dt>
                <dd className="mt-2 text-2xl font-medium tabular-nums tracking-[-0.04em]">
                  {results.l6Average.toFixed(1)}%
                  <span className="mt-1 block text-[10px] font-normal tracking-normal text-muted-foreground">
                    ⅔ of the indicator
                  </span>
                </dd>
              </div>
            </dl>
            <dl className="mt-6 border-t border-border pt-4">
              <ResultRow
                label="Credits considered"
                value={results.totalCredits}
              />
            </dl>
            <details className="group mt-4 border-t border-border pt-4">
              <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-sm text-xs font-medium outline-offset-4">
                Calculation breakdown
                <ChevronDown
                  className="size-3.5 shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <dl className="mt-4 space-y-3">
                <ResultRow
                  label="Unrounded indicator"
                  value={`${results.indicatorScore.toFixed(2)}%`}
                />
                <ResultRow label="Level 5 credits" value={results.l5Credits} />
                <ResultRow label="Level 6 credits" value={results.l6Credits} />
              </dl>
              {results.disregardedModule && (
                <div className="mt-4 rounded-lg bg-background p-3 text-[11px] leading-5">
                  <p className="font-medium">
                    {results.disregardedCredits} credits disregarded
                  </p>
                  <p className="mt-1 text-muted-foreground [overflow-wrap:anywhere]">
                    {results.disregardedModule.name} ·{" "}
                    {results.disregardedModule.mark}%
                  </p>
                </div>
              )}
            </details>
          </>
        ) : (
          <div>
            <p className="text-xs leading-6 text-muted-foreground">
              Select {describeOptionalCount(config.optionalModulesPerLevel)} per
              level, then enter a mark for every module.
            </p>
            <div className="mt-5 space-y-4">
              {progress.map(({ level, entered, total }) => (
                <div key={level}>
                  <div className="mb-2 flex justify-between text-[11px]">
                    <span>Level {level === "l5" ? "5" : "6"}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {entered} / {total} marks
                    </span>
                  </div>
                  <progress
                    aria-label={`Level ${level === "l5" ? "5" : "6"} marks entered`}
                    value={entered}
                    max={total}
                    className="block h-1.5 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {hasFailedModules && results && (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#e9d3c5] bg-[#fcf5ee] p-3 text-[11px] leading-5 text-[#7b452e]">
            <AlertCircle
              className="mt-0.5 size-3.5 shrink-0"
              aria-hidden="true"
            />
            <p className="min-w-0 [overflow-wrap:anywhere]">
              <strong className="font-semibold">
                Pass requirements not met.
              </strong>{" "}
              Marks below 40%:{" "}
              {results.modulesBelowPassMark
                .map((module) => module.name)
                .join(", ")}
              . Disregarding credits affects the indicator only; no Honours
              classification can be assigned.
            </p>
          </div>
        )}
        {hasOtherModulesSelected && (
          <p className="mt-4 rounded-lg border border-border bg-background p-3 text-[11px] leading-5 text-muted-foreground">
            Your custom optional module must be an approved replacement. Confirm
            this with your department.
          </p>
        )}
        <div className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-[10px] leading-5 text-muted-foreground">
          <LockKeyhole className="mt-1 size-3 shrink-0" aria-hidden="true" />
          <p>
            Your marks stay in your browser. Completed visits contribute to the
            public usage count.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[11px]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="shrink-0 whitespace-nowrap font-medium tabular-nums">
        {value}
      </dd>
    </div>
  );
}
