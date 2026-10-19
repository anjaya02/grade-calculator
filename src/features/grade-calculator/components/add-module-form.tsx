import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        className="h-10 w-full justify-start border-dashed bg-transparent text-xs text-muted-foreground shadow-none hover:text-primary"
        onClick={() => onVisibleChange(true)}
      >
        <Plus className="size-3.5" aria-hidden="true" /> Add other module
      </Button>
    );
  }
  return (
    <div className="rounded-lg border border-dashed border-[#b4c4ad] bg-background p-3">
      <Label htmlFor={`new-module-${level}`} className="text-xs">
        Module name
      </Label>
      <Input
        id={`new-module-${level}`}
        placeholder="Enter the module name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onAdd();
        }}
        className="mt-2 h-11 bg-white text-base shadow-none md:text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={onAdd}
          disabled={!name.trim()}
          className="h-10 text-xs shadow-none"
        >
          <Plus className="size-3" aria-hidden="true" />
          Add module
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVisibleChange(false)}
          className="h-10 text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
