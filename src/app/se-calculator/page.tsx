"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Code, Calculator, Info } from "lucide-react";

// SE Module Data
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
};

export default function SECalculatorPage() {
  // Marks state
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

  // Toggle optional modules
  const handleOptionalToggle = (
    level: "l5" | "l6",
    moduleId: string,
    checked: boolean
  ) => {
    const setSelected =
      level === "l5" ? setL5SelectedOptional : setL6SelectedOptional;
    const setMarks = level === "l5" ? setL5OptionalMarks : setL6OptionalMarks;
    const marks = level === "l5" ? l5OptionalMarks : l6OptionalMarks;

    const newSelected = new Set(
      level === "l5" ? l5SelectedOptional : l6SelectedOptional
    );
    if (checked) {
      newSelected.add(moduleId);
    } else {
      newSelected.delete(moduleId);
      const newMarks = { ...marks };
      delete newMarks[moduleId];
      setMarks(newMarks);
    }
    setSelected(newSelected);
  };

  // Capture mark inputs
  const handleMarkChange = (
    level: "l5" | "l6",
    type: "core" | "optional",
    moduleId: string,
    mark: string
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

  // Compute averages & credits
  const calculateResults = () => {
    // Level 5
    const l5CoreCredits = seModules.l5.core.reduce(
      (sum, m) => sum + m.credits,
      0
    );
    const l5CoreWeighted = seModules.l5.core.reduce(
      (sum, m) => sum + (l5CoreMarks[m.id] || 0) * m.credits,
      0
    );
    const l5OptList = Array.from(l5SelectedOptional)
      .map((id) => {
        const m = seModules.l5.optional.find((x) => x.id === id);
        const mark = l5OptionalMarks[id];
        return m && mark !== undefined ? { ...m, mark } : null;
      })
      .filter(Boolean) as Array<{ credits: number; mark: number }>;
    const l5OptUse =
      l5OptList.length > 1
        ? l5OptList.sort((a, b) => b.mark - a.mark).slice(0, 1)
        : l5OptList;
    const l5OptCredits = l5OptUse.reduce((sum, m) => sum + m.credits, 0);
    const l5OptWeighted = l5OptUse.reduce(
      (sum, m) => sum + m.mark * m.credits,
      0
    );
    const l5TotalCredits = l5CoreCredits + l5OptCredits;
    const l5Average =
      l5TotalCredits > 0
        ? (l5CoreWeighted + l5OptWeighted) / l5TotalCredits
        : 0;

    // Level 6
    const l6CoreCredits = seModules.l6.core.reduce(
      (sum, m) => sum + m.credits,
      0
    );
    const l6CoreWeighted = seModules.l6.core.reduce(
      (sum, m) => sum + (l6CoreMarks[m.id] || 0) * m.credits,
      0
    );
    const l6OptList = Array.from(l6SelectedOptional)
      .map((id) => {
        const m = seModules.l6.optional.find((x) => x.id === id);
        const mark = l6OptionalMarks[id];
        return m && mark !== undefined ? { ...m, mark } : null;
      })
      .filter(Boolean) as Array<{ credits: number; mark: number }>;
    const l6OptUse =
      l6OptList.length > 1
        ? l6OptList.sort((a, b) => b.mark - a.mark).slice(0, 1)
        : l6OptList;
    const l6OptCredits = l6OptUse.reduce((sum, m) => sum + m.credits, 0);
    const l6OptWeighted = l6OptUse.reduce(
      (sum, m) => sum + m.mark * m.credits,
      0
    );
    const l6TotalCredits = l6CoreCredits + l6OptCredits;
    const l6Average =
      l6TotalCredits > 0
        ? (l6CoreWeighted + l6OptWeighted) / l6TotalCredits
        : 0;

    // Final weighted
    const finalAverage =
      l5Average > 0 && l6Average > 0 ? l5Average / 3 + (2 * l6Average) / 3 : 0;

    return {
      l5Average,
      l6Average,
      finalAverage,
      l5Credits: l5TotalCredits,
      l6Credits: l6TotalCredits,
      totalCredits: l5TotalCredits + l6TotalCredits,
    };
  };

  const results = calculateResults();
  const showResults = results.finalAverage > 0 && results.totalCredits === 240;

  const getClassification = (avg: number) => {
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

  const renderModuleSection = (
    title: string,
    modules: typeof seModules.l5.core,
    level: "l5" | "l6",
    type: "core" | "optional"
  ) => (
    <Card key={title}>
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
        {modules.map((mod) => {
          const isCore = type === "core";
          const selectedSet =
            level === "l5" ? l5SelectedOptional : l6SelectedOptional;
          const isSelected = isCore || selectedSet.has(mod.id);
          const marks = isCore
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
                    ? "border-purple-200 bg-purple-50/30"
                    : "ring-2 ring-purple-500"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {!isCore && (
                    <Checkbox
                      checked={isSelected}
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
                          value={marks[mod.id] ?? ""}
                          onChange={(e) =>
                            handleMarkChange(
                              level,
                              type,
                              mod.id,
                              e.target.value
                            )
                          }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Code className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Software Engineering Calculator
            </h1>
            <p className="text-sm text-gray-600">
              L5/L6 Weighted Classification
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Level 5 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Level 5 Modules
            </h2>
            {renderModuleSection(
              "L5 Core Modules",
              seModules.l5.core,
              "l5",
              "core"
            )}
            {renderModuleSection(
              "L5 Optional Modules",
              seModules.l5.optional,
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
              seModules.l6.core,
              "l6",
              "core"
            )}
            {renderModuleSection(
              "L6 Optional Modules",
              seModules.l6.optional,
              "l6",
              "optional"
            )}
          </section>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Classification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showResults ? (
                <div
                  className={`p-4 rounded-lg ${
                    getClassification(results.finalAverage).bg
                  } border-2`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {results.finalAverage.toFixed(1)}%
                    </div>
                    <div
                      className={`text-lg font-bold px-4 py-2 rounded-full ${
                        getClassification(results.finalAverage).color
                      }`}
                    >
                      {getClassification(results.finalAverage).label}
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
                      <span>Total Credits:</span>
                      <span>{results.totalCredits}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Select one optional per level and enter marks to see results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calculation Method */}
      <div className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-6 w-6" />
              Calculation Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-bold text-blue-900 mb-2 text-lg">
                Final Grade Formula:
              </p>
              <p className="text-blue-800 font-mono text-lg">
                Final = (1/3 × L5 Average) + (2/3 × L6 Average)
              </p>
            </div>
            <ul className="space-y-2 text-base">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                The lowest‐scoring optional module is excluded (choose 1 per
                level).
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                SDGP and FYP are mandatory.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                All core modules are required.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm text-center">
        <p>
          <strong>Disclaimer:</strong> This tool is not officially affiliated
          with IIT. Results shown are approximate and for guidance purposes
          only. Please consult your academic advisor for final grades.
        </p>
      </div>
    </div>
  );
}
