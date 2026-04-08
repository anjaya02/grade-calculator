"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Code,
  Calculator,
  Info,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import Footer from "@/components/Footer";

/* ------------------------------------------------------------------ */
/*                            MODULE DATA                             */
/* ------------------------------------------------------------------ */

const seModules = {
  l5: {
    core: [
      {
        id: "5COSC021C",
        name: "Software Development Group Project (SDGP)",
        credits: 20,
        mandatory: true,
      },
      {
        id: "5COSC019C",
        name: "Object Oriented Programming",
        credits: 20,
        mandatory: true,
      },
      {
        id: "5SENG003C",
        name: "Algorithms: Theory, Design and Implementation",
        credits: 20,
        mandatory: true,
      },
      {
        id: "5COSC020C",
        name: "Database Systems",
        credits: 20,
        mandatory: true,
      },
      {
        id: "5SENG007C",
        name: "Software Engineering Principles and Practice",
        credits: 20,
        mandatory: true,
      },
    ],
    optional: [
      { id: "5ELEN018C", name: "Robotic Principles", credits: 20 },
      { id: "5COSC023C", name: "Mobile Application Development", credits: 20 },
      { id: "5ELEN016C", name: "Operating Systems", credits: 20 },
      { id: "5COSC024C", name: "Server-side Web Development", credits: 20 },
      {
        id: "5DATA001C",
        name: "Machine Learning and Data Mining",
        credits: 20,
      },
    ],
  },
  l6: {
    core: [
      {
        id: "6COSC023C.Y",
        name: "Final Year Project (FYP)",
        credits: 40,
        mandatory: true,
      },
      {
        id: "6COSC019C.2",
        name: "Cyber Security",
        credits: 20,
        mandatory: true,
      },
      {
        id: "6SENG005C.1",
        name: "Formal Methods",
        credits: 20,
        mandatory: true,
      },
      {
        id: "6SENG006C.1",
        name: "Concurrent Programming",
        credits: 20,
        mandatory: true,
      },
    ],
    optional: [
      {
        id: "6COSC022C.2",
        name: "Advanced Server-Side Web Programming",
        credits: 20,
      },
      {
        id: "6COSC021C.1",
        name: "Mobile Native Application Development",
        credits: 20,
      },
      {
        id: "6DATA005C.2",
        name: "Operational Research and Optimization",
        credits: 20,
      },
      { id: "6ELEN018C.1", name: "Applied Robotics", credits: 20 },
      { id: "6NTCM009W.2", name: "Internet of Things", credits: 20 },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*                         HELPER  CONSTANTS                          */
/* ------------------------------------------------------------------ */

const SDGP_ID = "5COSC021C";
const FYP_ID = "6COSC023C.Y";

type OtherModule = {
  id: string;
  name: string;
  credits: number;
  isOther: true;
};

/* ------------------------------------------------------------------ */
/*                            COMPONENT                               */
/* ------------------------------------------------------------------ */

export default function SECalculatorPage() {
  /* ------------- state ------------- */
  const [l5CoreMarks, setL5CoreMarks] = useState<Record<string, number>>({});
  const [l5SelectedOptional, setL5SelectedOptional] = useState<Set<string>>(
    new Set(),
  );
  const [l5OptionalMarks, setL5OptionalMarks] = useState<
    Record<string, number>
  >({});
  const [l6CoreMarks, setL6CoreMarks] = useState<Record<string, number>>({});
  const [l6SelectedOptional, setL6SelectedOptional] = useState<Set<string>>(
    new Set(),
  );
  const [l6OptionalMarks, setL6OptionalMarks] = useState<
    Record<string, number>
  >({});

  /* ------------- other modules state ------------- */
  const [l5OtherModules, setL5OtherModules] = useState<OtherModule[]>([]);
  const [l6OtherModules, setL6OtherModules] = useState<OtherModule[]>([]);
  const [showL5AddForm, setShowL5AddForm] = useState(false);
  const [showL6AddForm, setShowL6AddForm] = useState(false);
  const [l5NewModuleName, setL5NewModuleName] = useState("");
  const [l6NewModuleName, setL6NewModuleName] = useState("");

  /* ------------- add other module ------------- */
  const handleAddOtherModule = (level: "l5" | "l6") => {
    const moduleName = level === "l5" ? l5NewModuleName : l6NewModuleName;
    if (!moduleName.trim()) return;

    const newModule: OtherModule = {
      id: `OTHER-${level.toUpperCase()}-${Date.now()}`,
      name: moduleName.trim(),
      credits: 20,
      isOther: true,
    };

    if (level === "l5") {
      setL5OtherModules((prev) => [...prev, newModule]);
      setShowL5AddForm(false);
      setL5NewModuleName("");
    } else {
      setL6OtherModules((prev) => [...prev, newModule]);
      setShowL6AddForm(false);
      setL6NewModuleName("");
    }
  };

  /* ------------- remove other module ------------- */
  const handleRemoveOtherModule = (level: "l5" | "l6", moduleId: string) => {
    if (level === "l5") {
      setL5OtherModules((prev) => prev.filter((m) => m.id !== moduleId));
      setL5SelectedOptional((prev) => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
      setL5OptionalMarks((prev) => {
        const copy = { ...prev };
        delete copy[moduleId];
        return copy;
      });
    } else {
      setL6OtherModules((prev) => prev.filter((m) => m.id !== moduleId));
      setL6SelectedOptional((prev) => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
      setL6OptionalMarks((prev) => {
        const copy = { ...prev };
        delete copy[moduleId];
        return copy;
      });
    }
  };

  /* ------------- check if other modules are used ------------- */
  const hasOtherModulesSelected = () => {
    const l5OtherIds = new Set(l5OtherModules.map((m) => m.id));
    const l6OtherIds = new Set(l6OtherModules.map((m) => m.id));
    return (
      [...l5SelectedOptional].some((id) => l5OtherIds.has(id)) ||
      [...l6SelectedOptional].some((id) => l6OtherIds.has(id))
    );
  };

  /* ------------- toggle optional ------------- */
  const handleOptionalToggle = (
    level: "l5" | "l6",
    moduleId: string,
    checked: boolean,
  ) => {
    const selectedSet =
      level === "l5" ? l5SelectedOptional : l6SelectedOptional;
    const setSelected =
      level === "l5" ? setL5SelectedOptional : setL6SelectedOptional;
    const setMarks = level === "l5" ? setL5OptionalMarks : setL6OptionalMarks;
    const marks = level === "l5" ? l5OptionalMarks : l6OptionalMarks;

    const newSelected = new Set(selectedSet);
    if (checked) {
      if (newSelected.size >= 1) return; // only one optional per level
      newSelected.add(moduleId);
    } else {
      newSelected.delete(moduleId);
      const clone = { ...marks };
      delete clone[moduleId]; // wipe stale mark
      setMarks(clone);
    }
    setSelected(newSelected);
  };

  /* ------------- capture mark inputs ------------- */
  const handleMarkChange = (
    level: "l5" | "l6",
    type: "core" | "optional",
    moduleId: string,
    mark: string,
  ) => {
    const num = parseFloat(mark);
    const setter =
      level === "l5"
        ? type === "core"
          ? setL5CoreMarks
          : setL5OptionalMarks
        : type === "core"
          ? setL6CoreMarks
          : setL6OptionalMarks;

    if (!isNaN(num) && num >= 0 && num <= 100) {
      setter((prev) => ({ ...prev, [moduleId]: num }));
    } else if (mark === "") {
      setter((prev) => {
        const copy = { ...prev };
        delete copy[moduleId];
        return copy;
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*                    MAIN CALCULATION  LOGIC                         */
  /* ------------------------------------------------------------------ */

  /** returns TRUE only when every mandatory mark is filled **/
  const allMarksEntered = () => {
    const l5CoreComplete = seModules.l5.core.every(
      (m) => l5CoreMarks[m.id] !== undefined,
    );
    const l6CoreComplete = seModules.l6.core.every(
      (m) => l6CoreMarks[m.id] !== undefined,
    );

    const l5OptComplete =
      l5SelectedOptional.size === 1 &&
      [...l5SelectedOptional].every((id) => l5OptionalMarks[id] !== undefined);

    const l6OptComplete =
      l6SelectedOptional.size === 1 &&
      [...l6SelectedOptional].every((id) => l6OptionalMarks[id] !== undefined);

    return l5CoreComplete && l6CoreComplete && l5OptComplete && l6OptComplete;
  };

  /** builds a flat list of the student’s 12 assessed modules (11 if one is dropped) */
  const buildModuleList = () => {
    // helper to attach mark and level
    const attach = (
      arr: Array<{
        id: string;
        name: string;
        credits: number;
        mandatory?: boolean;
        isOther?: boolean;
      }>,
      level: "l5" | "l6",
      type: "core" | "optional",
    ) =>
      arr.map((m) => ({
        ...m,
        level,
        type,
        mark:
          level === "l5"
            ? type === "core"
              ? l5CoreMarks[m.id]
              : l5OptionalMarks[m.id]
            : type === "core"
              ? l6CoreMarks[m.id]
              : l6OptionalMarks[m.id],
      }));

    const list: {
      id: string;
      name: string;
      credits: number;
      mark: number;
      level: "l5" | "l6";
      type: "core" | "optional";
    }[] = [];

    list.push(...attach([...seModules.l5.core], "l5", "core"));
    list.push(...attach([...seModules.l6.core], "l6", "core"));

    l5SelectedOptional.forEach((id) => {
      const mod = seModules.l5.optional.find((m) => m.id === id);
      if (mod) {
        list.push(...attach([mod], "l5", "optional"));
      } else {
        // Check if it is an other module
        const otherMod = l5OtherModules.find((m) => m.id === id);
        if (otherMod) list.push(...attach([otherMod], "l5", "optional"));
      }
    });
    l6SelectedOptional.forEach((id) => {
      const mod = seModules.l6.optional.find((m) => m.id === id);
      if (mod) {
        list.push(...attach([mod], "l6", "optional"));
      } else {
        // Check if it is an other module
        const otherMod = l6OtherModules.find((m) => m.id === id);
        if (otherMod) list.push(...attach([otherMod], "l6", "optional"));
      }
    });

    return list;
  };

  /** core routine — returns stats & dropped module or null */
  const calculateResults = () => {
    if (!allMarksEntered()) {
      return null; // incomplete
    }

    const modules = buildModuleList();

    // 1. Find lowest eligible 20-credit module (not FYP, not SDGP)
    const eligible = modules.filter(
      (m) => m.credits === 20 && m.id !== SDGP_ID && m.id !== FYP_ID,
    );
    const lowest = eligible.sort((a, b) => a.mark - b.mark)[0] ?? null;

    // 2. Decide whether to drop
    const dropped = lowest ?? null; // null if none eligible
    const keptMods = dropped
      ? modules.filter((m) => m.id !== dropped.id)
      : modules;

    // 3. Separate by level and aggregate
    const sum = (arr: typeof keptMods, key: keyof (typeof keptMods)[number]) =>
      arr.reduce((s, m) => s + (m[key] as number), 0);

    const l5Mods = keptMods.filter((m) => m.level === "l5");
    const l6Mods = keptMods.filter((m) => m.level === "l6");

    const l5Credits = sum(l5Mods, "credits");
    const l6Credits = sum(l6Mods, "credits");
    const l5WeightedMarks = l5Mods.reduce((s, m) => s + m.mark * m.credits, 0);
    const l6WeightedMarks = l6Mods.reduce((s, m) => s + m.mark * m.credits, 0);

    const l5Average = l5WeightedMarks / l5Credits;
    const l6Average = l6WeightedMarks / l6Credits;
    const finalAverage = l5Average / 3 + (2 * l6Average) / 3;

    return {
      l5Average,
      l6Average,
      finalAverage,
      l5Credits,
      l6Credits,
      totalCredits: l5Credits + l6Credits,
      droppedModule: dropped, // may be null
    };
  };

  const results = calculateResults();
  const showResults = results !== null;

  /** UI helper for class band */
  const classify = (avg: number) => {
    if (avg >= 70)
      return {
        label: "First Class",
        bg: "bg-green-100",
        color: "text-green-800",
      };
    if (avg >= 60)
      return {
        label: "Second Upper",
        bg: "bg-blue-100",
        color: "text-blue-800",
      };
    if (avg >= 50)
      return {
        label: "Second Lower",
        bg: "bg-orange-100",
        color: "text-orange-800",
      };
    if (avg >= 40)
      return { label: "Pass", bg: "bg-purple-100", color: "text-purple-800" };
    return { label: "Fail", bg: "bg-red-100", color: "text-red-800" };
  };

  /* ------------------------------------------------------------------ */
  /*                         RENDER HELPERS                             */
  /* ------------------------------------------------------------------ */
  type Module = {
    id: string;
    name: string;
    credits: number;
    mandatory?: boolean;
    isOther?: boolean;
  };

  const renderModuleSection = (
    title: string,
    modules: readonly Module[], // ✅ accepts core *or* optional
    level: "l5" | "l6",
    type: "core" | "optional",
  ) => {
    const selectedSet =
      level === "l5" ? l5SelectedOptional : l6SelectedOptional;
    const otherModules = level === "l5" ? l5OtherModules : l6OtherModules;
    const showAddForm = level === "l5" ? showL5AddForm : showL6AddForm;
    const setShowAddForm = level === "l5" ? setShowL5AddForm : setShowL6AddForm;

    // Combine predefined and other modules for optional sections
    const allModules: Module[] =
      type === "optional" ? [...modules, ...otherModules] : [...modules];

    return (
      <Card
        key={title}
        className="border border-indigo-50/50 shadow-xl shadow-indigo-100/40 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:shadow-indigo-200/40"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" /> {title}
            {type === "core" ? (
              <span className="text-sm text-red-600">(Required)</span>
            ) : (
              <span className="text-sm text-purple-600">(Choose 1)</span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {allModules.map((mod) => {
            const isCore = type === "core";
            const isSelected = isCore || selectedSet.has(mod.id);
            const disableCheck =
              !isCore && !isSelected && selectedSet.size >= 1;
            const isOtherModule = "isOther" in mod && mod.isOther;

            const marksObj = isCore
              ? level === "l5"
                ? l5CoreMarks
                : l6CoreMarks
              : level === "l5"
                ? l5OptionalMarks
                : l6OptionalMarks;

            return (
              <Card
                key={mod.id}
                className={`transition-all hover:shadow-md hover:border-indigo-200
    ${
      isSelected
        ? isCore
          ? "border-purple-200 bg-purple-50/30"
          : isOtherModule
            ? "ring-2 ring-amber-500"
            : "ring-2 ring-purple-500"
        : ""
    }

    ${disableCheck ? "opacity-50" : ""}          
  `}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {!isCore && (
                      <Checkbox
                        checked={isSelected}
                        disabled={disableCheck}
                        onCheckedChange={(chk) =>
                          handleOptionalToggle(level, mod.id, chk as boolean)
                        }
                        className="mt-1"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {mod.name}
                            {isOtherModule && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                Other
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {isOtherModule ? "User Added" : mod.id} •{" "}
                            {mod.credits} credits
                          </p>
                        </div>
                        {isOtherModule && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveOtherModule(level, mod.id)
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {(isCore || isSelected) && (
                        <div className="mt-3">
                          <Label htmlFor={`mark-${mod.id}`} className="text-sm">
                            Mark (%)
                          </Label>
                          <Input
                            id={`mark-${mod.id}`}
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0–100"
                            value={marksObj[mod.id] ?? ""}
                            onChange={(e) =>
                              handleMarkChange(
                                level,
                                type,
                                mod.id,
                                e.target.value,
                              )
                            }
                            /* stop the hidden spinner shortcuts that cause 79 → 78, etc. */
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault(); // blocks ±1 auto-step from num-pad arrows
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()} // blocks mouse-wheel grade changes
                            /* ▲ NEW */

                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add Other Module section - only for optional modules */}
          {type === "optional" && (
            <div className="mt-4">
              {showAddForm ? (
                <Card className="border-dashed border-2 border-amber-300 bg-amber-50/30">
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
                        value={
                          level === "l5" ? l5NewModuleName : l6NewModuleName
                        }
                        onChange={(e) =>
                          level === "l5"
                            ? setL5NewModuleName(e.target.value)
                            : setL6NewModuleName(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddOtherModule(level);
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddOtherModule(level)}
                          disabled={
                            !(
                              level === "l5" ? l5NewModuleName : l6NewModuleName
                            ).trim()
                          }
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowAddForm(false);
                            if (level === "l5") {
                              setL5NewModuleName("");
                            } else {
                              setL6NewModuleName("");
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 hover:border-amber-400 hover:bg-amber-50"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Other Module
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  /* ------------------------------------------------------------------ */
  /*                           JSX RETURN                               */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-sky-50 overflow-hidden relative flex flex-col">
      {/* Abstract Background Shapes */}
      <div className="pointer-events-none absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="pointer-events-none absolute top-0 -right-4 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      {/* -------- Header -------- */}
      <header className="relative z-40 bg-white/70 backdrop-blur-xl shadow-sm border-b border-indigo-100/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-purple-200">
            <Code className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
              Software Engineering Calculator
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              L5/L6 Weighted Classification
            </p>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Body */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Level 5 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
              Level 5 Modules
            </h2>
            {renderModuleSection(
              "L5 Core Modules",
              seModules.l5.core,
              "l5",
              "core",
            )}
            {renderModuleSection(
              "L5 Optional Modules",
              seModules.l5.optional,
              "l5",
              "optional",
            )}
          </section>

          {/* Level 6 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
              Level 6 Modules
            </h2>
            {renderModuleSection(
              "L6 Core Modules",
              seModules.l6.core,
              "l6",
              "core",
            )}
            {renderModuleSection(
              "L6 Optional Modules",
              seModules.l6.optional,
              "l6",
              "optional",
            )}
          </section>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Results */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-6">
          <Card className="sticky top-28 border border-indigo-50/50 shadow-2xl shadow-indigo-100/40 bg-white/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Classification Results
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {showResults && results ? (
                <div
                  className={`p-4 rounded-lg ${
                    classify(results.finalAverage).bg
                  } border-2`}
                >
                  {/* main number and band */}
                  <div className="text-center">
                    <div className="text-5xl font-black text-gray-900 mb-3 tracking-tight tabular-nums font-[family-name:var(--font-geist-mono)] drop-shadow-sm">
                      {results.finalAverage.toFixed(1)}%
                    </div>
                    <div
                      className={`text-lg font-bold px-4 py-2 rounded-full ${
                        classify(results.finalAverage).color
                      }`}
                    >
                      {classify(results.finalAverage).label}
                    </div>
                  </div>

                  {/* details */}
                  <div className="space-y-2 text-sm mt-4">
                    <div className="flex justify-between">
                      <span>L5 Average:</span>
                      <span className="font-medium">
                        {results.l5Average.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>L6 Average:</span>
                      <span className="font-medium">
                        {results.l6Average.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>L5 Credits:</span>
                      <span>{results.l5Credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>L6 Credits:</span>
                      <span>{results.l6Credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Credits:</span>
                      <span>{results.totalCredits}</span>
                    </div>
                    {results.droppedModule && (
                      <div className="flex justify-between">
                        <span>Dropped Module:</span>
                        <span className="font-medium">
                          {results.droppedModule.name} (
                          {results.droppedModule.mark}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Select one optional per level <em>and</em> enter marks for
                    every module to see your classification.
                  </p>
                </div>
              )}

              {/* Other Module Note */}
              {hasOtherModulesSelected() && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-800">
                    <strong>📝 Note:</strong> You&apos;ve added an other
                    optional module. Ensure it&apos;s a valid replacement
                    approved by your department.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Calculation Method box */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-12 max-w-4xl mx-auto">
        <Card className="border border-indigo-50/50 shadow-xl shadow-indigo-100/40 bg-white/60 backdrop-blur-xl relative overflow-hidden group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-6 w-6" />
              Calculation Method
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-5">
            <div className="bg-blue-50 p-4 rounded-md sm:p-5">
              <p className="font-bold text-blue-900 mb-2 text-base sm:text-lg">
                Final Grade Formula:
              </p>
              <p className="text-blue-800 font-mono text-base sm:text-lg leading-relaxed break-words">
                Final = (⅓ × L5 Average) + (⅔ × L6 Average)
              </p>
            </div>

            <ul className="space-y-2.5 text-sm sm:text-base leading-relaxed break-words">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  The single lowest-scoring <strong>20-credit</strong> module
                  across both levels may be dropped <em>unless</em> it is SDGP
                  or FYP.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-red-500 rounded-full flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  SDGP and FYP are mandatory and <strong>cannot</strong> be
                  dropped.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  One optional module per level is required.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  If a drop occurs, total credits become 220 (100 from one level
                  and 120 from the other).
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* -------- Disclaimer -------- */}
      <div className="mt-8 mb-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/50 rounded-2xl p-6 shadow-xl shadow-amber-200/40 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/10 rounded-full -ml-12 -mb-12" />
          <div className="relative flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 mb-1.5 text-base">
                Important Notice
              </h4>
              <p className="text-sm leading-relaxed font-medium text-amber-800">
                <strong>Disclaimer:</strong> This tool is not officially
                affiliated with IIT. Results shown are approximate and for
                guidance purposes only. Please consult your academic advisor for
                final grades.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}
