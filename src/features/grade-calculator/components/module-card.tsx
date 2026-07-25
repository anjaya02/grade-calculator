import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatorThemes } from "../theme";
import type {
  CourseConfig,
  CourseModule,
  LevelId,
  ModuleType,
} from "../types";

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
  const selectedClass = isCore
    ? calculatorThemes[theme].coreModule
    : isOtherModule
      ? "ring-2 ring-amber-500"
      : calculatorThemes[theme].optionalModule;

  return (
    <Card
      className={`transition-all hover:border-indigo-200 hover:shadow-md ${
        selected ? selectedClass : ""
      } ${disabled ? "opacity-50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {!isCore && (
            <Checkbox
              checked={selected}
              disabled={disabled}
              onCheckedChange={(checked) =>
                onOptionalToggle(checked === true)
              }
              className="mt-1"
            />
          )}
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h4 className="flex items-center gap-2 font-medium">
                  {module.name}
                  {isOtherModule && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      Other
                    </span>
                  )}
                </h4>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {isOtherModule ? "User Added" : module.id} • {module.credits}{" "}
                  credits
                </p>
              </div>
              {isOtherModule && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="-mt-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                  aria-label={`Remove ${module.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {(isCore || selected) && (
              <div className="mt-3">
                <Label
                  htmlFor={`mark-${level}-${module.id}`}
                  className="text-sm"
                >
                  Mark (%)
                </Label>
                <Input
                  id={`mark-${level}-${module.id}`}
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0–100"
                  value={mark ?? ""}
                  onChange={(event) => onMarkChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowUp" ||
                      event.key === "ArrowDown"
                    ) {
                      event.preventDefault();
                    }
                  }}
                  onWheel={(event) => event.currentTarget.blur()}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
