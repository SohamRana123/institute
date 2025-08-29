"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function AcademicCalendar() {
  const academicEvents = [
    {
      id: 1,
      month: "August 2025",
      events: [
        { date: "Aug 15", event: "Independence Day - Holiday" },
        { date: "Aug 20-25", event: "New Student Orientation" },
        { date: "Aug 28", event: "First Day of Classes" },
      ],
    },
    {
      id: 2,
      month: "September 2025",
      events: [
        { date: "Sep 5", event: "Teachers' Day Celebration" },
        { date: "Sep 15", event: "Mid-Semester Assessment Begins" },
        { date: "Sep 30", event: "Last Date for Course Withdrawal" },
      ],
    },
    {
      id: 3,
      month: "October 2025",
      events: [
        { date: "Oct 2", event: "Gandhi Jayanti - Holiday" },
        { date: "Oct 15-20", event: "Mid-Term Examinations" },
        { date: "Oct 24", event: "Dussehra - Holiday" },
      ],
    },
    {
      id: 4,
      month: "November 2025",
      events: [
        { date: "Nov 1", event: "Registration for Spring Semester Begins" },
        { date: "Nov 12", event: "Diwali - Holiday" },
        { date: "Nov 25", event: "Last Day of Regular Classes" },
      ],
    },
  ];

  return (
    <>
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Academic Calendar
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Important dates and events for the academic year 2025-26
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {academicEvents.map((month) => (
              <div
                key={month.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  {month.month}
                </h3>
                <div className="space-y-4">
                  {month.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-4 w-24 text-center">
                        {event.date}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Download Calendar Section */}
          <div className="mt-12 text-center">
            <Link
              href="#"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Full Calendar
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
