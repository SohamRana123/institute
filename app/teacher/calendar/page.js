"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherLayout from "@/components/TeacherLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";

export default function TeacherCalendar() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  // Fetch existing calendar events
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await fetchApi("/api/calendar");
        if (response.ok) {
          setCalendarEvents(response.data);
        }
      } catch (err) {
        console.error("Error fetching calendar events:", err);
      }
    };
    
    fetchCalendarEvents();
  }, [success]); // Refetch when a new event is successfully added
  
  // Redirect if not authenticated or not a teacher/admin
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "TEACHER" && user.role !== "ADMIN"))) {
      router.push("/teacher-login");
    }
  }, [user, authLoading, router]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    // Validate form
    if (!title || !fileUrl || !startDate || !endDate) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Invalid date format");
      setLoading(false);
      return;
    }
    
    if (start > end) {
      setError("Start date must be before end date");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetchApi("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          title,
          fileUrl,
          startDate: start.toISOString(),
          endDate: end.toISOString()
        }),
      });
      
      if (response.ok) {
        setSuccess("Calendar event added successfully!");
        // Reset form
        setTitle("");
        setFileUrl("");
        setStartDate("");
        setEndDate("");
      } else {
        setError(response.message || "Failed to add calendar event");
      }
    } catch (err) {
      setError("An error occurred while adding the calendar event");
      console.error("Error adding calendar event:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (authLoading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </TeacherLayout>
    );
  }
  
  return (
    <TeacherLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Manage Academic Calendar</h1>
        
        {/* Add Calendar Event Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Add New Calendar Event</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Event Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileUrl">
                  File URL *
                </label>
                <input
                  id="fileUrl"
                  type="url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a URL to the calendar document file (PDF, DOC, etc.)
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Add Calendar Event"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* List of Calendar Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Existing Calendar Events</h2>
          
          {calendarEvents.length === 0 ? (
            <p className="text-gray-500">No calendar events found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calendarEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="py-4 px-4 border-b border-gray-200">
                        {event.title}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-200">
                        {formatDate(event.startDate)}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-200">
                        {formatDate(event.endDate)}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-200">
                        <a
                          href={event.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View File
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}