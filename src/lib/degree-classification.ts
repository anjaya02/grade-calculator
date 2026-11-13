import { compareRatios, displayAverage, displayRatio, ratioToNumber, roundRatio, type Ratio } from "./exact-arithmetic";
import { normalizeMark, type Mark } from "./marks";

export const HONOURS_REGULATIONS = {
  year: "2026–27",
  sourceUrl: "https://www.westminster.ac.uk/sites/default/public-files/general-documents/academic-regulations-2026-27-section-17-framework-for-ug-taught-courses.pdf",
} as const;

export type DegreeModule = {
  id: string;
  name: string;
  credits: number;
  mark: Mark;
  level: "l5" | "l6";
};

export function calculateHonoursClassification<T extends DegreeModule>(modules: T[]) {
  if (!Array.isArray(modules) || modules.length === 0 || modules.length > 12) return null;
  const ids = new Set<string>();
  const prepared = [];
  for (const courseModule of modules) {
    if (
      !courseModule || typeof courseModule.id !== "string" || !courseModule.id.trim() ||
      ids.has(courseModule.id) || typeof courseModule.name !== "string" || !courseModule.name.trim() ||
      (courseModule.level !== "l5" && courseModule.level !== "l6") ||
      !Number.isSafeInteger(courseModule.credits) || courseModule.credits <= 0 ||
      courseModule.credits > 120 || courseModule.credits % 20 !== 0
    ) return null;
    const mark = normalizeMark(courseModule.mark);
    if (mark === null) return null;
    ids.add(courseModule.id);
    prepared.push({ module: courseModule, mark });
  }

  const places = Math.max(...prepared.map(({ mark }) => mark.split(".")[1]?.length ?? 0));
  const scale = 10n ** BigInt(places);
  const exact = prepared.map(({ module, mark }) => {
    const [whole, fraction = ""] = mark.split(".");
    return { module, units: BigInt(whole + fraction.padEnd(places, "0")) };
  });
  const levelTotals = (level: DegreeModule["level"]) => exact
    .filter(({ module }) => module.level === level)
    .reduce((total, { module, units }) => ({
      credits: total.credits + module.credits,
      weighted: total.weighted + units * BigInt(module.credits),
    }), { credits: 0, weighted: 0n });

  const allL5 = levelTotals("l5");
  const allL6 = levelTotals("l6");
  // Supported records contain full levels, excluding placement credits and
  // partial RPL records that require course-specific interpretation.
  if (allL6.credits !== 120 || (allL5.credits !== 0 && allL5.credits !== 120)) return null;
  const modulesBelowPassMark = exact
    .filter(({ units }) => units < 40n * scale)
    .map(({ module }) => module);

  const summarize = (l5: typeof allL5, l6: typeof allL6) => {
    const l5Ratio = l5.credits ? { numerator: l5.weighted, denominator: BigInt(l5.credits) * scale } : null;
    const l6Ratio = { numerator: l6.weighted, denominator: BigInt(l6.credits) * scale };
    const score: Ratio = l5Ratio ? {
      numerator: l5.weighted * BigInt(l6.credits) + 2n * l6.weighted * BigInt(l5.credits),
      denominator: 3n * BigInt(l5.credits) * BigInt(l6.credits) * scale,
    } : l6Ratio;
    return {
      score,
      values: {
        l5Average: l5Ratio ? ratioToNumber(l5Ratio) : null,
        l6Average: ratioToNumber(l6Ratio),
        l5AverageDisplay: l5Ratio ? displayRatio(l5Ratio) : null,
        l6AverageDisplay: displayRatio(l6Ratio),
        l5AverageSummary: l5Ratio ? displayAverage(l5Ratio) : null,
        l6AverageSummary: displayAverage(l6Ratio),
        indicatorScore: ratioToNumber(score),
        indicatorScoreDisplay: displayRatio(score),
        roundedIndicatorScore: roundRatio(score),
        l5Credits: l5.credits,
        l6Credits: l6.credits,
        totalCredits: l5.credits + l6.credits,
      },
    };
  };

  // 2026–27 §7.3.4: recognised/transferred Level 5 credit carries no marks.
  if (allL5.credits === 0) {
    return { ...summarize(allL5, allL6).values, disregardedModule: null, disregardedCredits: 0, modulesBelowPassMark, candidates: [] };
  }

  // §7.3.2 requires both provisional indicators; a globally lowest mark alone
  // does not establish which removal benefits the weighted indicator most.
  const candidates = (["l5", "l6"] as const).map((level) => {
    const lowest = exact.filter(({ module }) => module.level === level)
      .reduce((best, item) => item.units < best.units ||
        (item.units === best.units && item.module.id < best.module.id) ? item : best);
    const l5 = { ...allL5 };
    const l6 = { ...allL6 };
    const reduced = level === "l5" ? l5 : l6;
    reduced.credits -= 20;
    reduced.weighted -= 20n * lowest.units;
    return { ...summarize(l5, l6), disregardedModule: lowest.module, level };
  });
  // An exact tie gives the same indicator. L6 is a deterministic display
  // choice here, not the old requirement to break a lowest-mark tie against L6.
  const winner = compareRatios(candidates[0].score, candidates[1].score) > 0n
    ? candidates[0] : candidates[1];
  return {
    ...winner.values,
    disregardedModule: winner.disregardedModule,
    disregardedCredits: 20,
    modulesBelowPassMark,
    candidates: candidates.map(({ level, disregardedModule, values }) => ({
      level, disregardedModule, indicatorScoreDisplay: values.indicatorScoreDisplay,
    })),
  };
}
