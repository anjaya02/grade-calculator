import { ChevronDown } from "lucide-react";
import { describeOptionalCount } from "../classification";

type CalculationMethodProps = { optionalModulesPerLevel: number };

export function CalculationMethod({
  optionalModulesPerLevel,
}: CalculationMethodProps) {
  const rules = [
    "The lowest-mark module across Levels 5 and 6 is disregarded from the best 220 credits.",
    "If the lowest module is worth more than 20 credits, only 20 credits are disregarded. Its remaining credits still count.",
    `Choose exactly ${describeOptionalCount(optionalModulesPerLevel)} at each level.`,
    "A tie between Level 5 and Level 6 lowest marks is resolved by disregarding the Level 6 module.",
    "The indicator score is rounded to the nearest integer before classification is assigned.",
    "Disregarding credits does not turn a failed module into a pass. Every Level 5 and 6 module must still receive credit before an Honours classification can be assigned.",
  ];
  return (
    <details className="group border-y border-border">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 outline-offset-4">
        <span>
          <span className="block font-display text-2xl font-bold uppercase leading-tight tracking-[-0.02em]">
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
      <div className="grid gap-7 border-t border-border py-6 lg:grid-cols-[280px_1fr] lg:gap-10">
        <div className="self-start rounded-lg bg-[#eef1e8] p-5">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            The weighted indicator
          </p>
          <p className="text-xl font-medium leading-relaxed text-primary">
            ⅓ × Level 5 average
            <br />
            <span className="text-muted-foreground">+</span> ⅔ × Level 6 average
          </p>
        </div>
        <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {rules.map((rule, index) => (
            <li
              key={rule}
              className="flex gap-3 text-xs leading-6 text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="pt-0.5 font-mono text-[10px] text-primary"
              >
                0{index + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
