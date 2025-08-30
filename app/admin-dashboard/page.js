"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  admissionsAPI,
  coursesAPI,
  performanceAPI,
  enrollmentsAPI,
  booksAPI,
} from "@/lib/api";

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [books, setBooks] = useState([]);

  // Form states
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/teacher-login");
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all data for admin overview
      const [
        admissionsData,
        coursesData,
        enrollmentsData,
        performanceData,
        booksData,
      ] = await Promise.all([
        admissionsAPI.getApplications(),
        coursesAPI.getCourses(),
        enrollmentsAPI.getEnrollments(),
        performanceAPI.getPerformance(),
        booksAPI.getBooks(),
      ]);

      setAdmissions(admissionsData.applications || []);
      setCourses(coursesData.courses || []);
      setEnrollments(enrollmentsData.enrollments || []);
      setPerformanceRecords(performanceData.records || []);
      setBooks(booksData.books || []);
    } catch (err) {
      setError("Failed to load dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await booksAPI.addBook(newBook);
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        category: "",
        price: "",
        stock: "",
        description: "",
      });
      fetchDashboardData();
    } catch (err) {
      setError("Failed to add book: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || user?.role !== "ADMIN") {
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
                Admin Dashboard
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
              { id: "admissions", name: "Admissions" },
              { id: "courses", name: "Courses" },
              { id: "students", name: "Students" },
              { id: "performance", name: "Performance" },
              { id: "books", name: "Book Store" },
              { id: "add-book", name: "Add Book" },
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
                System Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Admission Applications
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {admissions.length}
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    {admissions.filter((a) => a.status === "PENDING").length}{" "}
                    pending
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900">
                    Total Courses
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {courses.length}
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    {courses.filter((c) => c.status === "ACTIVE").length} active
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900">
                    Total Students
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {enrollments.length}
                  </p>
                  <p className="text-sm text-purple-700 mt-2">
                    {enrollments.filter((e) => e.status === "ACTIVE").length}{" "}
                    enrolled
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900">
                    Books in Store
                  </h3>
                  <p className="text-3xl font-bold text-orange-600">
                    {books.length}
                  </p>
                  <p className="text-sm text-orange-700 mt-2">
                    {books.filter((b) => b.stock > 0).length} in stock
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admissions Tab */}
          {activeTab === "admissions" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Admission Applications
              </h2>
              {admissions.length === 0 ? (
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
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admissions.map((admission) => (
                        <tr key={admission.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {admission.firstName} {admission.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              DOB:{" "}
                              {new Date(
                                admission.dateOfBirth
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {admission.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {admission.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {admission.course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(admission.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                admission.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : admission.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {admission.status}
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

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Courses
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
                      <div className="mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.status}
                        </span>
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
                All Students
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
                All Performance Records
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

          {/* Books Tab */}
          {activeTab === "books" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Store Inventory
              </h2>
              {books.length === 0 ? (
                <p className="text-gray-500">No books found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        By: {book.author}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        ISBN: {book.isbn}
                      </p>
                      <p className="text-gray-700 mb-4">{book.description}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Category: {book.category}</span>
                        <span>Price: ${book.price}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span>Stock: {book.stock} units</span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            book.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add Book Tab */}
          {activeTab === "add-book" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Book
              </h2>
              <form onSubmit={handleAddBook} className="max-w-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.title}
                      onChange={(e) =>
                        setNewBook({ ...newBook, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.author}
                      onChange={(e) =>
                        setNewBook({ ...newBook, author: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.isbn}
                      onChange={(e) =>
                        setNewBook({ ...newBook, isbn: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 978-0-123456-47-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      required
                      value={newBook.category}
                      onChange={(e) =>
                        setNewBook({ ...newBook, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="TEXTBOOK">Textbook</option>
                      <option value="REFERENCE">Reference</option>
                      <option value="FICTION">Fiction</option>
                      <option value="NON_FICTION">Non-Fiction</option>
                      <option value="ACADEMIC">Academic</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newBook.price}
                      onChange={(e) =>
                        setNewBook({ ...newBook, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      value={newBook.stock}
                      onChange={(e) =>
                        setNewBook({ ...newBook, stock: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBook.description}
                    onChange={(e) =>
                      setNewBook({ ...newBook, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Book description..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add Book"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
