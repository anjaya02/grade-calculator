"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MAX_MARK_LENGTH, type Mark } from "@/lib/marks";
import { normalizeMarkInput, parseMarkInput } from "../mark-validation";

type MarkInputProps = {
  id: string;
  mark?: Mark;
  onMarkChange: (value: string) => void;
  descriptionId?: string;
};

export function MarkInput({ id, mark, onMarkChange, descriptionId }: MarkInputProps) {
  // Keep the typed text so decimal points and trailing zeroes survive updates.
  const [input, setInput] = useState({
    mark, value: String(mark ?? ""), invalid: false,
  });
  const value = input.mark === mark ? input.value : String(mark ?? "");
  const invalid = input.mark === mark && input.invalid;

  return (
    <div className="w-[5.5rem] shrink-0">
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder="—"
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={[descriptionId, invalid ? `${id}-error` : null].filter(Boolean).join(" ") || undefined}
          title={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            const parsed = parseMarkInput(nextValue);
            const normalizedValue = parsed === undefined
              ? nextValue : normalizeMarkInput(nextValue);
            setInput({
              mark: parsed ?? undefined,
              value: normalizedValue,
              invalid: parsed === undefined,
            });
            // Clear the calculation's mark on invalid text so an old accepted
            // value cannot silently produce a result for different visible text.
            onMarkChange(parsed === undefined ? "" : normalizedValue);
          }}
          onBlur={() => {
            if (!invalid) setInput({ mark, value: String(mark ?? ""), invalid: false });
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
      {invalid && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[10px] leading-4 text-destructive">
          {value.length > MAX_MARK_LENGTH ? "This mark is too long." : "Enter a mark from 0 to 100 using a decimal point."}
        </p>
      )}
    </div>
  );
}
