"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const books = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      author: "Thomas H. Cormen",
      category: "Computer Science",
      available: true,
      image: "/book-icon.svg",
    },
    {
      id: 2,
      title: "Digital Electronics",
      author: "Morris Mano",
      category: "Electronics",
      available: true,
      image: "/book-icon.svg",
    },
    {
      id: 3,
      title: "Calculus",
      author: "James Stewart",
      category: "Mathematics",
      available: false,
      image: "/book-icon.svg",
    },
  ];

  const categories = [
    "all",
    "Computer Science",
    "Electronics",
    "Mathematics",
    "Physics",
  ];

  const filteredBooks = books.filter(
    (book) =>
      (selectedCategory === "all" || book.category === selectedCategory) &&
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">Library</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Access our extensive collection of academic resources and research
            materials
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search books by title or author..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src={book.image}
                      alt={book.title}
                      width={64}
                      height={64}
                      className="text-blue-600"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 text-gray-900">
                    {book.title}
                  </h3>
                  <p className="text-gray-700 text-center mb-4">
                    by {book.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {book.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        book.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.available ? "Available" : "Checked Out"}
                    </span>
                  </div>
                </div>
                <div className="border-t px-6 py-4">
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      book.available
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!book.available}
                  >
                    {book.available ? "Borrow Book" : "Currently Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
