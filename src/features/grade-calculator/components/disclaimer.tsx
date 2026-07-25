export function Disclaimer() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-xl shadow-amber-200/40 backdrop-blur-sm">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-amber-400/10" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-orange-400/10" />
      <div className="relative flex items-start gap-4">
        <div className="flex-1">
          <h4 className="mb-1.5 text-base font-bold text-amber-900">
            Important Notice
          </h4>
          <p className="text-sm font-medium leading-relaxed text-amber-800">
            <strong>Disclaimer:</strong> This tool is not officially affiliated
            with IIT. Results shown are approximate and for guidance purposes
            only. Please consult your academic advisor for final grades.
            Qualifying assessment components and other course-specific award
            requirements are not verified.
          </p>
        </div>
      </div>
    </div>
  );
}
