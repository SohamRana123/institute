"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();
      
      if (data.ok) {
        setCourses(data.data.courses);
        setFilteredCourses(data.data.courses);
      } else {
        setError(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = (filter) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.semester?.toLowerCase().includes(filter.toLowerCase()) ||
        course.status?.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Institute of Technology</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:underline">
                  Faculty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Courses</h1>
          <p className="text-gray-600">
            Explore our comprehensive range of academic programs designed to
            prepare you for success in the technology sector.
          </p>
        </div>

        {/* Course Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter by Semester</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => filterCourses("all")}
              className={`px-4 py-2 rounded-full hover:bg-blue-200 ${
                activeFilter === "all" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => filterCourses("fall")}
              className={`px-4 py-2 rounded-full hover:bg-blue-200 ${
                activeFilter === "fall" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Fall
            </button>
            <button 
              onClick={() => filterCourses("spring")}
              className={`px-4 py-2 rounded-full hover:bg-blue-200 ${
                activeFilter === "spring" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Spring
            </button>
            <button 
              onClick={() => filterCourses("summer")}
              className={`px-4 py-2 rounded-full hover:bg-blue-200 ${
                activeFilter === "summer" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Summer
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Course Listings */}
        {!loading && !error && (
          <>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No courses found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-blue-50 p-4 border-b">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                        {course.semester} {course.year}
                      </span>
                      <h3 className="text-xl font-bold">{course.name}</h3>
                      <p className="text-gray-600">Code: {course.code} | Credits: {course.credits}</p>
                      {course.teacher && (
                        <p className="text-sm text-gray-500">Teacher: {course.teacher.firstName} {course.teacher.lastName}</p>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="mb-4">{course.description || "No description available"}</p>
                      <div className="flex justify-between items-center">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          course.status === "ACTIVE" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {course.status}
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Application CTA */}
        <div className="mt-12 bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Applications are now open for the upcoming academic year. Join our
            community of innovators and future tech leaders.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8" style={{ color: "#000" }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Institute of Technology
              </h3>
              <p>Providing quality education since 2000</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:underline">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic">
                <p>123 Education Street</p>
                <p>Knowledge City, KN 12345</p>
                <p>Email: info@institute.edu</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">
                  Facebook
                </a>
                <a href="#" className="hover:text-blue-400">
                  Twitter
                </a>
                <a href="#" className="hover:text-blue-400">
                  Instagram
                </a>
                <a href="#" className="hover:text-blue-400">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>
              &copy; {new Date().getFullYear()} Institute of Technology. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
