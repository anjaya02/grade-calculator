import Link from "next/link";
import { ArrowLeft, BookOpen, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculatorThemes } from "../theme";
import type { CourseConfig } from "../types";

type CalculatorHeaderProps = Pick<CourseConfig, "name" | "icon" | "theme">;

export function CalculatorHeader({
  name,
  icon,
  theme,
}: CalculatorHeaderProps) {
  const Icon = icon === "book" ? BookOpen : Code;

  return (
    <header className="relative z-40 sticky top-0 border-b border-indigo-100/50 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div
          className={`rounded-xl bg-gradient-to-br p-2.5 shadow-lg ${calculatorThemes[theme].icon}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            {name} Calculator
          </h1>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            L5/L6 Weighted Classification
          </p>
        </div>
      </div>
    </header>
  );
}
