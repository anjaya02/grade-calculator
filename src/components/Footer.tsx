"use client";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-200 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand & Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Grade Calculator
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto md:mx-0">
              A precise tool built to eliminate the guesswork of tracking
              academic progress and final degree classification.
            </p>
            <div className="inline-block bg-gray-800/50 border border-gray-700/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
              23/24 PT CS BATCH
            </div>
          </div>

          {/* Developer Identity */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">
                  A
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-200">
                Anjaya Induwara
              </h4>
              <p className="text-sm font-medium text-gray-400 flex items-center justify-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> anjaya.20234069@iit.ac.lk
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
              Connect
            </h4>
            <div className="flex gap-4">
              <Link
                href="https://github.com/anjaya02"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-indigo-500 hover:bg-gray-800/80 transition-all shadow-lg hover:shadow-indigo-500/20 group"
              >
                <Github className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/anjaya02"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-gray-800/80 transition-all shadow-lg hover:shadow-[#0A66C2]/20 group"
              >
                <Linkedin className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Grade Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
