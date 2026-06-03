export type DegreeModule = {
  id: string;
  name: string;
  credits: number;
  mark: number;
  level: "l5" | "l6";
};

export function calculateHonoursClassification<T extends DegreeModule>(
  modules: T[],
) {
  if (modules.length === 0) return null;

  const modulesBelowPassMark = modules.filter((module) => module.mark < 40);

  const calculateLevel = (levelModules: DegreeModule[]) => {
    const credits = levelModules.reduce((sum, module) => sum + module.credits, 0);
    const weightedMarks = levelModules.reduce(
      (sum, module) => sum + module.mark * module.credits,
      0,
    );

    return {
      credits,
      average: credits > 0 ? weightedMarks / credits : null,
    };
  };

  const allL5 = calculateLevel(
    modules.filter((module) => module.level === "l5"),
  );
  const allL6 = calculateLevel(
    modules.filter((module) => module.level === "l6"),
  );

  if (allL6.average === null) return null;

  // Clause 7.3.5: without Level 5 credits, all Level 6 credits count at 100%.
  if (allL5.average === null) {
    return {
      l5Average: null,
      l6Average: allL6.average,
      indicatorScore: allL6.average,
      roundedIndicatorScore: Math.round(allL6.average),
      l5Credits: 0,
      l6Credits: allL6.credits,
      totalCredits: allL6.credits,
      disregardedModule: null,
      disregardedCredits: 0,
      modulesBelowPassMark,
    };
  }

  // Clauses 7.3.2-7.3.3: disregard the lowest 20 credits, preferring L6 on a
  // joint lowest mark across both levels.
  const disregardedIndex = modules.reduce((lowestIndex, module, index) => {
    const lowest = modules[lowestIndex];

    if (module.mark < lowest.mark) return index;
    if (
      module.mark === lowest.mark &&
      module.level === "l6" &&
      lowest.level === "l5"
    ) {
      return index;
    }

    return lowestIndex;
  }, 0);

  const disregardedModule = modules[disregardedIndex];
  const disregardedCredits = Math.min(20, disregardedModule.credits);

  const countedModules = modules.flatMap((module, index) => {
    if (index !== disregardedIndex) return [module];

    const countedCredits = module.credits - disregardedCredits;
    return countedCredits > 0 ? [{ ...module, credits: countedCredits }] : [];
  });

  const l5 = calculateLevel(
    countedModules.filter((module) => module.level === "l5"),
  );
  const l6 = calculateLevel(
    countedModules.filter((module) => module.level === "l6"),
  );

  if (l5.average === null || l6.average === null) return null;

  const indicatorScore = l5.average / 3 + (2 * l6.average) / 3;

  return {
    l5Average: l5.average,
    l6Average: l6.average,
    indicatorScore,
    roundedIndicatorScore: Math.round(indicatorScore),
    l5Credits: l5.credits,
    l6Credits: l6.credits,
    totalCredits: l5.credits + l6.credits,
    disregardedModule,
    disregardedCredits,
    modulesBelowPassMark,
  };
}
