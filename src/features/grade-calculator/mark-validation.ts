import { isValidMark } from "@/lib/marks";

export function normalizeMarkInput(value: string): string {
  return value.replace(/^0+(?=\d)/, "");
}

// null clears a mark; undefined rejects the edit. A lone decimal point is
// allowed while typing, but does not count as an entered mark.
export function parseMarkInput(value: string): number | null | undefined {
  if (value.trim() !== value || !/^\d*(?:\.\d{0,2})?$/.test(value)) {
    return undefined;
  }
  if (value === "" || value === ".") return null;

  const mark = Number(value);
  return isValidMark(mark) ? mark : undefined;
}
