"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, BookOpen, Calculator, Info } from "lucide-react";
import Footer from "@/components/Footer";

/* ------------------------------------------------------------------ */
/*                        MODULE   DATA                               */
/* ------------------------------------------------------------------ */

const csModules = {
  l5: {
    core: [
      {
        id: "5COSC019C",
        name: "Object Oriented Programming",
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
        id: "5COSC022C",
        name: "Client-Server Architectures",
        credits: 20,
        mandatory: true,
      },
      {
        id: "5COSC021C",
        name: "Software Development Group Project (SDGP)",
        credits: 20,
        mandatory: true,
      },
    ],
    optional: [
      {
        id: "5COSC026C",
        name: "Advanced Client-side Development",
        credits: 20,
      },
      { id: "5COSC023C", name: "Mobile Application Development", credits: 20 },
      { id: "5COSC024C", name: "Server-side Web Development", credits: 20 },
      { id: "5COSC025C", name: "HCI & User Experience", credits: 20 },
      {
        id: "5MMCS007C",
        name: "3D Interactive Media Development",
        credits: 20,
      },
      { id: "5CCGD013C", name: "XR & Multimodal Interaction", credits: 20 },
      { id: "5BUIS020C", name: "Information Technology Security", credits: 20 },
      {
        id: "5SENG003C",
        name: "Algorithms: Theory, Design and Implementation",
        credits: 20,
      },
      {
        id: "5DATA001C",
        name: "Machine Learning and Data Mining",
        credits: 20,
      },
      { id: "5CCGD011C", name: "Game Engine Architecture", credits: 20 },
      { id: "5CCGD010C", name: "Maths and Physics for Games", credits: 20 },
      { id: "5ELEN018C", name: "Robotic Principles", credits: 20 },
      { id: "5ELEN018C-2", name: "Sensors & Signals", credits: 20 },
    ],
  },
  l6: {
    core: [
      {
        id: "6COSC023C",
        name: "Final Year Project (FYP)",
        credits: 40,
        mandatory: true,
      },
      { id: "6COSC020C", name: "Applied AI", credits: 20, mandatory: true },
      { id: "6COSC019C", name: "Cyber Security", credits: 20, mandatory: true },
    ],
    optional: [
      {
        id: "6COSC021C",
        name: "Mobile Native Application Development",
        credits: 20,
      },
      {
        id: "6COSC022C",
        name: "Advanced Server-side Web Programming",
        credits: 20,
      },
      {
        id: "6MMCS009C",
        name: "Usability Testing and Evaluation",
        credits: 20,
      },
      {
        id: "6MMCS008C",
        name: "Advanced Interactive Media Development",
        credits: 20,
      },
      {
        id: "6MARK027C",
        name: "Digital Marketing, Social Media and Web Analytics",
        credits: 20,
      },
      {
        id: "6BUIS019C",
        name: "Strategic Management of Information Systems",
        credits: 20,
      },
      {
        id: "6BUIS018C",
        name: "Information Driven Entrepreneurship and Enterprise",
        credits: 20,
      },
      {
        id: "6DATA005C",
        name: "Operational Research and Optimisation",
        credits: 20,
      },
      { id: "6CCGD002C", name: "Game AI", credits: 20 },
      {
        id: "6MMCS006C",
        name: "Advanced Interactive Media Development",
        credits: 20,
      },
      { id: "6ELEN018C", name: "Applied Robotics", credits: 20 },
      { id: "6NTCM009W", name: "Internet of Things", credits: 20 },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*                      CONSTANTS & HELPERS                           */
/* ------------------------------------------------------------------ */

const SDGP_ID = "5COSC021C";
const FYP_ID = "6COSC023C";

/* ------------------------------------------------------------------ */
/*                          COMPONENT                                 */
/* ------------------------------------------------------------------ */

export default function CSCalculatorPage() {
  /* ---------- state ---------- */
  const [l5CoreMarks, setL5CoreMarks] = useState<Record<string, number>>({});
  const [l5SelectedOptional, setL5SelectedOptional] = useState<Set<string>>(
    new Set()
  );
  const [l5OptionalMarks, setL5OptionalMarks] = useState<
    Record<string, number>
  >({});
  const [l6CoreMarks, setL6CoreMarks] = useState<Record<string, number>>({});
  const [l6SelectedOptional, setL6SelectedOptional] = useState<Set<string>>(
    new Set()
  );
  const [l6OptionalMarks, setL6OptionalMarks] = useState<
    Record<string, number>
  >({});

  /* ---------- toggle optional (max 2) ---------- */
  const handleOptionalToggle = (
    level: "l5" | "l6",
    moduleId: string,
    checked: boolean
  ) => {
    const selectedSet =
      level === "l5" ? l5SelectedOptional : l6SelectedOptional;
    const setSelected =
      level === "l5" ? setL5SelectedOptional : setL6SelectedOptional;
    const setMarks = level === "l5" ? setL5OptionalMarks : setL6OptionalMarks;
    const marks = level === "l5" ? l5OptionalMarks : l6OptionalMarks;

    const newSet = new Set(selectedSet);
    if (checked) {
      if (newSet.size >= 2) return; // cap at 2
      newSet.add(moduleId);
    } else {
      newSet.delete(moduleId);
      const copy = { ...marks };
      delete copy[moduleId];
      setMarks(copy);
    }
    setSelected(newSet);
  };

  /* ---------- handle mark change ---------- */
  const handleMarkChange = (
    level: "l5" | "l6",
    type: "core" | "optional",
    moduleId: string,
    value: string
  ) => {
    const num = parseFloat(value);
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
    } else if (value === "") {
      setter((prev) => {
        const c = { ...prev };
        delete c[moduleId];
        return c;
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*                     VALIDATION: all marks in?                      */
  /* ------------------------------------------------------------------ */
  const allMarksEntered = () => {
    const l5CompleteCore = csModules.l5.core.every(
      (m) => l5CoreMarks[m.id] !== undefined
    );
    const l6CompleteCore = csModules.l6.core.every(
      (m) => l6CoreMarks[m.id] !== undefined
    );

    const l5CompleteOpt =
      l5SelectedOptional.size === 2 &&
      [...l5SelectedOptional].every((id) => l5OptionalMarks[id] !== undefined);

    const l6CompleteOpt =
      l6SelectedOptional.size === 2 &&
      [...l6SelectedOptional].every((id) => l6OptionalMarks[id] !== undefined);

    return l5CompleteCore && l6CompleteCore && l5CompleteOpt && l6CompleteOpt;
  };

  /* ------------------------------------------------------------------ */
  /*                 BUILD FLAT LIST OF ALL ASSESSED MODULES            */
  /* ------------------------------------------------------------------ */
  const buildModuleList = () => {
    const attach = (
      arr: any[],
      level: "l5" | "l6",
      type: "core" | "optional"
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

    list.push(...attach(csModules.l5.core, "l5", "core"));
    list.push(...attach(csModules.l6.core, "l6", "core"));

    l5SelectedOptional.forEach((id) => {
      const mod = csModules.l5.optional.find((m) => m.id === id);
      if (mod) list.push(...attach([mod], "l5", "optional"));
    });
    l6SelectedOptional.forEach((id) => {
      const mod = csModules.l6.optional.find((m) => m.id === id);
      if (mod) list.push(...attach([mod], "l6", "optional"));
    });

    return list;
  };

  /* ------------------------------------------------------------------ */
  /*                 MAIN CALCULATION (drop-lowest rule)                */
  /* ------------------------------------------------------------------ */
  const calculateResults = () => {
    if (!allMarksEntered()) return null;

    const modules = buildModuleList();

    // Find lowest eligible 20-credit module (exclude SDGP & FYP)
    const dropCandidates = modules.filter(
      (m) => m.credits === 20 && m.id !== SDGP_ID && m.id !== FYP_ID
    );
    const dropped =
      dropCandidates.length > 0
        ? dropCandidates.reduce((low, cur) => (cur.mark < low.mark ? cur : low))
        : null;

    const kept = dropped ? modules.filter((m) => m.id !== dropped.id) : modules;

    // Aggregate by level
    const sumCredits = (arr: typeof kept) =>
      arr.reduce((s, m) => s + m.credits, 0);
    const sumWeighted = (arr: typeof kept) =>
      arr.reduce((s, m) => s + m.credits * m.mark, 0);

    const l5Mods = kept.filter((m) => m.level === "l5");
    const l6Mods = kept.filter((m) => m.level === "l6");

    const l5Credits = sumCredits(l5Mods);
    const l6Credits = sumCredits(l6Mods);
    const l5Weighted = sumWeighted(l5Mods);
    const l6Weighted = sumWeighted(l6Mods);

    const l5Average = l5Weighted / l5Credits;
    const l6Average = l6Weighted / l6Credits;
    const finalAverage = l5Average / 3 + (2 * l6Average) / 3;

    return {
      l5Average,
      l6Average,
      finalAverage,
      l5Credits,
      l6Credits,
      totalCredits: l5Credits + l6Credits,
      droppedModule: dropped,
    };
  };

  const results = calculateResults();
  const showResults = results !== null;

  /* ---------- classification band ---------- */
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
  /*                       RENDER HELPERS                               */
  /* ------------------------------------------------------------------ */
  const renderModuleSection = (
    title: string,
    modules: typeof csModules.l5.core,
    level: "l5" | "l6",
    type: "core" | "optional"
  ) => {
    const selectedSet =
      level === "l5" ? l5SelectedOptional : l6SelectedOptional;

    return (
      <Card key={title}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> {title}
            {type === "core" ? (
              <span className="text-sm text-red-600">(Required)</span>
            ) : (
              <span className="text-sm text-green-600">(Choose 2)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.map((mod) => {
            const isCore = type === "core";
            const isSelected = isCore || selectedSet.has(mod.id);
            const disableCheck =
              !isCore && !isSelected && selectedSet.size >= 2;

            const markStore = isCore
              ? level === "l5"
                ? l5CoreMarks
                : l6CoreMarks
              : level === "l5"
              ? l5OptionalMarks
              : l6OptionalMarks;

            return (
              <Card
                key={mod.id}
                className={`transition-all ${
                  isSelected
                    ? isCore
                      ? "border-blue-200 bg-blue-50/30"
                      : "ring-2 ring-green-500"
                    : ""
                }`}
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
                          <h4 className="font-medium">{mod.name}</h4>
                          <p className="text-sm text-gray-600">
                            {mod.id} • {mod.credits} credits
                          </p>
                        </div>
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
                            value={markStore[mod.id] ?? ""}
                            onChange={(e) =>
                              handleMarkChange(
                                level,
                                type,
                                mod.id,
                                e.target.value
                              )
                            }
                            /* block the hidden spinner shortcuts */
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault(); // stops 79 -> 78, 58 -> 57, etc.
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()} // stops track-pad scrolling changing the value
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
        </CardContent>
      </Card>
    );
  };

  /* ------------------------------------------------------------------ */
  /*                             JSX                                    */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* -------- Header -------- */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Computer Science Calculator
            </h1>
            <p className="text-sm text-gray-600">
              L5/L6 Weighted Classification
            </p>
          </div>
        </div>
      </header>

      {/* -------- Body -------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Level 5 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Level 5 Modules
            </h2>
            {renderModuleSection(
              "L5 Core Modules",
              csModules.l5.core,
              "l5",
              "core"
            )}
            {renderModuleSection(
              "L5 Optional Modules",
              csModules.l5.optional,
              "l5",
              "optional"
            )}
          </section>

          {/* Level 6 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Level 6 Modules
            </h2>
            {renderModuleSection(
              "L6 Core Modules",
              csModules.l6.core,
              "l6",
              "core"
            )}
            {renderModuleSection(
              "L6 Optional Modules",
              csModules.l6.optional,
              "l6",
              "optional"
            )}
          </section>
        </div>

        {/* -------- Results card -------- */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" /> Classification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showResults && results ? (
                <div
                  className={`p-4 rounded-lg ${
                    classify(results.finalAverage).bg
                  } border-2`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
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
                    <div className="flex justify-between font-semibold">
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
                    Select <strong>two optionals per level</strong> and enter
                    marks for every module to see your classification.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* -------- Calculation Method -------- */}
      <div className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-6 w-6" /> Calculation Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-bold text-blue-900 mb-2 text-lg">
                Final Grade Formula:
              </p>
              <p className="text-blue-800 font-mono text-lg">
                Final = (⅓ × L5 Average) + (⅔ × L6 Average)
              </p>
            </div>
            <ul className="space-y-2 text-base">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                The single lowest-scoring <strong>20-credit</strong> module
                across both levels may be dropped <em>unless</em> it is SDGP or
                FYP.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                SDGP (L5) and FYP (L6) are mandatory and <strong>cannot</strong>{" "}
                be dropped.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                You must choose <strong>exactly two</strong> optional modules at
                each level.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                If a drop occurs, total credits fall from 240 → 220.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* -------- Disclaimer -------- */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm text-center">
        <p>
          <strong>Disclaimer:</strong> This tool is not officially affiliated
          with IIT. Results shown are approximate and for guidance purposes
          only. Please consult your academic advisor for final grades.
        </p>
      </div>
      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}
