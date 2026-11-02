export function isValidMark(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100 &&
    // Multiplying by 100 can introduce floating-point noise for valid marks.
    Number(value.toFixed(2)) === value
  );
}
