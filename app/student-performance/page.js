"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function StudentPerformance() {
  const [showLogin, setShowLogin] = useState(true);
  const [studentId, setStudentId] = useState("");

  // Test data based on the image
  const testData = {
    studentName: "John Doe",
    rollNumber: "2024001",
    class: "10th Grade",
    subjects: [
      { name: "Mathematics", maxMarks: 100, obtained: 85, grade: "A" },
      { name: "Science", maxMarks: 100, obtained: 92, grade: "A+" },
      { name: "English", maxMarks: 100, obtained: 78, grade: "B+" },
      { name: "Social Studies", maxMarks: 100, obtained: 88, grade: "A" },
      { name: "Hindi", maxMarks: 100, obtained: 82, grade: "A" },
    ],
    total: { maxMarks: 500, obtained: 425, percentage: 85 },
    overallGrade: "A",
    rank: "5th",
    resultDate: "March 15, 2024",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (studentId.trim()) {
      setShowLogin(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-green-100 text-green-800";
      case "B+":
        return "bg-blue-100 text-blue-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C+":
        return "bg-yellow-100 text-yellow-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSummaryColor = (type) => {
    switch (type) {
      case "grade":
        return "bg-green-50 border-green-200";
      case "percentage":
        return "bg-blue-50 border-blue-200";
      case "rank":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getSummaryTextColor = (type) => {
    switch (type) {
      case "grade":
        return "text-green-600";
      case "percentage":
        return "text-blue-600";
      case "rank":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      {/* Login Section */}
      {showLogin && (
        <section className="py-16 bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="bg-violet-600 p-4 rounded-lg">
                <span className="text-white text-2xl font-bold">VK</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Student Portal Login
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Enter your Student ID to access your performance report
            </p>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label
                  htmlFor="studentId"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your Student ID"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your Student ID was provided to you upon admission
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 text-white py-3 px-4 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-300 font-medium"
              >
                Access Performance Report
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Test Student ID: Any value (for demo purposes)
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have a Student ID?{" "}
                  <Link
                    href="/admissions"
                    className="text-violet-600 hover:text-violet-800"
                  >
                    Apply for admission
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Performance Report */}
      {!showLogin && (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-8">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                V.K. Institute
              </h1>
              <p className="text-purple-100 text-lg">
                Academic Performance Report
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Student Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Student Name
                    </p>
                    <p className="text-gray-900 text-lg font-semibold">
                      {testData.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Roll Number
                    </p>
                    <p className="text-gray-900 text-lg font-semibold">
                      {testData.rollNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Class</p>
                    <p className="text-gray-900 text-lg font-semibold">
                      {testData.class}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance Table */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Subject-wise Performance
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Subject
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Max Marks
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Obtained
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testData.subjects.map((subject, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {subject.name}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {subject.maxMarks}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-gray-900">
                            {subject.obtained}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                                subject.grade
                              )}`}
                            >
                              {subject.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-purple-50 border-t-2 border-purple-200">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          Total
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gray-900">
                          {testData.total.maxMarks}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gray-900">
                          {testData.total.obtained}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-purple-600">
                          {testData.total.percentage}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                  className={`bg-white rounded-lg shadow-md p-6 border-2 ${getSummaryColor(
                    "grade"
                  )}`}
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Overall Grade
                  </h3>
                  <div
                    className={`text-4xl font-bold ${getSummaryTextColor(
                      "grade"
                    )}`}
                  >
                    {testData.overallGrade}
                  </div>
                </div>
                <div
                  className={`bg-white rounded-lg shadow-md p-6 border-2 ${getSummaryColor(
                    "percentage"
                  )}`}
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Percentage
                  </h3>
                  <div
                    className={`text-4xl font-bold ${getSummaryTextColor(
                      "percentage"
                    )}`}
                  >
                    {testData.total.percentage}%
                  </div>
                </div>
                <div
                  className={`bg-white rounded-lg shadow-md p-6 border-2 ${getSummaryColor(
                    "rank"
                  )}`}
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Rank
                  </h3>
                  <div
                    className={`text-4xl font-bold ${getSummaryTextColor(
                      "rank"
                    )}`}
                  >
                    {testData.rank}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                  <p>Result declared on: {testData.resultDate}</p>
                  <button className="mt-2 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300">
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Back to Login Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
