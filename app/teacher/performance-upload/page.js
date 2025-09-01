"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PerformanceUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");

  // Redirect if not logged in or not a teacher
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    !session?.user?.role?.includes("TEACHER")
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-700 mb-6">
            You must be logged in as a teacher to access this page.
          </p>
          <Link
            href="/login"
            className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "text/csv") {
      setError("Please upload a CSV file");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError("");
    setUploadResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/performance/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload performance data");
      }

      setUploadResult(result);
    } catch (err) {
      setError(err.message || "An error occurred while uploading the file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Upload Student Performance Data
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            CSV Upload
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                The CSV file should contain columns: rollNo, courseCode,
                examType, score, maxScore, examDate (optional), remarks
                (optional)
              </p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/teacher-dashboard"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Back to Dashboard
              </Link>
              <button
                type="submit"
                disabled={isUploading || !file}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isUploading || !file
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } transition duration-300`}
              >
                {isUploading ? "Uploading..." : "Upload Performance Data"}
              </button>
            </div>
          </form>
        </div>

        {uploadResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Results
            </h2>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <p className="text-green-700 font-medium">
                  Successfully inserted: {uploadResult.inserted} records
                </p>
              </div>

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <p className="text-red-700 font-medium">
                      Failed to insert: {uploadResult.errors.length} records
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">
                      Error Details:
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Row
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Error
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {uploadResult.errors.map((error, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {error.row}
                              </td>
                              <td className="px-4 py-2 text-sm text-red-600">
                                {error.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setUploadResult(null)}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Clear Results
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-100">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">
            CSV Format Instructions
          </h2>
          <p className="text-gray-700 mb-4">
            Your CSV file should follow this format with the following columns:
          </p>

          <div className="bg-white p-4 rounded-md overflow-x-auto mb-4">
            <pre className="text-sm text-gray-700">
              rollNo,courseCode,examType,score,maxScore,examDate,remarks
            </pre>
          </div>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>rollNo</strong>: Student&apos;s roll number (required)
            </li>
            <li>
              <strong>courseCode</strong>: Course code (required)
            </li>
            <li>
              <strong>examType</strong>: Type of exam (MIDTERM, FINAL,
              ASSIGNMENT, QUIZ, etc.) (required)
            </li>
            <li>
              <strong>score</strong>: Marks obtained by the student (required)
            </li>
            <li>
              <strong>maxScore</strong>: Maximum possible marks for the exam
              (required)
            </li>
            <li>
              <strong>examDate</strong>: Date of the exam (YYYY-MM-DD format)
              (optional)
            </li>
            <li>
              <strong>remarks</strong>: Any additional comments or feedback
              (optional)
            </li>
          </ul>

          <div className="mt-4">
            <h3 className="text-md font-medium text-purple-800 mb-2">
              Example:
            </h3>
            <div className="bg-white p-4 rounded-md overflow-x-auto">
              <pre className="text-sm text-gray-700">
                STU001,MATH101,MIDTERM,85,100,2023-10-15,Good understanding of
                concepts STU001,MATH101,FINAL,90,100,2023-12-20,Excellent
                performance STU002,PHY101,MIDTERM,75,100,2023-10-16,Needs
                improvement in mechanics
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
