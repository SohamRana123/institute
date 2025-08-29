import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function StudentPerformance() {
  return (
    <>
      {/* Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Student Performance
          </h2>
          <p className="text-xl text-violet-100">
            Track your academic progress and performance metrics
          </p>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-violet-600 p-4 rounded-lg">
              <span className="text-white text-2xl font-bold">VK</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
            Student Performance Portal
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Enter your student ID to view your academic performance
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter your student ID"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-3 px-4 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-300 font-medium"
            >
              View Performance
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
