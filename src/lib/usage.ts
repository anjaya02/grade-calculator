export type UsageCourse = "cs" | "se";

export type UsageCounts = Record<UsageCourse, number>;

export function isUsageCourse(value: unknown): value is UsageCourse {
  return value === "cs" || value === "se";
}

export function isUsageCounts(value: unknown): value is UsageCounts {
  if (!value || typeof value !== "object") return false;

  const counts = value as Record<string, unknown>;
  return [counts.cs, counts.se].every(
    (count) =>
      typeof count === "number" && Number.isSafeInteger(count) && count >= 0,
  );
}
