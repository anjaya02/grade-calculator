export const calculatorThemes = {
  indigo: {
    page:
      "from-indigo-50 via-white to-sky-50",
    backgroundShape: "bg-indigo-300",
    icon:
      "from-indigo-500 to-indigo-600 shadow-indigo-200",
    coreModule: "border-blue-200 bg-blue-50/30",
    optionalModule: "ring-2 ring-green-500",
    optionalLabel: "text-green-600",
  },
  purple: {
    page:
      "from-purple-50 via-white to-sky-50",
    backgroundShape: "bg-purple-300",
    icon:
      "from-purple-500 to-indigo-600 shadow-purple-200",
    coreModule: "border-purple-200 bg-purple-50/30",
    optionalModule: "ring-2 ring-purple-500",
    optionalLabel: "text-purple-600",
  },
} as const;
