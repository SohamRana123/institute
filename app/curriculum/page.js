"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Curriculum() {
  const [curriculumData, setCurriculumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default static data as fallback
  const defaultPrograms = [
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
  
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/curriculum');
        
        if (!response.ok) {
          throw new Error('Failed to fetch curriculum data');
        }
        
        const data = await response.json();
        if (data.ok && data.data) {
          setCurriculumData(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch curriculum data');
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurriculum();
  }, []);
  
  // Use the API data or fall back to default data
  const programs = curriculumData?.grouped ? Object.entries(curriculumData.grouped).map(([year, semesters]) => ({
    id: year,
    name: `Academic Year ${year}`,
    semesters: Object.entries(semesters).map(([semester, items]) => ({
      name: `${semester} Semester`,
      courses: items.map(item => item.title),
      documents: items.map(item => ({
        title: item.title,
        url: item.fileUrl
      }))
    }))
  })) : defaultPrograms;

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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
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
                          
                          {/* Display downloadable files if available */}
                          {semester.documents && semester.documents.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                              <h5 className="text-md font-medium text-blue-600 mb-2">Course Materials:</h5>
                              <ul className="space-y-2">
                                {semester.documents.map((doc, docIndex) => (
                                  <li key={docIndex} className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    <a 
                                      href={doc.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {doc.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
