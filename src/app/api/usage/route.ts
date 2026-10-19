import { NextResponse } from "next/server";
import { getUsageCounts, incrementUsage } from "@/lib/server/usage-store";
import { isUsageCourse } from "@/lib/usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };
const eventIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function unavailable() {
  return NextResponse.json(
    { error: "Calculation totals are temporarily unavailable." },
    { status: 503, headers },
  );
}

export async function GET() {
  try {
    return NextResponse.json({ counts: await getUsageCounts() }, { headers });
  } catch {
    return unavailable();
  }
}

export async function POST(request: Request) {
  // Normal browser submissions must come from this website.
  if (
    request.headers.get("origin") !== new URL(request.url).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403, headers });
  }

  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return NextResponse.json(
      { error: "Expected JSON." },
      { status: 415, headers },
    );
  }

  let data: unknown;
  try {
    const body = await request.text();
    if (body.length > 256) {
      return NextResponse.json(
        { error: "Request is too large." },
        { status: 413, headers },
      );
    }
    data = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON." },
      { status: 400, headers },
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("course" in data) ||
    !isUsageCourse(data.course) ||
    !("eventId" in data) ||
    typeof data.eventId !== "string" ||
    !eventIdPattern.test(data.eventId) ||
    Object.keys(data).some((key) => key !== "course" && key !== "eventId")
  ) {
    return NextResponse.json(
      { error: "Expected a course and a calculation event ID." },
      { status: 400, headers },
    );
  }

  try {
    const counts = await incrementUsage(data.course, data.eventId);
    return NextResponse.json({ counts }, { headers });
  } catch {
    return unavailable();
  }
}
