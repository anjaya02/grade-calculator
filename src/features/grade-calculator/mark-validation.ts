// null clears a mark; undefined rejects the edit. A lone decimal point is
// allowed while typing, but does not count as an entered mark.
export function parseMarkInput(value: string): number | null | undefined {
  if (value.trim() !== value || !/^\d*(?:\.\d{0,2})?$/.test(value)) {
    return undefined;
  }
  if (value === "" || value === ".") return null;

  const mark = Number(value);
  return mark >= 0 && mark <= 100 ? mark : undefined;
}
