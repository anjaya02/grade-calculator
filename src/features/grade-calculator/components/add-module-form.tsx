import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LevelId } from "../types";

type AddModuleFormProps = {
  level: LevelId;
  name: string;
  visible: boolean;
  onNameChange: (name: string) => void;
  onAdd: () => void;
  onVisibleChange: (visible: boolean) => void;
};

export function AddModuleForm({
  level,
  name,
  visible,
  onNameChange,
  onAdd,
  onVisibleChange,
}: AddModuleFormProps) {
  if (!visible) {
    return (
      <Button
        variant="outline"
        className="w-full border-2 border-dashed hover:border-amber-400 hover:bg-amber-50"
        onClick={() => onVisibleChange(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Other Module
      </Button>
    );
  }

  return (
    <Card className="border-2 border-dashed border-amber-300 bg-amber-50/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          <Label
            htmlFor={`new-module-${level}`}
            className="text-sm font-medium"
          >
            Module Name
          </Label>
          <Input
            id={`new-module-${level}`}
            placeholder="Enter module name..."
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onAdd();
            }}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onAdd} disabled={!name.trim()}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVisibleChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
