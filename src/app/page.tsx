import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, Code, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="h-12 w-12 text-blue-600" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Degree Class Calculator</h1>
              <p className="text-sm text-gray-600">Informatics Institute of Technology</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Calculate Your Degree Classification</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your academic progress and predict your final degree classification for CS & SE degrees
          </p>
        </div>

        {/* Classification Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Classification Categories</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🥇</div>
                <h4 className="font-bold text-yellow-800 mb-1">First Class</h4>
                <p className="text-sm text-yellow-700">70% and above</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🥈</div>
                <h4 className="font-bold text-green-800 mb-1">Second Upper</h4>
                <p className="text-sm text-green-700">60% - 69%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🥉</div>
                <h4 className="font-bold text-orange-800 mb-1">Second Lower</h4>
                <p className="text-sm text-orange-700">50% - 59%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📜</div>
                <h4 className="font-bold text-purple-800 mb-1">Pass</h4>
                <p className="text-sm text-purple-700">40% - 49%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">❌</div>
                <h4 className="font-bold text-red-800 mb-1">Fail</h4>
                <p className="text-sm text-red-700">Below 40%</p>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer Alert */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm text-center">
            <p>
              <strong>Disclaimer:</strong> This tool is not officially affiliated with IIT. Results shown are
              approximate and for guidance purposes only. Please consult your academic advisor for final grades.
            </p>
          </div>
        </div>

        {/* Degree Program Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Computer Science Option */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="text-center flex-shrink-0">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Computer Science</CardTitle>
              <CardDescription className="text-base">CS degree with L5/L6 weighted calculation</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <li>• L5 and L6 modules included</li>
                <li>• Automatic lowest optional exclusion</li>
                <li>• 1/3 L5 + 2/3 L6 weighting</li>
                <li>• FYP and SDGP mandatory</li>
              </ul>
              <Link href="/cs-calculator" className="w-full mt-auto">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Calculate CS Degree</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Software Engineering Option */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="text-center flex-shrink-0">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Code className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Software Engineering</CardTitle>
              <CardDescription className="text-base">SE degree with L5/L6 weighted calculation</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <li>• L5 and L6 modules included</li>
                <li>• Automatic lowest optional exclusion</li>
                <li>• 1/3 L5 + 2/3 L6 weighting</li>
                <li>• FYP and SDGP mandatory</li>
              </ul>
              <Link href="/se-calculator" className="w-full mt-auto">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Calculate SE Degree</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Anjaya Induwara</h3>
            <div className="space-y-2 mb-4">
              <p className="text-indigo-200 text-lg">anjaya.20234069@iit.ac.lk</p>
              <p className="text-indigo-200">CS undergraduate</p>
            </div>
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 rounded-full px-6 py-3 shadow-lg">
              <p className="text-white font-bold text-lg">23/24 PT CS</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-indigo-200 text-sm">
                Degree Classification Calculator • Built with Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
