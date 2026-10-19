import type { UsageCourse } from "@/lib/usage";

export type LevelId = "l5" | "l6";

export type ModuleType = "core" | "optional";

export type CourseModule = {
  id: string;
  name: string;
  credits: number;
  mandatory?: boolean;
};

export type OtherModule = CourseModule & {
  isOther: true;
};

export type LevelModules = {
  core: readonly CourseModule[];
  optional: readonly CourseModule[];
};

export type CourseConfig = {
  id: UsageCourse;
  name: string;
  icon: "book" | "code";
  theme: "indigo" | "purple";
  optionalModulesPerLevel: number;
  modules: Record<LevelId, LevelModules>;
};

export type Marks = Record<string, number>;

export type LevelState = {
  coreMarks: Marks;
  optionalMarks: Marks;
  selectedOptionals: Set<string>;
  otherModules: OtherModule[];
  showAddForm: boolean;
  newModuleName: string;
};
