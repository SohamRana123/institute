"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// API imports - use the correct API functions
import { apiRequest } from "@/lib/api";

export default function TeacherDashboard() {
  const {
    user,
    isAuthenticated,
    logout,
    loading: authLoading,
    initialized,
  } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // State management with proper loading states
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    enrollments: [],
    performanceRecords: [],
    admissionApplications: [],
    books: [],
    users: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    courses: false,
    enrollments: false,
    performance: false,
    admissions: false,
    books: false,
    users: false,
  });

  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (initialized && !authLoading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        // Debug cookies before redirect
        console.log("Cookies before redirect:", document.cookie);
        
        // Use window.location for hard navigation instead of router.push
        // This ensures a full page reload and fresh authentication state
        window.location.href = "/teacher-login";
        return;
      } else {
        console.log("User authenticated, fetching dashboard data");
        console.log("User data:", user);
        console.log("Cookies in dashboard:", document.cookie);
        fetchDashboardData();
      }
    }
  }, [initialized, authLoading, isAuthenticated, user, fetchDashboardData]);

  // Memoized data fetching functions to prevent unnecessary re-renders
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    setError("");
    setIsInitialLoad(true);
    setLoading(true);

    try {
      // Fetch all data in parallel for better performance
      const [
        coursesResponse,
        enrollmentsResponse,
        performanceResponse,
        admissionsResponse,
        booksResponse,
        usersResponse,
      ] = await Promise.allSettled([
        apiRequest("/courses?teacherId=" + user.id),
        apiRequest("/enrollments"),
        apiRequest("/performance"),
        apiRequest("/admissions"),
        apiRequest("/books"),
        apiRequest("/auth/users"),
      ]);

      // Update state with results, handling both success and failure
      setDashboardData({
        courses:
          coursesResponse.status === "fulfilled" && !coursesResponse.value.error
            ? coursesResponse.value.courses || []
            : [],
        enrollments:
          enrollmentsResponse.status === "fulfilled" &&
          !enrollmentsResponse.value.error
            ? enrollmentsResponse.value.enrollments || []
            : [],
        performanceRecords:
          performanceResponse.status === "fulfilled" &&
          !performanceResponse.value.error
            ? performanceResponse.value.records || []
            : [],
        admissionApplications:
          admissionsResponse.status === "fulfilled" &&
          !admissionsResponse.value.error
            ? admissionsResponse.value.applications || []
            : [],
        books:
          booksResponse.status === "fulfilled" && !booksResponse.value.error
            ? booksResponse.value.books || []
            : [],
        users:
          usersResponse.status === "fulfilled" && !usersResponse.value.error
            ? usersResponse.value.users || []
            : [],
      });

      // Log any failed requests
      const failedRequests = [
        { name: "courses", result: coursesResponse },
        { name: "enrollments", result: enrollmentsResponse },
        { name: "performance", result: performanceResponse },
        { name: "admissions", result: admissionsResponse },
        { name: "books", result: booksResponse },
        { name: "users", result: usersResponse },
      ].filter(
        (req) =>
          req.result.status === "rejected" ||
          (req.result.status === "fulfilled" && req.result.value.error)
      );

      if (failedRequests.length > 0) {
        console.warn("Some dashboard data failed to load:", failedRequests);
        const errorMessages = failedRequests.map((req) => {
          if (req.result.status === "rejected") {
            return `${req.name}: ${req.result.reason}`;
          } else {
            return `${req.name}: ${req.result.value.error}`;
          }
        });
        setError(`Failed to load: ${errorMessages.join(", ")}`);
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setIsInitialLoad(false);
      setLoading(false);
    }
  }, [user?.id]);

  // Authentication check with proper loading states
  useEffect(() => {
    if (authLoading || !initialized) {
      return;
    }

    let isMounted = true;

    const checkAuth = async () => {
      console.log("Dashboard auth check - isAuthenticated:", isAuthenticated, "user:", user);
      
      if (!isAuthenticated || !user) {
        console.log("Dashboard - Not authenticated, redirecting to login");
        if (isMounted) {
          window.location.href = "/teacher-login";
        }
        return;
      }

      const allowedRoles = ["ADMIN", "TEACHER"];
      if (!allowedRoles.includes(user.role)) {
        console.log("Dashboard - User role not allowed:", user.role);
        if (isMounted) {
          window.location.href = "/teacher-login";
        }
        return;
      }

      console.log("Dashboard - User authenticated and authorized, fetching data");
      // Fetch dashboard data if authenticated (we're using HttpOnly cookies now)
      if (isMounted) {
        await fetchDashboardData();
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    user,
    router,
    fetchDashboardData,
    authLoading,
    initialized,
  ]);

  // Memoized computed values to prevent unnecessary recalculations
  const dashboardStats = useMemo(() => {
    const {
      courses,
      enrollments,
      performanceRecords,
      admissionApplications,
      books,
      users,
    } = dashboardData;

    return {
      totalCourses: courses.length,
      totalStudents: enrollments.length,
      totalPerformanceRecords: performanceRecords.length,
      pendingApplications: admissionApplications.filter(
        (app) => app.status === "PENDING"
      ).length,
      totalBooks: books.length,
      totalUsers: users.length,
      averagePerformance:
        performanceRecords.length > 0
          ? (
              performanceRecords.reduce(
                (sum, record) => sum + (record.score || 0),
                0
              ) / performanceRecords.length
            ).toFixed(1)
          : 0,
    };
  }, [dashboardData]);

  // Loading states
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show loading state while authentication is being checked
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated and has the right role
  if (
    !isAuthenticated ||
    (user?.role !== "ADMIN" && user?.role !== "TEACHER")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main dashboard content
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
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📚</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Courses
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.totalCourses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Performance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.averagePerformance}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📝</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Applications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.pendingApplications}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isInitialLoad && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {/* Dashboard Content when loaded */}
        {!isInitialLoad && (
          <div className="bg-white shadow rounded-lg">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview", icon: "📊" },
                  { id: "students", label: "Students", icon: "👥" },
                  { id: "admissions", label: "Admissions", icon: "📝" },
                  { id: "courses", label: "Courses", icon: "📚" },
                  { id: "performance", label: "Performance", icon: "📈" },
                  { id: "curriculum", label: "Curriculum", icon: "📖" },
                  { id: "calendar", label: "Calendar", icon: "📅" },
                  { id: "users", label: "Users", icon: "👤" },
                  { id: "teachers", label: "Teachers", icon: "👨‍🏫" },
                  { id: "books", label: "Books", icon: "📗" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Dashboard Overview
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Courses */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">
                        Recent Courses
                      </h4>
                      <div className="space-y-2">
                        {dashboardData.courses
                          .slice(0, 3)
                          .map((course, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-gray-50 rounded-md"
                            >
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs">📚</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {course.title || "Course Title"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {course.code || "Course Code"}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Recent Applications */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">
                        Recent Applications
                      </h4>
                      <div className="space-y-2">
                        {dashboardData.admissionApplications
                          .slice(0, 3)
                          .map((app, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-gray-50 rounded-md"
                            >
                              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs">📝</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {app.studentName || "Student Name"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {app.status || "Status"}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Management Tab */}
              {activeTab === "students" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Student Management
                  </h3>
                  <p className="text-gray-600">
                    Student management features will be implemented here.
                  </p>
                </div>
              )}

              {/* Admissions Tab */}
              {activeTab === "admissions" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Admission Applications
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Manage student admission applications and approve/reject
                      them.
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          (window.location.href = "/teacher/admissions")
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Manage Admissions
                      </button>
                      <button
                        onClick={() => (window.location.href = "/apply")}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View Application Form
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === "courses" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Course Management
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Create, edit, and manage your courses.
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => window.location.href = "/teacher/courses"}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Manage Courses
                      </button>
                      <button
                        onClick={() => window.location.href = "/courses"}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View Public Courses
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === "performance" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Student Results
                  </h3>
                  <p className="text-gray-600">
                    Performance management features will be implemented here.
                  </p>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === "curriculum" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Curriculum Management
                  </h3>
                  <p className="text-gray-600">
                    Curriculum management features will be implemented here.
                  </p>
                </div>
              )}

              {/* Academic Calendar Tab */}
              {activeTab === "calendar" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Academic Calendar
                  </h3>
                  <p className="text-gray-600">
                    Academic calendar features will be implemented here.
                  </p>
                </div>
              )}

              {/* User Management Tab */}
              {activeTab === "users" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    User Management
                  </h3>
                  <p className="text-gray-600">
                    User management features will be implemented here.
                  </p>
                </div>
              )}

              {/* Teachers Tab */}
              {activeTab === "teachers" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Teacher Management
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Review and manage teacher registration requests.
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          (window.location.href = "/teacher/manage-teachers")
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Manage Teachers
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = "/teacher-register")
                        }
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View Registration Form
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Store Tab */}
              {activeTab === "books" && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Book Store Management
                  </h3>
                  <p className="text-gray-600">
                    Book store management features will be implemented here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
