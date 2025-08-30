import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-24">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6 text-center">
            <span className="text-blue-600">Welcome to</span>{" "}
            <span className="text-blue-600">V.K. Institute</span>
          </h2>
          <p className="text-gray-600 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Empowering minds, shaping futures. Join us in our mission to provide
            world-class education and foster academic excellence in a nurturing
            environment.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/admissions"
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Apply Now
            </Link>
            <Link
              href="/student-performance"
              className="bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300 shadow-sm"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-white py-20 border-t border-b border-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-center mb-6">
            <span className="text-black">Why Choose V.K. Institute?</span>
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto text-lg">
            <span className="text-black">
              We provide comprehensive educational services designed to support
              every aspect of your academic journey.
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 border border-black">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/document-icon.svg"
                  alt="Admissions Icon"
                  width={32}
                  height={32}
                  className="text-blue-600"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Admissions
              </h3>
              <p className="text-gray-600">
                Start your journey with us. Easy application process and
                comprehensive admission guidance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 border border-black">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/user-icon.svg"
                  alt="Teacher Portal Icon"
                  width={32}
                  height={32}
                  className="text-green-600"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Teacher Portal
              </h3>
              <p className="text-gray-600">
                Secure access for faculty members to manage classes, grades, and
                student information.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 border border-black">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/chart-icon.svg"
                  alt="Student Performance Icon"
                  width={32}
                  height={32}
                  className="text-purple-600"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Student Performance
              </h3>
              <p className="text-gray-600">
                Track academic progress, view grades, and access performance
                analytics.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 border border-black">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/book-icon.svg"
                  alt="Book Store Icon"
                  width={32}
                  height={32}
                  className="text-orange-600"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Book Store
              </h3>
              <p className="text-gray-600">
                Purchase textbooks, reference materials, and educational
                resources online.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-10 border-t border-b border-black">
            <div className="py-6">
              <p className="text-4xl font-bold text-blue-600 mb-2">2,500+</p>
              <p className="text-gray-600 font-medium">Students</p>
            </div>
            <div className="py-6">
              <p className="text-4xl font-bold text-green-600 mb-2">150+</p>
              <p className="text-gray-600 font-medium">Faculty</p>
            </div>
            <div className="py-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">25+</p>
              <p className="text-gray-600 font-medium">Years</p>
            </div>
            <div className="py-6">
              <p className="text-4xl font-bold text-orange-600 mb-2">95%</p>
              <p className="text-gray-600 font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
