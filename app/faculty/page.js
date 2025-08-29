"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Faculty() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  // Sample faculty data
  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      position: "Professor & Department Head",
      department: "Computer Science",
      education: "Ph.D. in Computer Science, MIT",
      research: "Artificial Intelligence, Machine Learning, Computer Vision",
      email: "sarah.johnson@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      position: "Associate Professor",
      department: "Electronics Engineering",
      education: "Ph.D. in Electrical Engineering, Stanford University",
      research: "Semiconductor Devices, VLSI Design, Embedded Systems",
      email: "michael.chen@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      position: "Assistant Professor",
      department: "Data Science",
      education: "Ph.D. in Statistics, UC Berkeley",
      research: "Big Data Analytics, Statistical Learning, Data Visualization",
      email: "emily.rodriguez@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 4,
      name: "Prof. David Wilson",
      position: "Professor",
      department: "Computer Science",
      education: "Ph.D. in Computer Science, Carnegie Mellon University",
      research: "Cybersecurity, Cryptography, Network Security",
      email: "david.wilson@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 5,
      name: "Dr. Priya Sharma",
      position: "Associate Professor",
      department: "Artificial Intelligence",
      education: "Ph.D. in Computer Science, ETH Zurich",
      research:
        "Natural Language Processing, Deep Learning, Cognitive Computing",
      email: "priya.sharma@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 6,
      name: "Dr. James Taylor",
      position: "Assistant Professor",
      department: "Software Engineering",
      education: "Ph.D. in Software Engineering, University of Toronto",
      research: "Software Architecture, DevOps, Agile Methodologies",
      email: "james.taylor@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
  ];

  // Department filters
  const departments = [
    "All Departments",
    "Computer Science",
    "Electronics Engineering",
    "Data Science",
    "Artificial Intelligence",
    "Software Engineering",
  ];

  return (
    <>
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">Our Faculty</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Meet our distinguished faculty members who are dedicated to academic
            excellence and innovation in education.
          </p>
        </div>
      </section>

      {/* Department Filter Section */}
      <section className="py-8 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => setSelectedDepartment(department)}
                className={`px-6 py-2 rounded-full transition duration-300 ${
                  department === selectedDepartment
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                }`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Members Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers
              .filter(
                (faculty) =>
                  selectedDepartment === "All Departments" ||
                  faculty.department === selectedDepartment
              )
              .map((faculty) => (
                <div
                  key={faculty.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {faculty.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-2">
                      {faculty.position}
                    </p>
                    <p className="text-gray-600 mb-4">{faculty.department}</p>
                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Education:</span>
                        {faculty.education}
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Research:</span>
                        {faculty.research}
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        {faculty.email}
                      </p>
                    </div>
                    <Link
                      href="#"
                      className="inline-block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      View Full Profile
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
