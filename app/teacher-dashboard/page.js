"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  coursesAPI,
  performanceAPI,
  enrollmentsAPI,
  admissionsAPI,
  booksAPI,
  authAPI,
} from "@/lib/api";

export default function TeacherDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [admissionApplications, setAdmissionApplications] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    description: "",
    credits: "",
    semester: "",
    year: "",
    maxStudents: "",
  });

  const [newPerformance, setNewPerformance] = useState({
    studentId: "",
    courseId: "",
    examType: "MIDTERM",
    score: "",
    maxScore: "",
    comments: "",
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch teacher's courses
      const coursesData = await coursesAPI.getCourses({ teacherId: user?.id });
      setCourses(coursesData.courses || []);

      // Fetch enrollments for teacher's courses
      const enrollmentsData = await enrollmentsAPI.getEnrollments();
      setEnrollments(enrollmentsData.enrollments || []);

      // Fetch performance records
      const performanceData = await performanceAPI.getPerformance();
      setPerformanceRecords(performanceData.records || []);

      // If user is admin, fetch additional data
      if (user?.role === "ADMIN") {
        // Fetch admission applications
        const admissionsData = await admissionsAPI.getApplications();
        setAdmissionApplications(admissionsData.applications || []);

        // Fetch books inventory
        const booksData = await booksAPI.getBooks();
        setBooks(booksData.books || []);

        // Fetch all users
        const usersData = await authAPI.getUsers();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      setError("Failed to load dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleCreateCourse = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await coursesAPI.createCourse(newCourse);
        setNewCourse({
          code: "",
          title: "",
          description: "",
          credits: "",
          semester: "",
          year: "",
          maxStudents: "",
        });
        fetchDashboardData();
      } catch (err) {
        setError("Failed to create course: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [newCourse, fetchDashboardData]
  );

  const handleAddPerformance = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await performanceAPI.addPerformance(newPerformance);
        setNewPerformance({
          studentId: "",
          courseId: "",
          examType: "MIDTERM",
          score: "",
          maxScore: "",
          comments: "",
        });
        fetchDashboardData();
      } catch (err) {
        setError("Failed to add performance record: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [newPerformance, fetchDashboardData]
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  const handleUpdateApplicationStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      setError("");
      try {
        await admissionsAPI.updateApplicationStatus(id, status);
        fetchDashboardData();
      } catch (err) {
        setError("Failed to update application status: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchDashboardData]
  );

  const handleToggleUserStatus = useCallback(
    async (userId) => {
      setLoading(true);
      setError("");
      try {
        await authAPI.toggleUserStatus(userId);
        fetchDashboardData();
      } catch (err) {
        setError("Failed to update user status: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchDashboardData]
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (
        !isAuthenticated ||
        !(user?.role === "TEACHER" || user?.role === "ADMIN")
      ) {
        router.push("/teacher-login");
        return;
      }
      try {
        await fetchDashboardData();
      } catch (err) {
        if (err.message.includes("Authentication required")) {
          router.push("/teacher-login");
        }
      }
    };
    checkAuth();
  }, [isAuthenticated, user, router, fetchDashboardData]);

  if (
    !isAuthenticated ||
    !(user?.role === "TEACHER" || user?.role === "ADMIN")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", name: "Overview" },
              { id: "courses", name: "My Courses" },
              { id: "students", name: "Students" },
              { id: "performance", name: "Performance" },
              { id: "add-course", name: "Add Course" },
              { id: "add-performance", name: "Add Performance" },
              ...(user?.role === "ADMIN"
                ? [
                    { id: "admissions", name: "Admission Applications" },
                    { id: "book-store", name: "Book Store" },
                    { id: "user-management", name: "User Management" },
                  ]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Total Courses
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {courses.length}
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900">
                    Total Students
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {enrollments.length}
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900">
                    Performance Records
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {performanceRecords.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                My Courses
              </h2>
              {courses.length === 0 ? (
                <p className="text-gray-500">No courses found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Code: {course.code}
                      </p>
                      <p className="text-gray-700 mb-4">{course.description}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Credits: {course.credits}</span>
                        <span>Semester: {course.semester}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span>Year: {course.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enrolled Students
              </h2>
              {enrollments.length === 0 ? (
                <p className="text-gray-500">No enrollments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.student?.firstName}{" "}
                              {enrollment.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.student?.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {enrollment.course?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.course?.code}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                enrollment.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {enrollment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === "performance" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Performance Records
              </h2>
              {performanceRecords.length === 0 ? (
                <p className="text-gray-500">No performance records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {performanceRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {record.student?.firstName}{" "}
                              {record.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.student?.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {record.course?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.course?.code}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.examType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {record.score}/{record.maxScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round(
                                (record.score / record.maxScore) * 100
                              )}
                              %
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.examDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Add Course Tab */}
          {activeTab === "add-course" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Course
              </h2>
              <form
                onSubmit={handleCreateCourse}
                className="max-w-2xl space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.code}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, code: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CS101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Course description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits
                    </label>
                    <input
                      type="number"
                      required
                      value={newCourse.credits}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, credits: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      required
                      value={newCourse.semester}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, semester: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Semester</option>
                      <option value="FALL">Fall</option>
                      <option value="SPRING">Spring</option>
                      <option value="SUMMER">Summer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      required
                      value={newCourse.year}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, year: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Students
                    </label>
                    <input
                      type="number"
                      required
                      value={newCourse.maxStudents}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          maxStudents: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="30"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </form>
            </div>
          )}

          {/* Add Performance Tab */}
          {activeTab === "add-performance" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add Performance Record
              </h2>
              <form
                onSubmit={handleAddPerformance}
                className="max-w-2xl space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      required
                      value={newPerformance.studentId}
                      onChange={(e) =>
                        setNewPerformance({
                          ...newPerformance,
                          studentId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Student ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course ID
                    </label>
                    <input
                      type="text"
                      required
                      value={newPerformance.courseId}
                      onChange={(e) =>
                        setNewPerformance({
                          ...newPerformance,
                          courseId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Course ID"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Type
                    </label>
                    <select
                      required
                      value={newPerformance.examType}
                      onChange={(e) =>
                        setNewPerformance({
                          ...newPerformance,
                          examType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MIDTERM">Midterm</option>
                      <option value="FINAL">Final</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="ASSIGNMENT">Assignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score
                    </label>
                    <input
                      type="number"
                      required
                      value={newPerformance.score}
                      onChange={(e) =>
                        setNewPerformance({
                          ...newPerformance,
                          score: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="85"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Score
                    </label>
                    <input
                      type="number"
                      required
                      value={newPerformance.maxScore}
                      onChange={(e) =>
                        setNewPerformance({
                          ...newPerformance,
                          maxScore: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={newPerformance.comments}
                    onChange={(e) =>
                      setNewPerformance({
                        ...newPerformance,
                        comments: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional comments..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add Performance Record"}
                </button>
              </form>
            </div>
          )}

          {/* Admissions Tab - Admin Only */}
          {activeTab === "admissions" && user?.role === "ADMIN" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Admission Applications
              </h2>
              {admissionApplications.length === 0 ? (
                <p className="text-gray-500">
                  No admission applications found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applicant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admissionApplications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {application.firstName} {application.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {application.course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                application.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : application.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {application.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateApplicationStatus(
                                        application.id,
                                        "APPROVED"
                                      )
                                    }
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateApplicationStatus(
                                        application.id,
                                        "REJECTED"
                                      )
                                    }
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Book Store Tab - Admin Only */}
          {activeTab === "book-store" && user?.role === "ADMIN" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Store Management
              </h2>
              <div className="mb-8">
                <button
                  onClick={() => {
                    /* TODO: Add new book dialog */
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Book
                </button>
              </div>
              {books.length === 0 ? (
                <p className="text-gray-500">No books found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Author: {book.author}
                      </p>
                      <p className="text-gray-700 mb-4">{book.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          ₹{book.price}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            book.stock > 10
                              ? "bg-green-100 text-green-800"
                              : book.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          Stock: {book.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Management Tab - Admin Only */}
          {activeTab === "user-management" && user?.role === "ADMIN" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                User Management
              </h2>
              {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "TEACHER"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`text-sm font-medium ${
                                user.isActive
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
