"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, BookOpen, Code, TerminalSquare } from "lucide-react";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-sky-50 overflow-hidden relative flex flex-col">
      {/* Abstract Background Shapes */}
      <div className="pointer-events-none absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="pointer-events-none absolute top-0 -right-4 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      <div className="pointer-events-none absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-indigo-100/50 shadow-sm sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
                  Degree Calculator
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  IIT Sri Lanka
                </p>
              </div>
            </div>

            <Link
              href="https://github.com/anjaya02/grade-calculator"
              target="_blank"
            >
              <Button
                variant="outline"
                className="hidden sm:flex border-indigo-100 text-indigo-700 hover:bg-indigo-50 rounded-full font-medium transition-colors"
              >
                <TerminalSquare className="w-4 h-4 mr-2" />
                View Source
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Forecast your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500">
              Academic Future
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminate the guesswork. Input your module marks and instantly
            calculate your final degree classification for CS & SE programs.
          </p>
        </motion.div>

        {/* Degree Program Selection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24"
        >
          {/* Computer Science Option */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="h-full"
          >
            <Card className="h-full border border-indigo-50/50 shadow-2xl shadow-indigo-100/40 bg-white/60 backdrop-blur-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardHeader className="text-center pb-2 pt-8">
                <div className="mx-auto mb-6 p-4 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-inner w-fit transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <BookOpen className="h-10 w-10 text-indigo-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Computer Science
                </CardTitle>
                <CardDescription className="text-base font-medium text-gray-500">
                  Standard L5/L6 calculation scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-12rem)] pb-8 px-8">
                <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1 mt-6 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />{" "}
                    L5 and L6 core/optional modules
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />{" "}
                    Automatic lowest-module exclusion
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />{" "}
                    1/3 L5 + 2/3 L6 ratio weighting
                  </li>
                </ul>
                <Link href="/cs-calculator" className="w-full mt-auto block">
                  <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-200 transition-all rounded-xl border-t border-white/20 group-hover:shadow-indigo-300">
                    Calculate CS Degree
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Software Engineering Option */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="h-full"
          >
            <Card className="h-full border border-sky-50/50 shadow-2xl shadow-sky-100/40 bg-white/60 backdrop-blur-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardHeader className="text-center pb-2 pt-8">
                <div className="mx-auto mb-6 p-4 rounded-3xl bg-gradient-to-br from-sky-100 to-blue-100 shadow-inner w-fit transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  <Code className="h-10 w-10 text-sky-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Software Eng.
                </CardTitle>
                <CardDescription className="text-base font-medium text-gray-500">
                  Tailored L5/L6 calculation scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-12rem)] pb-8 px-8">
                <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1 mt-6 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0" />{" "}
                    L5 and L6 core/optional modules
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0" />{" "}
                    Automatic lowest-module exclusion
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-sky-500 flex-shrink-0" />{" "}
                    1/3 L5 + 2/3 L6 ratio weighting
                  </li>
                </ul>
                <Link href="/se-calculator" className="w-full mt-auto block">
                  <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-200 transition-all rounded-xl border-t border-white/20 group-hover:shadow-sky-300">
                    Calculate SE Degree
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Classification Categories - Sleek Look */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Award Classifications
            </h3>
            <p className="text-gray-500 mt-2 font-medium">
              The standard grading bands mapped to your final average
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
            {[
              {
                title: "First Class",
                range: "70%+",
                emoji: "🥇",
                gradient: "from-emerald-400 to-teal-500",
                text: "text-emerald-700",
                shadow: "shadow-emerald-200/50",
              },
              {
                title: "Second Upper",
                range: "60-69%",
                emoji: "🥈",
                gradient: "from-blue-400 to-indigo-500",
                text: "text-blue-700",
                shadow: "shadow-blue-200/50",
              },
              {
                title: "Second Lower",
                range: "50-59%",
                emoji: "🥉",
                gradient: "from-amber-400 to-orange-500",
                text: "text-amber-700",
                shadow: "shadow-orange-200/50",
              },
              {
                title: "Pass",
                range: "40-49%",
                emoji: "🎖️",
                gradient: "from-purple-400 to-fuchsia-500",
                text: "text-purple-700",
                shadow: "shadow-purple-200/50",
              },
              {
                title: "Fail",
                range: "<40%",
                emoji: "❌",
                gradient: "from-rose-400 to-red-500",
                text: "text-rose-700",
                shadow: "shadow-rose-200/50",
              },
            ].map((band, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group"
              >
                <div
                  className={`p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl ${band.shadow} relative overflow-hidden h-full flex flex-col items-center justify-center text-center transition-all`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${band.gradient}`}
                  />
                  <div className="text-4xl mb-3 transform group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300 drop-shadow-sm">
                    {band.emoji}
                  </div>
                  <h4 className={`font-bold ${band.text} mb-1 tracking-tight`}>
                    {band.title}
                  </h4>
                  <p className="text-sm font-bold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">
                    {band.range}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer Alert */}
          <div className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/50 rounded-2xl p-6 text-amber-900 max-w-3xl mx-auto shadow-xl shadow-amber-200/40 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/10 rounded-full -ml-12 -mb-12" />
            <div className="relative flex items-start gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-amber-900 mb-1.5 text-lg">
                  Important Notice
                </h4>
                <p className="text-sm leading-relaxed font-medium text-amber-800">
                  <strong>Disclaimer:</strong> This tool is not officially
                  affiliated with IIT. Results shown are approximate and for
                  guidance purposes only. Please consult your academic advisor
                  for final grades.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
