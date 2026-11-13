import { ArrowUpRight, ChevronDown } from "lucide-react";
import { describeOptionalCount } from "../classification";
import { HONOURS_REGULATIONS } from "@/lib/degree-classification";

type CalculationMethodProps = { optionalModulesPerLevel: number; level6Only: boolean };

export function CalculationMethod({
  optionalModulesPerLevel,
  level6Only,
}: CalculationMethodProps) {
  const rules = [
    "Two provisional indicators are calculated: disregard the lowest 20 Level 5 credits, then separately the lowest 20 Level 6 credits. Use the higher indicator.",
    "If the lowest module is worth more than 20 credits, only 20 credits are disregarded. Its remaining credits still count.",
    `Choose exactly ${describeOptionalCount(optionalModulesPerLevel)} at each level.`,
    "Use final recorded module marks with all available decimal places. Module marks and level averages are not rounded during calculation.",
    "The indicator score is rounded to the nearest integer before classification is assigned.",
    "Disregarding credits does not turn a failed module into a pass. Every Level 5 and 6 module must still receive credit before an Honours classification can be assigned.",
  ];
  return (
    <details className="group border-y border-border">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 outline-offset-4">
        <span>
          <span className="block text-balance font-display text-2xl font-bold uppercase leading-tight tracking-[-0.02em]">
            How your result is calculated
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            The weighting, the credits, and the small print.
          </span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="grid min-w-0 gap-7 border-t border-border py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0 self-start rounded-lg bg-[#eef1e8] p-5">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            The weighted indicator
          </p>
          <p className="text-xl font-medium leading-relaxed text-primary">
            {level6Only ? "100% × Level 6 average" : (
              <>
                ⅓ × Level 5 average<br />
                <span className="text-muted-foreground">+</span> ⅔ × Level 6 average
              </>
            )}
          </p>
          <div className="mt-4 border-t border-border pt-3">
            <a href={HONOURS_REGULATIONS.sourceUrl} target="_blank" rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 rounded-sm text-xs leading-5 text-primary underline underline-offset-4 outline-offset-4">
              <span className="min-w-0">View official regulations</span>
              <ArrowUpRight className="size-3 shrink-0" aria-hidden="true" />
            </a>
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              Westminster · {HONOURS_REGULATIONS.year}
            </p>
          </div>
        </div>
        <ol className="grid min-w-0 gap-x-8 gap-y-5 sm:grid-cols-2">
          {(level6Only ? [
            "Where all Level 5 credit is recognised or transferred with no Level 5 marks, all 120 Level 6 credits count at 100%. No credits are disregarded.",
            `Choose ${describeOptionalCount(optionalModulesPerLevel)} at Level 6 and enter every final module mark.`,
            rules[3], rules[4], rules[5],
          ] : rules).map((rule, index) => (
            <li
              key={rule}
              className="flex min-w-0 gap-3 text-xs leading-6 text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="shrink-0 pt-0.5 font-mono text-[10px] text-primary"
              >
                0{index + 1}
              </span>
              <span className="min-w-0">{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
