import { isUsageCounts, type UsageCounts, type UsageCourse } from "../usage";

// A single Redis operation prevents concurrent visitors or retries from losing
// increments or counting the same completed visit twice.
const incrementScript = `
  if redis.call("EXISTS", KEYS[2]) == 0 then
    redis.call("HINCRBY", KEYS[1], ARGV[1], 1)
    redis.call("SET", KEYS[2], "1", "EX", 86400)
  end
  return redis.call("HMGET", KEYS[1], "cs", "se")
`;

export class UsageStorageUnavailable extends Error {
  constructor() {
    super("Calculation counters are unavailable.");
  }
}

function storageConfig() {
  // The Vercel Marketplace integration can use the KV_ variable names.
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) throw new UsageStorageUnavailable();

  const environment =
    process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  const namespace =
    process.env.USAGE_COUNTER_NAMESPACE || `grade-calculator:${environment}`;

  // Matching Redis hash tags keep the script's keys in the same cluster slot.
  return { url, token, prefix: `{${namespace}}` };
}

async function command(
  config: ReturnType<typeof storageConfig>,
  args: (string | number)[],
): Promise<UsageCounts> {
  const response = await fetch(config.url.replace(/\/$/, ""), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) throw new UsageStorageUnavailable();

  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("result" in data)) {
    throw new UsageStorageUnavailable();
  }

  const values = data.result;
  if (!Array.isArray(values) || values.length !== 2) {
    throw new UsageStorageUnavailable();
  }

  const parseCount = (value: unknown) => {
    if (value === null) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
    return Number.NaN;
  };
  const counts = { cs: parseCount(values[0]), se: parseCount(values[1]) };
  if (!isUsageCounts(counts)) throw new UsageStorageUnavailable();

  return counts;
}

export function getUsageCounts() {
  const config = storageConfig();
  return command(config, ["HMGET", `${config.prefix}:counts`, "cs", "se"]);
}

export function incrementUsage(course: UsageCourse, eventId: string) {
  const config = storageConfig();
  return command(config, [
    "EVAL",
    incrementScript,
    2,
    `${config.prefix}:counts`,
    `${config.prefix}:event:${course}:${eventId}`,
    course,
  ]);
}
