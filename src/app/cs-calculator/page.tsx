import { GradeCalculator } from "@/features/grade-calculator/components/grade-calculator";
import { computerScienceConfig } from "@/features/grade-calculator/data/computer-science";

export default function CSCalculatorPage() {
  return <GradeCalculator config={computerScienceConfig} />;
}
