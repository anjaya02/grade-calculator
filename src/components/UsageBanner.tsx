"use client";

import { useEffect, useState } from "react";
import { isUsageCounts, type UsageCounts } from "@/lib/usage";

const numberFormat = new Intl.NumberFormat("en-US");

export function UsageBanner() {
  const [counts, setCounts] = useState<UsageCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let pending = false;

    async function refresh() {
      if (pending || controller.signal.aborted) return;
      pending = true;
      try {
        const response = await fetch("/api/usage", {
          cache: "no-store",
          credentials: "omit",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(8000),
          ]),
        });
        if (!response.ok) throw new Error("Counter unavailable");
        const data = await response.json();
        if (!isUsageCounts(data?.counts)) throw new Error("Invalid totals");
        if (!controller.signal.aborted) {
          setCounts(data.counts);
          setUnavailable(false);
        }
      } catch {
        if (!controller.signal.aborted) setUnavailable(true);
      } finally {
        pending = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void refresh();
    window.addEventListener("focus", refresh);
    return () => {
      controller.abort();
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const metrics = [
    { label: "CS calculations", value: counts?.cs },
    { label: "SE calculations", value: counts?.se },
    {
      label: "Total calculations",
      value: counts ? counts.cs + counts.se : undefined,
    },
  ];

  return (
    <section
      aria-labelledby="usage-heading"
      aria-busy={loading}
      className="my-10 border-y border-border bg-[#eef1e8] px-6 py-7 sm:my-14 sm:px-8"
    >
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
        <h2 id="usage-heading" className="text-sm font-medium">
          Calculations so far
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Counting since <time dateTime="2026-10-19">19 October 2026</time>
        </p>
      </div>
      <dl className="grid gap-4 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[#d5ddcf]">
        {metrics.map(({ label, value }, index) => (
          <div
            key={label}
            className={`flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#d5ddcf] pb-4 last:border-b-0 last:pb-0 md:block md:border-b-0 md:pb-0 ${index === 0 ? "md:pr-6" : "md:pl-6 md:not-last:pr-6"}`}
          >
            <dt className="text-xs leading-5 text-muted-foreground">{label}</dt>
            <dd className="max-w-full font-display text-2xl font-bold tabular-nums tracking-[-0.03em] text-primary [overflow-wrap:anywhere] sm:text-3xl md:mt-2 md:text-4xl">
              {value === undefined
                ? loading
                  ? "…"
                  : "—"
                : numberFormat.format(value)}
            </dd>
          </div>
        ))}
      </dl>
      <p
        role="status"
        className="mt-6 text-[11px] leading-5 text-muted-foreground"
      >
        {unavailable
          ? counts
            ? "Showing the last available totals. Live totals are temporarily unavailable."
            : "Calculation totals are temporarily unavailable."
          : "One count per completed calculator visit. Your marks stay in your browser."}
      </p>
    </section>
  );
}
