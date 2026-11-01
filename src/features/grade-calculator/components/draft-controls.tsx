"use client";

import { Check, HardDrive, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  DraftStorageStatus,
  GradeCalculatorController,
} from "../hooks/use-grade-calculator";

const storageMessages: Record<DraftStorageStatus, string> = {
  loading: "Restoring saved marks…",
  ready: "Your marks save automatically on this browser.",
  saved: "Saved on this browser.",
  invalid: "Saved marks were outdated or invalid. Start a new calculation.",
  unavailable: "Autosave unavailable. Keep this page open to retain your marks.",
  "reset-error": "Marks cleared here. Saved marks could not be removed.",
};

type DraftControlsProps = {
  controller: GradeCalculatorController;
};

export function DraftControls({ controller }: DraftControlsProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const resetButton = useRef<HTMLButtonElement>(null);
  const { storageStatus, canReset, isReady } = controller;
  const StatusIcon = storageStatus === "saved" ? Check : HardDrive;

  function keepMarks() {
    setConfirmReset(false);
    resetButton.current?.focus();
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <div className="flex items-center justify-between gap-4">
        <p
          role="status"
          className="flex min-w-0 items-start gap-2 text-[11px] leading-5 text-muted-foreground"
        >
          <StatusIcon className="mt-1 size-3 shrink-0" aria-hidden="true" />
          <span>{storageMessages[storageStatus]}</span>
        </p>
        <Button
          ref={resetButton}
          type="button"
          variant="outline"
          size="sm"
          disabled={!isReady || !canReset}
          aria-expanded={confirmReset}
          aria-controls="reset-calculator-confirmation"
          onClick={() => setConfirmReset((value) => !value)}
          className="h-10 bg-transparent text-xs text-muted-foreground shadow-none hover:text-primary"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>
      {confirmReset && (
        <div
          id="reset-calculator-confirmation"
          role="group"
          aria-labelledby="reset-calculator-heading"
          className="mt-4 rounded-lg border border-[#c7d3c3] bg-secondary p-4"
          onKeyDown={(event) => {
            if (event.key === "Escape") keepMarks();
          }}
        >
          <p id="reset-calculator-heading" className="text-xs font-medium">
            Reset this calculation?
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            This clears all marks, optional selections, and custom modules for
            this course, including the saved copy on this browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="h-10 text-xs shadow-none"
              onClick={() => {
                controller.reset();
                setConfirmReset(false);
              }}
            >
              Reset marks
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              autoFocus
              onClick={keepMarks}
              className="h-10 text-xs"
            >
              Keep marks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
