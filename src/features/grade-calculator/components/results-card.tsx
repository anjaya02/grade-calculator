import { AlertCircle, Calculator } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  describeOptionalCount,
  getClassificationBand,
} from "../classification";
import type { GradeCalculatorController } from "../hooks/use-grade-calculator";

type ResultsCardProps = {
  controller: GradeCalculatorController;
  optionalModulesPerLevel: number;
};

export function ResultsCard({
  controller,
  optionalModulesPerLevel,
}: ResultsCardProps) {
  const { results, hasOtherModulesSelected } = controller;

  return (
    <Card className="border border-indigo-50/50 bg-white/60 shadow-2xl shadow-indigo-100/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Classification Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results ? (
          <ResultDetails results={results} />
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center text-gray-500">
            <Calculator className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>
              Select {describeOptionalCount(optionalModulesPerLevel)} per level
              and enter marks for every module to see your classification.
            </p>
          </div>
        )}

        {hasOtherModulesSelected && (
          <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-amber-800">
              <strong>📝 Note:</strong> You&apos;ve added an other optional
              module. Ensure it&apos;s a valid replacement approved by your
              department.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type ResultDetailsProps = {
  results: NonNullable<GradeCalculatorController["results"]>;
};

function ResultDetails({ results }: ResultDetailsProps) {
  const hasFailedModules = results.modulesBelowPassMark.length > 0;
  const classification = getClassificationBand(
    results.roundedIndicatorScore,
    hasFailedModules,
  );

  return (
    <div className={`rounded-lg border-2 p-4 ${classification.background}`}>
      <div className="text-center">
        <div className="mb-3 font-[family-name:var(--font-geist-mono)] text-5xl font-black tabular-nums tracking-tight text-gray-900 drop-shadow-sm">
          {results.roundedIndicatorScore}%
        </div>
        <div
          className={`rounded-full px-4 py-2 text-lg font-bold ${classification.color}`}
        >
          {classification.label}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <ResultRow
          label="Unrounded Indicator Score:"
          value={`${results.indicatorScore.toFixed(2)}%`}
        />
        <ResultRow
          label="L5 Average:"
          value={
            results.l5Average !== null
              ? `${results.l5Average.toFixed(1)}%`
              : "Not used"
          }
        />
        <ResultRow
          label="L6 Average:"
          value={`${results.l6Average.toFixed(1)}%`}
        />
        <ResultRow label="L5 Credits:" value={results.l5Credits} />
        <ResultRow label="L6 Credits:" value={results.l6Credits} />
        <ResultRow label="Total Credits:" value={results.totalCredits} />
        {results.disregardedModule && (
          <ResultRow
            label="Disregarded Credits:"
            value={`${results.disregardedModule.name} (${results.disregardedModule.mark}%, ${results.disregardedCredits} credits)`}
            alignRight
          />
        )}
      </div>

      {hasFailedModules && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
          <p className="text-red-800">
            <strong>No Honours classification can be assigned:</strong> The
            following module marks are below the Level 5/6 pass mark of 40%:{" "}
            {results.modulesBelowPassMark
              .map((module) => module.name)
              .join(", ")}
            . Disregarding credits affects the indicator score only.
          </p>
        </div>
      )}
    </div>
  );
}

type ResultRowProps = {
  label: string;
  value: string | number;
  alignRight?: boolean;
};

function ResultRow({ label, value, alignRight = false }: ResultRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className={`font-medium ${alignRight ? "text-right" : ""}`}>
        {value}
      </span>
    </div>
  );
}
