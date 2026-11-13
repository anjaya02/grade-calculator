import { normalizeMark } from "@/lib/marks";

export function normalizeMarkInput(value: string): string {
  return value.replace(/^0+(?=\d)/, "");
}

// null clears a mark; undefined rejects the edit. A lone decimal point is
// allowed while typing, but does not count as an entered mark.
export function parseMarkInput(value: string): string | null | undefined {
  if (value === "" || value === ".") return null;
  return normalizeMark(value) ?? undefined;
}
