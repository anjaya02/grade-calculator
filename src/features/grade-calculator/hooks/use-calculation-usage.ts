"use client";

import { useEffect, useRef } from "react";
import type { UsageCourse } from "@/lib/usage";

async function recordCalculation(course: UsageCourse, eventId: string) {
  // Reuse the event ID on retry, including when the server counted the first
  // request but its response was lost. Counting never blocks the results.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        mode: "same-origin",
        body: JSON.stringify({ course, eventId }),
        keepalive: true,
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok || response.status < 500) return;
    } catch {
      // Results remain usable while offline or if the counter is unavailable.
    }
    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export function useCalculationUsage(
  course: UsageCourse,
  hasCompletedCalculation: boolean,
) {
  const recorded = useRef(false);

  useEffect(() => {
    if (!hasCompletedCalculation || recorded.current) return;
    recorded.current = true;
    void recordCalculation(course, crypto.randomUUID());
  }, [course, hasCompletedCalculation]);
}
