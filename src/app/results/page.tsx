export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Results Page</h1>
      <p className="mb-8">This is the results page content.</p>

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm">
        <p>
          <strong>Disclaimer:</strong> This tool is not officially affiliated with IIT. Results shown are approximate
          and for guidance purposes only. Please consult your academic advisor for final grades.
        </p>
      </div>
    </div>
  )
}
