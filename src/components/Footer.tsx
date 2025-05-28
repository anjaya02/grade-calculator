"use client";
import { Github, Linkedin, User } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-700 p-4 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white">Anjaya Induwara</h3>
          <p className="text-gray-400">anjaya.20234069@iit.ac.lk</p>
          <p className="text-gray-400 mb-4">CS Undergraduate</p>

          <div className="inline-block bg-gray-700 text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium">
            23/24 PT CS
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <a
              href="https://github.com/anjaya02/grade-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/anjaya02"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Linkedin className="h-5 w-5" />
              LinkedIn
            </a>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Degree Classification Calculator •
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
