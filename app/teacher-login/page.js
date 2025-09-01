"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TeacherLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Teacher login - submitting form data:", formData.email);
      const result = await login(formData);
      console.log("Teacher login - login result:", result);

      if (result.success === false || result.error) {
        console.log("Teacher login - login failed:", result.error);
        setError(result.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      console.log(
        "Teacher login - login successful, user role:",
        result.data.user.role
      );
      // Redirect to teacher dashboard for allowed roles
      const allowedRoles = ["ADMIN", "TEACHER"];
      if (allowedRoles.includes(result.data.user.role)) {
        console.log("Teacher login - redirecting to dashboard");
        // Add a small delay to ensure token is properly stored
        setTimeout(() => {
          // Check if we have a stored redirect to prevent loops
          const lastRedirect =
            typeof window !== "undefined"
              ? sessionStorage.getItem("lastRedirect")
              : null;
          console.log("Last redirect was:", lastRedirect);

          // Clear the stored redirect
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("lastRedirect");
          }

          // If the last redirect was from the dashboard, don't redirect back to it
          if (lastRedirect === "/teacher-dashboard") {
            console.log("Preventing redirect loop to dashboard");
            return;
          }

          router.push("/teacher-dashboard");
        }, 100);
      } else {
        console.log("Teacher login - redirecting to home");
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Teacher Login Section */}
      <section className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-lg">
              <span className="text-white text-2xl font-bold">VK</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-black">
            Teacher Login
          </h2>
          <p className="text-gray-600 text-center mb-6">
            <span className="text-black">Access your teaching dashboard</span>
          </p>
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p className="text-sm">Demo credentials:</p>
            <p className="text-sm">Email: teacher@institute.com</p>
            <p className="text-sm">Password: password123</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-black text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-black text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-black"
                >
                  Remember me
                </label>
              </div>

              <div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 font-medium disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&#39;t have an account?{" "}
                <Link
                  href="/teacher-register"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Apply to become a teacher
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Test Account: teacher@institute.com / admin123
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
