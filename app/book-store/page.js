import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function BookStore() {
  // Sample book data
  const books = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      author: "Dr. Alan Smith",
      price: 45.99,
      category: "Computer Science",
      image: "/book-icon.svg",
    },
    {
      id: 2,
      title: "Advanced Mathematics for Engineers",
      author: "Prof. Sarah Johnson",
      price: 52.5,
      category: "Mathematics",
      image: "/book-icon.svg",
    },
    {
      id: 3,
      title: "Principles of Economics",
      author: "Dr. Michael Brown",
      price: 39.99,
      category: "Economics",
      image: "/book-icon.svg",
    },
    {
      id: 4,
      title: "Modern Physics",
      author: "Dr. Emily Chen",
      price: 48.75,
      category: "Physics",
      image: "/book-icon.svg",
    },
    {
      id: 5,
      title: "Organic Chemistry Fundamentals",
      author: "Prof. Robert Wilson",
      price: 55.25,
      category: "Chemistry",
      image: "/book-icon.svg",
    },
    {
      id: 6,
      title: "Introduction to Psychology",
      author: "Dr. Lisa Taylor",
      price: 42.99,
      category: "Psychology",
      image: "/book-icon.svg",
    },
  ];

  // Available categories for filtering
  const categories = [
    "All",
    "Computer Science",
    "Mathematics",
    "Economics",
    "Physics",
    "Chemistry",
    "Psychology",
  ];

  return (
    <>
      {/* Banner */}
      <section className="bg-orange-700 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-white">
            V.K. Institute Book Store
          </h2>
          <p className="text-xl text-white">
            Find all your academic resources in one place
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-black"
                />
                <div className="absolute left-3 top-3.5 text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black">
                <option className="text-black">All Categories</option>
                <option className="text-black">Textbooks</option>
                <option className="text-black">Reference</option>
                <option className="text-black">Study Guides</option>
                <option className="text-black">Digital Resources</option>
              </select>

              <select className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black">
                <option className="text-black">All Subjects</option>
                <option className="text-black">Mathematics</option>
                <option className="text-black">Science</option>
                <option className="text-black">Literature</option>
                <option className="text-black">History</option>
                <option className="text-black">Computer Science</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Book Store Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Books Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">All Books</h2>
            <p className="text-black">6 books found</p>
          </div>

          {/* Books Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="p-4 mb-2">
                  <Image
                    src="/book-icon.svg"
                    alt={book.title}
                    width={200}
                    height={200}
                    className="w-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1 text-gray-800">
                    <span className="text-black">{book.title}</span>
                  </h3>
                  <p className="text-black text-sm mb-2">{book.author}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      <span>★★★★★</span>
                    </div>
                    <span className="text-black text-sm ml-1">
                      ({(Math.random() * (5 - 4) + 4).toFixed(1)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-black">
                      ${book.price.toFixed(2)}
                    </span>
                    <span className="text-black line-through text-sm">
                      ${(book.price * 1.25).toFixed(2)}
                    </span>
                    <span className="text-green-600 text-xs">
                      Save ${(book.price * 0.25).toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Making your book buying experience seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Free Campus Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Get your books delivered to your dorm or classroom for free
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Book Buyback
              </h3>
              <p className="text-gray-600 text-sm">
                Get your used books back to us at competitive prices
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Student Discounts
              </h3>
              <p className="text-gray-600 text-sm">
                Enjoy special pricing and discounts exclusive to V.K. Institute
                students
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
