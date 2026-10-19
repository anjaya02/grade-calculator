"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
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
    { label: "CS calculations", value: counts?.cs, color: "text-indigo-600" },
    { label: "SE calculations", value: counts?.se, color: "text-sky-600" },
    {
      label: "Total calculations",
      value: counts ? counts.cs + counts.se : undefined,
      color: "text-purple-600",
    },
  ];

  return (
    <section
      aria-labelledby="usage-heading"
      aria-busy={loading}
      className="mx-auto mb-24 max-w-4xl rounded-3xl border border-indigo-100 bg-white/70 p-6 shadow-xl shadow-indigo-100/30 backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6 flex items-center justify-center gap-2 text-gray-900">
        <BarChart3 className="h-5 w-5 text-indigo-500" aria-hidden="true" />
        <h3 id="usage-heading" className="text-xl font-bold">
          Calculations so far
        </h3>
      </div>
      <dl className="grid grid-cols-2 gap-6 text-center sm:grid-cols-3">
        {metrics.map(({ label, value, color }, index) => (
          <div
            key={label}
            className={index === 2 ? "col-span-2 sm:col-span-1" : ""}
          >
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className={`mt-2 text-3xl font-extrabold tabular-nums ${color}`}>
              {value === undefined
                ? loading
                  ? "…"
                  : "—"
                : numberFormat.format(value)}
            </dd>
          </div>
        ))}
      </dl>
      <p role="status" className="mt-6 text-center text-xs text-gray-500">
        {unavailable
          ? counts
            ? "Showing the last available totals. Live totals are temporarily unavailable."
            : "Calculation totals are temporarily unavailable."
          : "One count per completed calculator visit. Your marks stay in your browser."}
      </p>
    </section>
  );
}
