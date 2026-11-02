"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MARK_INPUT_ERROR, parseMarkInput } from "../mark-validation";

type MarkInputProps = {
  id: string;
  mark?: number;
  onMarkChange: (value: string) => void;
};

export function MarkInput({ id, mark, onMarkChange }: MarkInputProps) {
  // Keep the typed text so decimal points and trailing zeroes survive updates.
  const [input, setInput] = useState({ mark, value: String(mark ?? "") });
  const [error, setError] = useState(false);
  const value = input.mark === mark ? input.value : String(mark ?? "");

  return (
    <>
      <div className="relative w-[5.5rem] shrink-0">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder="—"
          value={value}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            const nextValue = event.target.value;
            const parsed = parseMarkInput(nextValue);
            if (parsed === undefined) {
              setError(true);
              return;
            }
            setError(false);
            setInput({ mark: parsed ?? undefined, value: nextValue });
            onMarkChange(nextValue);
          }}
          onBlur={() => {
            setInput({ mark, value: String(mark ?? "") });
            setError(false);
          }}
          className="h-11 rounded-md border-input bg-white pl-2 pr-5 text-right text-base font-medium tabular-nums shadow-none focus-visible:ring-2 md:text-sm"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground"
        >
          %
        </span>
      </div>
      {error && (
        <p id={`${id}-error`} role="status" className="w-full text-xs text-destructive">
          {MARK_INPUT_ERROR}
        </p>
      )}
    </>
  );
}
