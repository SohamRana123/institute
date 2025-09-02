"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherLayout from "@/components/TeacherLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";

export default function TeacherCurriculum() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState([]);
  const [curriculumItems, setCurriculumItems] = useState([]);
  
  // Fetch courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchApi("/api/courses");
        if (response.ok) {
          setCourses(response.data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Fetch existing curriculum items
  useEffect(() => {
    const fetchCurriculumItems = async () => {
      try {
        const response = await fetchApi("/api/curriculum");
        if (response.ok) {
          setCurriculumItems(response.data.items);
        }
      } catch (err) {
        console.error("Error fetching curriculum items:", err);
      }
    };
    
    fetchCurriculumItems();
  }, [success]); // Refetch when a new item is successfully added
  
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
    if (!title || !fileUrl || !year || !semester) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetchApi("/api/curriculum", {
        method: "POST",
        body: JSON.stringify({
          title,
          courseId: courseId || undefined, // Only include if selected
          fileUrl,
          year: parseInt(year),
          semester
        }),
      });
      
      if (response.ok) {
        setSuccess("Curriculum item added successfully!");
        // Reset form
        setTitle("");
        setCourseId("");
        setFileUrl("");
        setYear("");
        setSemester("");
      } else {
        setError(response.message || "Failed to add curriculum item");
      }
    } catch (err) {
      setError("An error occurred while adding the curriculum item");
      console.error("Error adding curriculum item:", err);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Manage Curriculum</h1>
        
        {/* Add Curriculum Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Add New Curriculum Item</h2>
          
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
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title *
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseId">
                  Course (Optional)
                </label>
                <select
                  id="courseId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Select a course (optional)</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                  Year *
                </label>
                <input
                  id="year"
                  type="number"
                  min="2000"
                  max="2100"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
                  Semester *
                </label>
                <select
                  id="semester"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  <option value="">Select a semester</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
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
                  Enter a URL to the curriculum file (PDF, DOC, etc.)
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
                  "Add Curriculum Item"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* List of Curriculum Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Existing Curriculum Items</h2>
          
          {curriculumItems.length === 0 ? (
            <p className="text-gray-500">No curriculum items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {curriculumItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-4 border-b border-gray-200">
                        {item.title}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-200">
                        {item.year}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-200">
                        {item.semester}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-200">
                        <a
                          href={item.fileUrl}
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