import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { calculatorThemes } from "../theme";
import type { CourseConfig, CourseModule, LevelId, ModuleType } from "../types";
import { MarkInput } from "./mark-input";

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
          className="text-[12px] font-medium leading-[1.45] [overflow-wrap:anywhere] sm:text-[13px]"
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
          <span className="whitespace-nowrap">{module.credits} credits</span>
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
        <>
          <Label htmlFor={inputId} className="sr-only">
            {module.name} mark (%)
          </Label>
          <MarkInput
            id={inputId}
            mark={mark}
            onMarkChange={onMarkChange}
          />
        </>
      )}
    </div>
  );
}
