import { GradeCalculator } from "@/features/grade-calculator/components/grade-calculator";
import { softwareEngineeringConfig } from "@/features/grade-calculator/data/software-engineering";

export default function SECalculatorPage() {
  return <GradeCalculator config={softwareEngineeringConfig} />;
}
