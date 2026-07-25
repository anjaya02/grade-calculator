import { Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { describeOptionalCount } from "../classification";

type CalculationMethodProps = {
  optionalModulesPerLevel: number;
};

const rulesBeforeOptional = [
  {
    color: "bg-green-500",
    content:
      "The lowest-mark module across Levels 5 and 6 is disregarded from the best 220 credits.",
  },
  {
    color: "bg-red-500",
    content:
      "If the lowest module is worth more than 20 credits, only 20 credits are disregarded. Its remaining credits still count.",
  },
] as const;

const rulesAfterOptional = [
  {
    color: "bg-purple-500",
    content:
      "A tie between Level 5 and Level 6 lowest marks is resolved by disregarding the Level 6 module.",
  },
  {
    color: "bg-amber-500",
    content:
      "The indicator score is rounded to the nearest integer before the degree classification is assigned.",
  },
  {
    color: "bg-red-500",
    content:
      "Disregarding credits does not turn a failed module into a pass. Every Level 5 and Level 6 module must still receive credit before an Honours classification can be assigned.",
  },
] as const;

export function CalculationMethod({
  optionalModulesPerLevel,
}: CalculationMethodProps) {
  return (
    <Card className="group relative overflow-hidden border border-indigo-50/50 bg-white/60 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-6 w-6" />
          Calculation Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <div className="rounded-md bg-blue-50 p-4 sm:p-5">
          <p className="mb-2 text-base font-bold text-blue-900 sm:text-lg">
            Indicator Score Formula:
          </p>
          <p className="break-words font-mono text-base leading-relaxed text-blue-800 sm:text-lg">
            Indicator = (⅓ × L5 Average) + (⅔ × L6 Average)
          </p>
        </div>

        <ul className="space-y-2.5 break-words text-sm leading-relaxed sm:text-base">
          {rulesBeforeOptional.map((rule) => (
            <Rule key={rule.content} color={rule.color}>
              {rule.content}
            </Rule>
          ))}
          <Rule color="bg-blue-500">
            You must choose exactly{" "}
            <strong>{describeOptionalCount(optionalModulesPerLevel)}</strong> at
            each level.
          </Rule>
          {rulesAfterOptional.map((rule) => (
            <Rule key={rule.content} color={rule.color}>
              {rule.content}
            </Rule>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

type RuleProps = {
  color: string;
  children: React.ReactNode;
};

function Rule({ color, children }: RuleProps) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${color}`}
      />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}
