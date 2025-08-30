"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { performanceAPI } from "@/lib/api";

export default function StudentPerformance() {
  const { user, isAuthenticated, login } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(loginForm);
      if (result.success) {
        setShowLogin(false);
        fetchPerformanceData();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const data = await performanceAPI.getPerformance();
      setPerformanceData(data);
    } catch (error) {
      setError("Failed to load performance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && user?.role === "STUDENT") {
      setShowLogin(false);
      fetchPerformanceData();
    }
  }, [user, isAuthenticated]);

  const renderPerformanceCard = (performance) => (
    <div key={performance.id} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {performance.examType}
          </h3>
          <p className="text-gray-600 text-sm">
            {new Date(performance.examDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {((performance.score / performance.maxScore) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">
            {performance.score}/{performance.maxScore}
          </div>
        </div>
      </div>
      {performance.remarks && (
        <p className="text-gray-700 text-sm italic">"{performance.remarks}"</p>
      )}
    </div>
  );

  const renderStatistics = (stats) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <div className="text-3xl font-bold text-blue-600">
          {stats.totalExams}
        </div>
        <div className="text-gray-600">Total Exams</div>
      </div>
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <div className="text-3xl font-bold text-green-600">
          {stats.averageScore}%
        </div>
        <div className="text-gray-600">Average Score</div>
      </div>
      <div className="bg-purple-50 p-6 rounded-lg text-center">
        <div className="text-3xl font-bold text-purple-600">
          {stats.averageScore >= 90
            ? "A"
            : stats.averageScore >= 80
            ? "B"
            : stats.averageScore >= 70
            ? "C"
            : stats.averageScore >= 60
            ? "D"
            : "F"}
        </div>
        <div className="text-gray-600">Grade</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Student Performance
          </h2>
          <p className="text-xl text-violet-100">
            Track your academic progress and performance metrics
          </p>
        </div>
      </section>

      {/* Login Section */}
      {showLogin && (
        <section className="py-16 bg-gray-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="bg-violet-600 p-4 rounded-lg">
                <span className="text-white text-2xl font-bold">VK</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
              Student Performance Portal
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Login to view your academic performance
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-3 px-4 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-300 font-medium disabled:opacity-50"
              >
                {loading ? "Loading..." : "View Performance"}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Test Account: alice.johnson@student.com / student123
                </p>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Performance Dashboard */}
      {!showLogin && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Performance Dashboard
                </h2>
                <div className="text-right">
                  <p className="text-gray-600">
                    Welcome, {user?.student?.firstName || user?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Student ID: {user?.student?.id}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Loading performance data...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : performanceData ? (
                <>
                  {/* Statistics */}
                  {renderStatistics(performanceData.statistics)}

                  {/* Performance Records */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">
                      Recent Performance Records
                    </h3>

                    {performanceData.performances.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {performanceData.performances.map(
                          renderPerformanceCard
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">
                          No performance records found.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Your teachers will add performance records as you
                          complete exams and assignments.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Exam Type Breakdown */}
                  {performanceData.statistics.examTypeStats &&
                    Object.keys(performanceData.statistics.examTypeStats)
                      .length > 0 && (
                      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">
                          Performance by Exam Type
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(
                            performanceData.statistics.examTypeStats
                          ).map(([type, stats]) => (
                            <div
                              key={type}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <h4 className="font-semibold text-gray-800 mb-2">
                                {type}
                              </h4>
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {stats.average.toFixed(1)}%
                              </div>
                              <div className="text-sm text-gray-600">
                                {stats.count} exam{stats.count !== 1 ? "s" : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
