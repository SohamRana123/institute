import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function StudentPerformance() {
  return (
    <>
      {/* Banner */}
      <section className="bg-purple-600 text-white py-12">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-2">Student Performance</h2>
          <p className="text-purple-800 text-xl">
            Track your academic progress and performance metrics
          </p>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-lg">
              <span className="text-white text-2xl font-bold">VK</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center mb-4">
            <span className="text-purple-800">Student Performance Portal</span>
          </h3>
          <p className="text-gray-600 text-center mb-6">
            <span className="text-purple-400">
              Enter your student ID to view your academic performance
            </span>
          </p>

          <form>
            <div className="mb-6">
              <label
                htmlFor="student-id"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Student ID
              </label>
              <input
                type="text"
                id="student-id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your student ID"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 font-medium"
            >
              View Performance
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-purple-800">
              Performance Tracking Features
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/chart-icon.svg"
                  alt="Grades Icon"
                  width={32}
                  height={32}
                  className="text-purple-800"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-800">
                Comprehensive Grades
              </h3>
              <p className="text-purple-400">
                View detailed breakdowns of grades across all subjects and
                assignments
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-800">
                Progress Analytics
              </h3>
              <p className="text-purple-400">
                Track improvement over time with visual analytics and progress
                reports
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-800">
                Teacher Feedback
              </h3>
              <p className="text-purple-400">
                Access detailed feedback from teachers on assignments and exams
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
