"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Curriculum() {
  const programs = [
    {
      id: 1,
      name: "Computer Science & Engineering",
      semesters: [
        {
          name: "Semester 1",
          courses: [
            "Introduction to Programming",
            "Digital Logic Design",
            "Mathematics I",
            "Physics",
            "English Communication",
          ],
        },
        {
          name: "Semester 2",
          courses: [
            "Object Oriented Programming",
            "Data Structures",
            "Mathematics II",
            "Electronics",
            "Professional Ethics",
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Electronics Engineering",
      semesters: [
        {
          name: "Semester 1",
          courses: [
            "Basic Electronics",
            "Circuit Theory",
            "Mathematics I",
            "Physics",
            "Engineering Drawing",
          ],
        },
        {
          name: "Semester 2",
          courses: [
            "Digital Electronics",
            "Network Analysis",
            "Mathematics II",
            "Programming Fundamentals",
            "Communication Skills",
          ],
        },
      ],
    },
  ];

  return (
    <>
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">Curriculum</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive course structure designed for academic excellence
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-blue-600 text-white p-6">
                  <h3 className="text-2xl font-bold">{program.name}</h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {program.semesters.map((semester, index) => (
                      <div key={index} className="space-y-4">
                        <h4 className="text-xl font-semibold text-blue-600">
                          {semester.name}
                        </h4>
                        <ul className="space-y-2">
                          {semester.courses.map((course, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-gray-700"
                            >
                              <svg
                                className="w-5 h-5 text-blue-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    View Full Curriculum
                    <svg
                      className="w-5 h-5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
