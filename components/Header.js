"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.svg"
              alt="V.K. Institute Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800">V.K. Institute</h1>
        </Link>
        <nav className="flex-1 flex justify-end">
          <ul className="flex space-x-8 items-center">
            <li>
              <Link
                href="/"
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${
                  pathname === "/"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/admissions"
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${
                  pathname === "/admissions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700"
                }`}
              >
                Admissions
              </Link>
            </li>
            {/* Authentication Links */}
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/teacher-login"
                    className={`hover:text-blue-600 transition-colors duration-200 font-medium ${
                      pathname === "/teacher-login"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    Teacher Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student-performance"
                    className={`hover:text-blue-600 transition-colors duration-200 font-medium ${
                      pathname === "/student-performance"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    Student Performance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/book-store"
                    className={`hover:text-blue-600 transition-colors duration-200 font-medium ${
                      pathname === "/book-store"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    Book Store
                  </Link>
                </li>
              </>
            ) : (
              <li className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.student?.firstName?.[0] ||
                      user?.teacher?.firstName?.[0] ||
                      user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span>
                    {user?.student?.firstName ||
                      user?.teacher?.firstName ||
                      user?.email}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      <div className="font-medium">{user?.role}</div>
                      <div>{user?.email}</div>
                    </div>

                    {user?.role === "STUDENT" && (
                      <Link
                        href="/student-performance"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Performance Dashboard
                      </Link>
                    )}

                    {user?.role === "TEACHER" && (
                      <Link
                        href="/teacher-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Teacher Dashboard
                      </Link>
                    )}

                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
