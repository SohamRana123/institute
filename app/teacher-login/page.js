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
  const [message, setMessage] = useState(null);
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

    // Validate form data before submission
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // Call login function
      const result = await login(formData);

      // Handle login failure
      if (!result.success || result.error) {
        setError(result.error || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Handle redirection based on response from AuthContext
      console.log("Login successful, handling redirection");
      
      const allowedRoles = ["ADMIN", "TEACHER"];
      if (allowedRoles.includes(result.data.user.role)) {
        console.log("Redirecting to teacher dashboard...");
        
        // Set success message first
        setMessage({
          type: "success",
          text: "Login successful! Redirecting to dashboard...",
          link: "/teacher-dashboard"
        });
        
        // Debug log to confirm cookie is set
        console.log("Cookies before redirect:", document.cookie);
        
        // Force a longer delay to ensure cookie is properly set and state is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Store auth state in localStorage for cross-tab sync
        localStorage.setItem('auth_state_change', Date.now().toString());
        
        // Use window.location for hard navigation instead of router.push
        // This ensures a full page reload and fresh authentication state
        window.location.href = "/teacher-dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
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
          
          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`}>
              {message.link ? (
                <>
                  {message.text}{" "}
                  <a href={message.link} className="font-medium underline">
                    Click here
                  </a>
                </>
              ) : (
                message.text
              )}
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
              {loading ? "Logging In..." : "Log In"}
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
                Test Account: teacher@institute.com / password123
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
