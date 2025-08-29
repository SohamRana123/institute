import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Admissions() {
  return (
    <>
      {/* Admissions Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Admissions</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Your journey to academic excellence starts here
          </p>
        </div>
      </section>

      {/* Admission Requirements and Important Dates */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Admission Requirements */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Admission Requirements
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
                  <p className="text-gray-700">
                    Completed high school diploma or equivalent
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
                  <p className="text-gray-700">
                    Minimum 75% aggregate in qualifying examination
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
                  <p className="text-gray-700">Valid entrance exam scores</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
                  <p className="text-gray-700">
                    Character certificate from previous institution
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
                  <p className="text-gray-700">Medical fitness certificate</p>
                </li>
              </ul>
            </div>

            {/* Important Dates */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Important Dates
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="py-3">
                    <p className="text-gray-700">Application Opens</p>
                  </div>
                  <div className="py-3 text-right">
                    <p className="text-blue-600 font-medium">March 1, 2024</p>
                  </div>

                  <div className="py-3 border-t border-blue-100">
                    <p className="text-gray-700">Application Deadline</p>
                  </div>
                  <div className="py-3 text-right border-t border-blue-100">
                    <p className="text-blue-600 font-medium">May 31, 2024</p>
                  </div>

                  <div className="py-3 border-t border-blue-100">
                    <p className="text-gray-700">Entrance Exam</p>
                  </div>
                  <div className="py-3 text-right border-t border-blue-100">
                    <p className="text-blue-600 font-medium">June 15, 2024</p>
                  </div>

                  <div className="py-3 border-t border-blue-100">
                    <p className="text-gray-700">Results Announced</p>
                  </div>
                  <div className="py-3 text-right border-t border-blue-100">
                    <p className="text-blue-600 font-medium">July 1, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Application Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <Image
                  src="/step1-icon.svg"
                  alt="Step 1"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Submit Application
              </h3>
              <p className="text-gray-700">
                Complete the online application form and submit all required
                documents.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <Image
                  src="/step2-icon.svg"
                  alt="Step 2"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-700">
                Entrance Examination
              </h3>
              <p className="text-gray-700">
                Take the entrance examination to assess your academic readiness.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <Image
                  src="/step3-icon.svg"
                  alt="Step 3"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-700">
                Interview & Enrollment
              </h3>
              <p className="text-gray-700">
                Attend an interview and complete the enrollment process upon
                acceptance.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="#"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300 font-medium text-lg"
            >
              Start Your Application
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Offered */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Programs Offered</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of academic programs designed to
              prepare you for success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Science & Technology
              </h3>
              <p className="text-gray-600 mb-1">Duration: 4 Years</p>
              <p className="text-gray-600 mb-6">Available Seats: 120</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">4 Years</span>
                <Link
                  href="/apply"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-md font-medium transition duration-300"
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Commerce & Management
              </h3>
              <p className="text-gray-600 mb-1">Duration: 3 Years</p>
              <p className="text-gray-600 mb-6">Available Seats: 100</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">3 Years</span>
                <Link
                  href="/apply"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-md font-medium transition duration-300"
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Arts & Humanities
              </h3>
              <p className="text-gray-600 mb-1">Duration: 3 Years</p>
              <p className="text-gray-600 mb-6">Available Seats: 80</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">3 Years</span>
                <Link
                  href="/apply"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-md font-medium transition duration-300"
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Engineering
              </h3>
              <p className="text-gray-600 mb-1">Duration: 4 Years</p>
              <p className="text-gray-600 mb-6">Available Seats: 150</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">4 Years</span>
                <Link
                  href="/apply"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-md font-medium transition duration-300"
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Medical Sciences
              </h3>
              <p className="text-gray-600 mb-1">Duration: 5 Years</p>
              <p className="text-gray-600 mb-6">Available Seats: 60</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">5 Years</span>
                <Link
                  href="/apply"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-md font-medium transition duration-300"
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Law</h3>
              <p className="text-gray-600 mb-1">Duration: 3 Years</p>
              <p className="text-gray-600 mb-6">Available Seats: 40</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">3 Years</span>
                <Link
                  href="/apply"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-md font-medium transition duration-300"
                >
                  Apply Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
