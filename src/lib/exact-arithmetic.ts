export type Ratio = { numerator: bigint; denominator: bigint };

// Scores are non-negative. An exact half rounds upwards, matching Math.round
// without allowing binary floating-point error to move the boundary.
export function roundRatio({ numerator, denominator }: Ratio): number {
  return Number((2n * numerator + denominator) / (2n * denominator));
}

export function compareRatios(left: Ratio, right: Ratio): bigint {
  return left.numerator * right.denominator - right.numerator * left.denominator;
}

// Show a prefix, not a rounded approximation that could cross a class boundary.
// An ellipsis signals any remaining digits, including a recurring decimal.
export function displayRatio({ numerator, denominator }: Ratio): string {
  const whole = numerator / denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return String(whole);
  let fraction = "";
  for (let place = 0; place < 6 && remainder !== 0n; place++) {
    remainder *= 10n;
    fraction += String(remainder / denominator);
    remainder %= denominator;
  }
  return `${whole}.${fraction}${remainder === 0n ? "" : "…"}`;
}

// Compact averages are display-only. Mark any rounding explicitly, and keep
// the fuller prefix available in the calculation breakdown.
export function displayAverage({ numerator, denominator }: Ratio): string {
  const hundredths = (2n * numerator * 100n + denominator) / (2n * denominator);
  const whole = hundredths / 100n;
  const fraction = String(hundredths % 100n).padStart(2, "0").replace(/0+$/, "");
  const approximate = (numerator * 100n) % denominator !== 0n;
  return `${approximate ? "≈" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

// Numeric summaries are approximate. Selection, pass checks, rounding, and
// displayed scores use exact arithmetic, never these converted values.
export function ratioToNumber({ numerator, denominator }: Ratio): number {
  const whole = numerator / denominator;
  const fraction = ((numerator % denominator) * 10n ** 15n) / denominator;
  return Number(whole) + Number(fraction) / 1e15;
}
