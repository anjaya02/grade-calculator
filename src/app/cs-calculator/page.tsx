"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, BookOpen, Calculator, Info } from "lucide-react";

// CS Module Data
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
};

export default function CSCalculatorPage() {
  const [l5CoreMarks, setL5CoreMarks] = useState({});
  const [l5SelectedOptional, setL5SelectedOptional] = useState(new Set());
  const [l5OptionalMarks, setL5OptionalMarks] = useState({});
  const [l6CoreMarks, setL6CoreMarks] = useState({});
  const [l6SelectedOptional, setL6SelectedOptional] = useState(new Set());
  const [l6OptionalMarks, setL6OptionalMarks] = useState({});

  const handleOptionalToggle = (level, moduleId, checked) => {
    const selectedSet =
      level === "l5" ? l5SelectedOptional : l6SelectedOptional;
    const setSelected =
      level === "l5" ? setL5SelectedOptional : setL6SelectedOptional;
    const setMarks = level === "l5" ? setL5OptionalMarks : setL6OptionalMarks;
    const marks = level === "l5" ? l5OptionalMarks : l6OptionalMarks;

    const newSelected = new Set(selectedSet);
    if (checked) {
      // Prevent adding more than two
      if (newSelected.size >= 2) return;
      newSelected.add(moduleId);
    } else {
      newSelected.delete(moduleId);
      const newMarks = { ...marks };
      delete newMarks[moduleId];
      setMarks(newMarks);
    }
    setSelected(newSelected);
  };

  const handleMarkChange = (level, type, moduleId, mark) => {
    const numMark = parseFloat(mark);
    const setMarks =
      level === "l5"
        ? type === "core"
          ? setL5CoreMarks
          : setL5OptionalMarks
        : type === "core"
        ? setL6CoreMarks
        : setL6OptionalMarks;

    if (!isNaN(numMark) && numMark >= 0 && numMark <= 100) {
      setMarks((prev) => ({ ...prev, [moduleId]: numMark }));
    } else if (mark === "") {
      setMarks((prev) => {
        const newMarks = { ...prev };
        delete newMarks[moduleId];
        return newMarks;
      });
    }
  };

  const getClassification = (average) => {
    if (average >= 70)
      return {
        class: "First Class",
        color: "text-green-800",
        bg: "bg-green-100",
      };
    if (average >= 60)
      return {
        class: "Second Upper",
        color: "text-blue-800",
        bg: "bg-blue-100",
      };
    if (average >= 50)
      return {
        class: "Second Lower",
        color: "text-orange-800",
        bg: "bg-orange-100",
      };
    if (average >= 40)
      return { class: "Pass", color: "text-purple-800", bg: "bg-purple-100" };
    return { class: "Fail", color: "text-red-800", bg: "bg-red-100" };
  };

  const calculateResults = () => {
    // L5 calculations
    const l5CoreCredits = csModules.l5.core.reduce(
      (sum, m) => sum + m.credits,
      0
    );
    const l5CoreWeighted = csModules.l5.core.reduce(
      (sum, m) => sum + (l5CoreMarks[m.id] || 0) * m.credits,
      0
    );
    const l5OptWithMarks = Array.from(l5SelectedOptional)
      .map((id) => {
        const m = csModules.l5.optional.find((x) => x.id === id);
        const mark = l5OptionalMarks[id];
        return m && mark !== undefined ? { ...m, mark } : null;
      })
      .filter(Boolean);
    let l5OptToUse = l5OptWithMarks;
    if (l5OptWithMarks.length > 2) {
      l5OptToUse = l5OptWithMarks.sort((a, b) => a.mark - b.mark).slice(1, 3);
    }
    const l5OptCredits = l5OptToUse.reduce((sum, m) => sum + m.credits, 0);
    const l5OptWeighted = l5OptToUse.reduce(
      (sum, m) => sum + m.mark * m.credits,
      0
    );
    const l5TotalCredits = l5CoreCredits + l5OptCredits;
    const l5Average =
      l5TotalCredits > 0
        ? (l5CoreWeighted + l5OptWeighted) / l5TotalCredits
        : 0;

    // L6 calculations
    const l6CoreCredits = csModules.l6.core.reduce(
      (sum, m) => sum + m.credits,
      0
    );
    const l6CoreWeighted = csModules.l6.core.reduce(
      (sum, m) => sum + (l6CoreMarks[m.id] || 0) * m.credits,
      0
    );
    const l6OptWithMarks = Array.from(l6SelectedOptional)
      .map((id) => {
        const m = csModules.l6.optional.find((x) => x.id === id);
        const mark = l6OptionalMarks[id];
        return m && mark !== undefined ? { ...m, mark } : null;
      })
      .filter(Boolean);
    let l6OptToUse = l6OptWithMarks;
    if (l6OptWithMarks.length > 2) {
      l6OptToUse = l6OptWithMarks.sort((a, b) => a.mark - b.mark).slice(1, 3);
    }
    const l6OptCredits = l6OptToUse.reduce((sum, m) => sum + m.credits, 0);
    const l6OptWeighted = l6OptToUse.reduce(
      (sum, m) => sum + m.mark * m.credits,
      0
    );
    const l6TotalCredits = l6CoreCredits + l6OptCredits;
    const l6Average =
      l6TotalCredits > 0
        ? (l6CoreWeighted + l6OptWeighted) / l6TotalCredits
        : 0;

    const finalAverage =
      l5Average > 0 && l6Average > 0
        ? (1 / 3) * l5Average + (2 / 3) * l6Average
        : 0;

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

  const renderModuleSection = (title, modules, level, type) => {
    const selectedSet =
      level === "l5" ? l5SelectedOptional : l6SelectedOptional;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> {title}
            {type === "core" ? (
              <span className="text-sm text-red-600">(Required)</span>
            ) : (
              <span className="text-sm text-green-600">(Choose any 2)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.map((module) => {
            const isCore = type === "core";
            const isSelected = isCore || selectedSet.has(module.id);
            const marks = isCore
              ? level === "l5"
                ? l5CoreMarks
                : l6CoreMarks
              : level === "l5"
              ? l5OptionalMarks
              : l6OptionalMarks;
            const disableCheckbox =
              !isSelected && selectedSet.size >= 2 && type === "optional";

            return (
              <Card
                key={module.id}
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
                        disabled={disableCheckbox}
                        onCheckedChange={(checked) =>
                          handleOptionalToggle(level, module.id, checked)
                        }
                        className="mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-gray-600">
                            {module.id} • {module.credits} credits
                          </p>
                        </div>
                      </div>
                      {(isCore || isSelected) && (
                        <div className="mt-3">
                          <Label
                            htmlFor={`mark-${module.id}`}
                            className="text-sm"
                          >
                            Mark (%)
                          </Label>
                          <Input
                            id={`mark-${module.id}`}
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter mark (0-100)"
                            value={marks[module.id] ?? ""}
                            onChange={(e) =>
                              handleMarkChange(
                                level,
                                type,
                                module.id,
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
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
          </div>

          <div className="space-y-6">
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
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" /> Classification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showResults ? (
                <div
                  className={`p-4 rounded-lg ${
                    getClassification(results.finalAverage).bg
                  } border-2 ${getClassification(
                    results.finalAverage
                  ).bg.replace("bg-", "border-")}`}
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
                      {getClassification(results.finalAverage).class}
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
                      <span className="font-medium">{results.l5Credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>L6 Credits:</span>
                      <span className="font-medium">{results.l6Credits}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Credits:</span>
                      <span>{results.totalCredits}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter marks to see live classification results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
                Final = (1/3 × L5 Average) + (2/3 × L6 Average)
              </p>
            </div>
            <ul className="space-y-2 text-base">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                The lowest-scoring optional module is excluded.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                FYP and SDGP are mandatory.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                Exactly two optional modules must be selected per level.
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
