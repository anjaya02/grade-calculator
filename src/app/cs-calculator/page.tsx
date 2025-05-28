"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, BookOpen, Calculator, User, Info } from "lucide-react"

// CS Module Data with new structure
const csModules = {
  l5: {
    core: [
      { id: "5COSC019C", name: "Object Oriented Programming", credits: 20, mandatory: true },
      { id: "5COSC020C", name: "Database Systems", credits: 20, mandatory: true },
      { id: "5COSC022C", name: "Client-Server Architectures", credits: 20, mandatory: true },
      { id: "5COSC021C", name: "Software Development Group Project (SDGP)", credits: 20, mandatory: true },
    ],
    optional: [
      { id: "5COSC026C", name: "Advanced Client-side Development", credits: 20 },
      { id: "5COSC023C", name: "Mobile Application Development", credits: 20 },
      { id: "5COSC024C", name: "Server-side Web Development", credits: 20 },
      { id: "5COSC025C", name: "HCI & User Experience", credits: 20 },
      { id: "5MMCS007C", name: "3D Interactive Media Development", credits: 20 },
      { id: "5CCGD013C", name: "XR & Multimodal Interaction", credits: 20 },
      { id: "5BUIS020C", name: "Information Technology Security", credits: 20 },
      { id: "5SENG003C", name: "Algorithms: Theory, Design and Implementation", credits: 20 },
      { id: "5DATA001C", name: "Machine Learning and Data Mining", credits: 20 },
      { id: "5CCGD011C", name: "Game Engine Architecture", credits: 20 },
      { id: "5CCGD010C", name: "Maths and Physics for Games", credits: 20 },
      { id: "5ELEN018C", name: "Robotic Principles", credits: 20 },
      { id: "5ELEN018C-2", name: "Sensors & Signals", credits: 20 },
    ],
  },
  l6: {
    core: [
      { id: "6COSC023C", name: "Final Year Project (FYP)", credits: 40, mandatory: true },
      { id: "6COSC020C", name: "Applied AI", credits: 20, mandatory: true },
      { id: "6COSC019C", name: "Cyber Security", credits: 20, mandatory: true },
    ],
    optional: [
      { id: "6COSC021C", name: "Mobile Native Application Development", credits: 20 },
      { id: "6COSC022C", name: "Advanced Server-side Web Programming", credits: 20 },
      { id: "6MMCS009C", name: "Usability Testing and Evaluation", credits: 20 },
      { id: "6MMCS008C", name: "Advanced Interactive Media Development", credits: 20 },
      { id: "6MARK027C", name: "Digital Marketing, Social Media and Web Analytics", credits: 20 },
      { id: "6BUIS019C", name: "Strategic Management of Information Systems", credits: 20 },
      { id: "6BUIS018C", name: "Information Driven Entrepreneurship and Enterprise", credits: 20 },
      { id: "6DATA005C", name: "Operational Research and Optimisation", credits: 20 },
      { id: "6CCGD002C", name: "Game AI", credits: 20 },
      { id: "6MMCS006C", name: "Advanced Interactive Media Development", credits: 20 },
      { id: "6ELEN018C", name: "Applied Robotics", credits: 20 },
      { id: "6NTCM009W", name: "Internet of Things", credits: 20 },
    ],
  },
}

interface StudentInfo {
  name: string
  studentId: string
}

export default function CSCalculatorPage() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: "", studentId: "" })
  const [l5CoreMarks, setL5CoreMarks] = useState<Record<string, number>>({})
  const [l5SelectedOptional, setL5SelectedOptional] = useState<Set<string>>(new Set())
  const [l5OptionalMarks, setL5OptionalMarks] = useState<Record<string, number>>({})
  const [l6CoreMarks, setL6CoreMarks] = useState<Record<string, number>>({})
  const [l6SelectedOptional, setL6SelectedOptional] = useState<Set<string>>(new Set())
  const [l6OptionalMarks, setL6OptionalMarks] = useState<Record<string, number>>({})

  const handleOptionalToggle = (level: "l5" | "l6", moduleId: string, checked: boolean) => {
    const setSelected = level === "l5" ? setL5SelectedOptional : setL6SelectedOptional
    const setMarks = level === "l5" ? setL5OptionalMarks : setL6OptionalMarks
    const marks = level === "l5" ? l5OptionalMarks : l6OptionalMarks

    const newSelected = new Set(level === "l5" ? l5SelectedOptional : l6SelectedOptional)
    if (checked) {
      newSelected.add(moduleId)
    } else {
      newSelected.delete(moduleId)
      const newMarks = { ...marks }
      delete newMarks[moduleId]
      setMarks(newMarks)
    }
    setSelected(newSelected)
  }

  const handleMarkChange = (level: "l5" | "l6", type: "core" | "optional", moduleId: string, mark: string) => {
    const numMark = Number.parseFloat(mark)
    const setMarks =
      level === "l5"
        ? type === "core"
          ? setL5CoreMarks
          : setL5OptionalMarks
        : type === "core"
          ? setL6CoreMarks
          : setL6OptionalMarks

    if (!isNaN(numMark) && numMark >= 0 && numMark <= 100) {
      setMarks((prev) => ({ ...prev, [moduleId]: numMark }))
    } else if (mark === "") {
      setMarks((prev) => {
        const newMarks = { ...prev }
        delete newMarks[moduleId]
        return newMarks
      })
    }
  }

  const calculateResults = () => {
    // Calculate L5 average (excluding lowest optional if more than 2 selected)
    const l5CoreCredits = csModules.l5.core.reduce((sum, module) => sum + module.credits, 0)
    const l5CoreWeightedSum = csModules.l5.core.reduce((sum, module) => {
      const mark = l5CoreMarks[module.id] || 0
      return sum + mark * module.credits
    }, 0)

    // Get L5 optional modules with marks
    const l5OptionalWithMarks = Array.from(l5SelectedOptional)
      .map((moduleId) => {
        const module = csModules.l5.optional.find((m) => m.id === moduleId)
        const mark = l5OptionalMarks[moduleId]
        return module && mark !== undefined ? { ...module, mark } : null
      })
      .filter(Boolean)

    // Exclude lowest optional if more than 2 selected (need exactly 2)
    let l5OptionalToUse = l5OptionalWithMarks
    if (l5OptionalWithMarks.length > 2) {
      l5OptionalToUse = l5OptionalWithMarks
        .sort((a, b) => a!.mark - b!.mark)
        .slice(1) // Remove lowest
        .slice(0, 2) // Take only 2
    }

    const l5OptionalCredits = l5OptionalToUse.reduce((sum, module) => sum + module!.credits, 0)
    const l5OptionalWeightedSum = l5OptionalToUse.reduce((sum, module) => sum + module!.mark * module!.credits, 0)

    const l5TotalCredits = l5CoreCredits + l5OptionalCredits
    const l5Average = l5TotalCredits > 0 ? (l5CoreWeightedSum + l5OptionalWeightedSum) / l5TotalCredits : 0

    // Calculate L6 average (excluding lowest optional if more than 2 selected)
    const l6CoreCredits = csModules.l6.core.reduce((sum, module) => sum + module.credits, 0)
    const l6CoreWeightedSum = csModules.l6.core.reduce((sum, module) => {
      const mark = l6CoreMarks[module.id] || 0
      return sum + mark * module.credits
    }, 0)

    // Get L6 optional modules with marks
    const l6OptionalWithMarks = Array.from(l6SelectedOptional)
      .map((moduleId) => {
        const module = csModules.l6.optional.find((m) => m.id === moduleId)
        const mark = l6OptionalMarks[moduleId]
        return module && mark !== undefined ? { ...module, mark } : null
      })
      .filter(Boolean)

    // Exclude lowest optional if more than 2 selected (need exactly 2)
    let l6OptionalToUse = l6OptionalWithMarks
    if (l6OptionalWithMarks.length > 2) {
      l6OptionalToUse = l6OptionalWithMarks
        .sort((a, b) => a!.mark - b!.mark)
        .slice(1) // Remove lowest
        .slice(0, 2) // Take only 2
    }

    const l6OptionalCredits = l6OptionalToUse.reduce((sum, module) => sum + module!.credits, 0)
    const l6OptionalWeightedSum = l6OptionalToUse.reduce((sum, module) => sum + module!.mark * module!.credits, 0)

    const l6TotalCredits = l6CoreCredits + l6OptionalCredits
    const l6Average = l6TotalCredits > 0 ? (l6CoreWeightedSum + l6OptionalWeightedSum) / l6TotalCredits : 0

    // Final calculation: 1/3 L5 + 2/3 L6
    const finalAverage = l5Average > 0 && l6Average > 0 ? (1 / 3) * l5Average + (2 / 3) * l6Average : 0

    return {
      l5Average,
      l6Average,
      finalAverage,
      l5Credits: l5TotalCredits,
      l6Credits: l6TotalCredits,
      totalCredits: l5TotalCredits + l6TotalCredits,
    }
  }

  const results = calculateResults()

  const getClassification = (average: number) => {
    if (average >= 70) return { class: "First Class", color: "text-yellow-700", bg: "bg-yellow-50" }
    if (average >= 60) return { class: "Second Upper", color: "text-green-700", bg: "bg-green-50" }
    if (average >= 50) return { class: "Second Lower", color: "text-orange-700", bg: "bg-orange-50" }
    if (average >= 40) return { class: "Pass", color: "text-purple-700", bg: "bg-purple-50" }
    return { class: "Fail", color: "text-red-700", bg: "bg-red-50" }
  }

  const renderModuleSection = (
    title: string,
    modules: typeof csModules.l5.core,
    level: "l5" | "l6",
    type: "core" | "optional",
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {title}
          {type === "core" && <span className="text-sm text-red-600">(Required)</span>}
          {type === "optional" && <span className="text-sm text-green-600">(Choose any 2)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => {
          const isCore = type === "core"
          const isSelected = isCore || (level === "l5" ? l5SelectedOptional : l6SelectedOptional).has(module.id)
          const marks = isCore
            ? level === "l5"
              ? l5CoreMarks
              : l6CoreMarks
            : level === "l5"
              ? l5OptionalMarks
              : l6OptionalMarks

          return (
            <Card
              key={module.id}
              className={`transition-all ${isSelected ? (isCore ? "border-blue-200 bg-blue-50/30" : "ring-2 ring-green-500") : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {!isCore && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleOptionalToggle(level, module.id, checked as boolean)}
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
                        <Label htmlFor={`mark-${module.id}`} className="text-sm">
                          Mark (%)
                        </Label>
                        <Input
                          id={`mark-${module.id}`}
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter mark (0-100)"
                          value={marks[module.id] || ""}
                          onChange={(e) => handleMarkChange(level, type, module.id, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Computer Science Calculator</h1>
                <p className="text-sm text-gray-600">L5/L6 Weighted Classification</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Module Input */}
          <div className="lg:col-span-2 space-y-8">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
                <CardDescription>Enter your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input
                      id="student-name"
                      placeholder="Enter your full name"
                      value={studentInfo.name}
                      onChange={(e) => setStudentInfo((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input
                      id="student-id"
                      placeholder="Enter your student ID"
                      value={studentInfo.studentId}
                      onChange={(e) => setStudentInfo((prev) => ({ ...prev, studentId: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level 5 Modules */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Level 5 Modules</h2>
              {renderModuleSection("L5 Core Modules", csModules.l5.core, "l5", "core")}
              {renderModuleSection("L5 Optional Modules", csModules.l5.optional, "l5", "optional")}
            </div>

            {/* Level 6 Modules */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Level 6 Modules</h2>
              {renderModuleSection("L6 Core Modules", csModules.l6.core, "l6", "core")}
              {renderModuleSection("L6 Optional Modules", csModules.l6.optional, "l6", "optional")}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Classification Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.finalAverage > 0 ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{results.finalAverage.toFixed(1)}%</div>
                      <div
                        className={`text-sm font-medium px-3 py-1 rounded-full ${getClassification(results.finalAverage).bg} ${getClassification(results.finalAverage).color}`}
                      >
                        {getClassification(results.finalAverage).class}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>L5 Average:</span>
                        <span className="font-medium">{results.l5Average.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>L6 Average:</span>
                        <span className="font-medium">{results.l6Average.toFixed(1)}%</span>
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
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter marks to see live classification results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calculation Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-5 w-5" />
                  Calculation Method
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="font-medium text-blue-900 mb-2">Final Grade Formula:</p>
                  <p className="text-blue-800">Final = (1/3 × L5) + (2/3 × L6)</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Lowest optional module excluded
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    FYP and SDGP are mandatory
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Choose exactly 2 optional per level
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm text-center">
          <p>
            <strong>Disclaimer:</strong> This tool is not officially affiliated with IIT. Results shown are approximate
            and for guidance purposes only. Please consult your academic advisor for final grades.
          </p>
        </div>
      </div>
    </div>
  )
}
