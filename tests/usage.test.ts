import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { GET, POST } from "../src/app/api/usage/route";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const eventId = "56f2822b-7425-4aa4-a273-d07c013159c1";
const origin = "https://calculator.example";

beforeEach(() => {
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.USAGE_COUNTER_NAMESPACE;
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example";
  process.env.UPSTASH_REDIS_REST_TOKEN = "server-only-test-token";
  process.env.VERCEL_ENV = "production";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

function request(
  data: unknown = { course: "cs", eventId },
  headers: Record<string, string> = {},
) {
  return new Request(`${origin}/api/usage`, {
    method: "POST",
    headers: { origin, "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data),
  });
}

test("missing storage returns unavailable instead of misleading zero totals", async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  globalThis.fetch = async () => {
    assert.fail("Unconfigured storage should not be contacted");
  };

  const response = await GET();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    error: "Calculation totals are temporarily unavailable.",
  });
});

test("reads persistent course totals without exposing credentials", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://redis.example");
    assert.equal(options?.cache, "no-store");
    assert.equal(
      new Headers(options?.headers).get("authorization"),
      "Bearer server-only-test-token",
    );
    assert.deepEqual(JSON.parse(String(options?.body)), [
      "HMGET", "{grade-calculator:production}:counts", "cs", "se",
    ]);
    return Response.json({ result: ["12", "8"] });
  };

  const response = await GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { counts: { cs: 12, se: 8 } });
});

test("an unused course starts at zero", async () => {
  globalThis.fetch = async () => Response.json({ result: ["1", null] });
  assert.deepEqual(await (await GET()).json(), { counts: { cs: 1, se: 0 } });
});

test("both courses accept only a course and random event ID", async () => {
  for (const course of ["cs", "se"]) {
    globalThis.fetch = async (_url, options) => {
      const command = JSON.parse(String(options?.body));
      assert.equal(command[0], "EVAL");
      assert.equal(command[2], 2);
      assert.equal(command[3], "{grade-calculator:production}:counts");
      assert.equal(
        command[4],
        `{grade-calculator:production}:event:${course}:${eventId}`,
      );
      assert.equal(command[5], course);
      return Response.json({ result: ["1", "1"] });
    };
    const response = await POST(request({ course, eventId }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { counts: { cs: 1, se: 1 } });
  }
});

test("cross-site and missing-origin submissions never contact storage", async () => {
  globalThis.fetch = async () => assert.fail("Rejected request reached Redis");
  assert.equal(
    (await POST(request(undefined, { origin: "https://another.example" }))).status,
    403,
  );
  assert.equal(
    (await POST(request(undefined, { "sec-fetch-site": "cross-site" }))).status,
    403,
  );
  const missingOrigin = request();
  missingOrigin.headers.delete("origin");
  assert.equal((await POST(missingOrigin)).status, 403);
});

test("invalid events and extra personal or grade fields never reach storage", async () => {
  globalThis.fetch = async () => assert.fail("Invalid payload reached Redis");
  for (const data of [
    null, [], {}, { course: "other", eventId }, { course: "cs" },
    { course: "cs", eventId: "invalid" },
    { course: "cs", eventId, grades: [70, 80] },
    { course: "cs", eventId, email: "student@example.com" },
  ]) {
    assert.equal((await POST(request(data))).status, 400);
  }
  assert.equal(
    (await POST(request(undefined, { "Content-Type": "text/plain" }))).status,
    415,
  );
  assert.equal((await POST(request({ course: "x".repeat(300), eventId }))).status, 413);
  const malformed = new Request(`${origin}/api/usage`, {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal((await POST(malformed)).status, 400);
});

test("storage errors and corrupt counters are unavailable, not fake totals", async () => {
  for (const result of [
    ["-1", "0"], ["not-a-number", "0"], ["", null],
    [Number.MAX_SAFE_INTEGER + 1, 0], [true, 0], [0],
  ]) {
    globalThis.fetch = async () => Response.json({ result });
    assert.equal((await GET()).status, 503);
  }
  globalThis.fetch = async () => Response.json({ error: "private upstream error" });
  assert.equal((await GET()).status, 503);
  globalThis.fetch = async () => new Response("upstream failure", { status: 500 });
  assert.equal((await POST(request())).status, 503);
  globalThis.fetch = async () => { throw new Error("Network unavailable"); };
  assert.equal((await GET()).status, 503);
});

test("preview and custom namespaces keep testing separate from live totals", async () => {
  for (const [environment, namespace, expected] of [
    ["preview", undefined, "grade-calculator:preview"],
    ["production", "custom-counter", "custom-counter"],
  ]) {
    process.env.VERCEL_ENV = environment;
    if (namespace) process.env.USAGE_COUNTER_NAMESPACE = namespace;
    else delete process.env.USAGE_COUNTER_NAMESPACE;
    globalThis.fetch = async (_url, options) => {
      assert.equal(JSON.parse(String(options?.body))[1], `{${expected}}:counts`);
      return Response.json({ result: [null, null] });
    };
    assert.equal((await GET()).status, 200);
  }
});

test("Vercel Marketplace credentials work with KV variable names", async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.KV_REST_API_URL = "https://marketplace.example";
  process.env.KV_REST_API_TOKEN = "marketplace-test-token";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://marketplace.example");
    assert.equal(
      new Headers(options?.headers).get("authorization"),
      "Bearer marketplace-test-token",
    );
    return Response.json({ result: [null, null] });
  };
  assert.equal((await GET()).status, 200);
});
