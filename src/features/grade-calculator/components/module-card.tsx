import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatorThemes } from "../theme";
import type { CourseConfig, CourseModule, LevelId, ModuleType } from "../types";

type ModuleCardProps = {
  module: CourseModule;
  level: LevelId;
  moduleType: ModuleType;
  theme: CourseConfig["theme"];
  optionalLimitReached: boolean;
  selected: boolean;
  mark?: number;
  onMarkChange: (value: string) => void;
  onOptionalToggle: (checked: boolean) => void;
  onRemove: () => void;
};

export function ModuleCard({
  module,
  level,
  moduleType,
  theme,
  optionalLimitReached,
  selected,
  mark,
  onMarkChange,
  onOptionalToggle,
  onRemove,
}: ModuleCardProps) {
  const isCore = moduleType === "core";
  const isOtherModule = "isOther" in module && module.isOther === true;
  const disabled = !isCore && !selected && optionalLimitReached;
  const titleId = `module-${level}-${module.id}`;
  const checkboxId = `optional-${level}-${module.id}`;
  const inputId = `mark-${level}-${module.id}`;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors ${!isCore && selected ? calculatorThemes[theme].optionalModule : "border-transparent"} ${disabled ? "text-muted-foreground" : ""}`}
    >
      {!isCore && (
        <Checkbox
          id={checkboxId}
          checked={selected}
          disabled={disabled}
          aria-labelledby={titleId}
          onCheckedChange={(checked) => onOptionalToggle(checked === true)}
          className="size-[17px] shrink-0 rounded-[5px]"
        />
      )}
      <div className="min-w-0 flex-1">
        <h4
          id={titleId}
          className="break-words text-[12px] font-medium leading-[1.45] sm:text-[13px]"
        >
          {isCore ? (
            module.name
          ) : (
            <label
              htmlFor={checkboxId}
              className={disabled ? "cursor-default" : "cursor-pointer"}
            >
              {module.name}
            </label>
          )}
        </h4>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 font-mono text-[9px] leading-4 tracking-[-0.015em] text-muted-foreground">
          <span>{isOtherModule ? "CUSTOM" : module.id}</span>
          <span aria-hidden="true">·</span>
          <span>{module.credits} credits</span>
          {isOtherModule && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="size-6 text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${module.name}`}
            >
              <X className="size-3" aria-hidden="true" />
            </Button>
          )}
        </p>
      </div>
      {(isCore || selected) && (
        <div className="relative w-[68px] shrink-0">
          <Label htmlFor={inputId} className="sr-only">
            {module.name} mark (%)
          </Label>
          <Input
            id={inputId}
            type="number"
            inputMode="decimal"
            step="any"
            min={0}
            max={100}
            placeholder="—"
            value={mark ?? ""}
            onChange={(event) => onMarkChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown")
                event.preventDefault();
            }}
            onWheel={(event) => event.currentTarget.blur()}
            className="h-11 rounded-md border-input bg-white pl-2 pr-5 text-right text-base font-medium tabular-nums shadow-none focus-visible:ring-2 md:text-sm"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground"
          >
            %
          </span>
        </div>
      )}
    </div>
  );
}
