// Strings preserve decimal marks that cannot be represented exactly as Numbers.
// Numeric marks remain supported for existing saved drafts and library callers.
export type Mark = string | number;

export const MAX_MARK_LENGTH = 1024;

function expandNumericMark(value: number): string {
  const text = String(value);
  if (!text.includes("e")) return text;
  const [coefficient, exponent] = text.split("e");
  const [whole, fraction = ""] = coefficient.split(".");
  const digits = whole + fraction;
  const point = whole.length + Number(exponent);
  if (point <= 0) return `0.${"0".repeat(-point)}${digits}`;
  if (point >= digits.length) return digits + "0".repeat(point - digits.length);
  return `${digits.slice(0, point)}.${digits.slice(point)}`;
}

export function normalizeMark(value: unknown): string | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0 || value > 100) return null;
    value = expandNumericMark(value);
  }
  if (
    typeof value !== "string" || value.length === 0 ||
    value.length > MAX_MARK_LENGTH || value.trim() !== value ||
    !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)
  ) return null;

  const [integer = "", decimals = ""] = value.split(".");
  const whole = integer.replace(/^0+/, "") || "0";
  const fraction = decimals.replace(/0+$/, "");
  if (whole.length > 3 || Number(whole) > 100 || (whole === "100" && fraction)) return null;
  return fraction ? `${whole}.${fraction}` : whole;
}

export function isValidMark(value: unknown): value is Mark {
  return normalizeMark(value) !== null;
}
