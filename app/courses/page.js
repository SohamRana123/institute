import Link from "next/link";

export default function Courses() {
  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Bachelor of Technology in Computer Science",
      duration: "4 years",
      level: "Undergraduate",
      description:
        "A comprehensive program covering programming, algorithms, data structures, software engineering, artificial intelligence, and more.",
      highlights: [
        "Modern curriculum",
        "Industry partnerships",
        "Hands-on projects",
        "Internship opportunities",
      ],
    },
    {
      id: 2,
      title: "Bachelor of Technology in Electronics",
      duration: "4 years",
      level: "Undergraduate",
      description:
        "Study electronic systems, circuit design, signal processing, microprocessors, and communication systems.",
      highlights: [
        "Well-equipped labs",
        "Industry-relevant skills",
        "Expert faculty",
        "Research opportunities",
      ],
    },
    {
      id: 3,
      title: "Master of Technology in Data Science",
      duration: "2 years",
      level: "Postgraduate",
      description:
        "Advanced study of data analytics, machine learning, big data technologies, and statistical methods.",
      highlights: [
        "Cutting-edge curriculum",
        "Research focus",
        "Industry collaborations",
        "Capstone projects",
      ],
    },
    {
      id: 4,
      title: "Master of Technology in Artificial Intelligence",
      duration: "2 years",
      level: "Postgraduate",
      description:
        "Specialized program covering machine learning, neural networks, computer vision, natural language processing, and robotics.",
      highlights: [
        "State-of-the-art AI labs",
        "Research opportunities",
        "Industry partnerships",
        "Expert mentorship",
      ],
    },
    {
      id: 5,
      title: "PhD in Computer Science and Engineering",
      duration: "3-5 years",
      level: "Doctoral",
      description:
        "Research-focused program allowing students to contribute to advancing knowledge in specialized areas of computer science.",
      highlights: [
        "Research funding",
        "Publication support",
        "Conference opportunities",
        "Industry collaborations",
      ],
    },
    {
      id: 6,
      title: "Certificate in Web Development",
      duration: "6 months",
      level: "Certificate",
      description:
        "Practical training in HTML, CSS, JavaScript, and modern web frameworks to build responsive and dynamic websites.",
      highlights: [
        "Hands-on projects",
        "Portfolio development",
        "Industry mentors",
        "Job placement assistance",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Institute of Technology</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:underline">
                  Faculty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Courses</h1>
          <p className="text-gray-600">
            Explore our comprehensive range of academic programs designed to
            prepare you for success in the technology sector.
          </p>
        </div>

        {/* Course Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter by Level</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200">
              All
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200">
              Undergraduate
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200">
              Postgraduate
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200">
              Doctoral
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200">
              Certificate
            </button>
          </div>
        </div>

        {/* Course Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-50 p-4 border-b">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                  {course.level}
                </span>
                <h3 className="text-xl font-bold">{course.title}</h3>
                <p className="text-gray-600">Duration: {course.duration}</p>
              </div>
              <div className="p-4">
                <p className="mb-4">{course.description}</p>
                <h4 className="font-semibold mb-2">Highlights:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {course.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Application CTA */}
        <div className="mt-12 bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Applications are now open for the upcoming academic year. Join our
            community of innovators and future tech leaders.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8" style={{ color: "#000" }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Institute of Technology
              </h3>
              <p>Providing quality education since 2000</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:underline">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic">
                <p>123 Education Street</p>
                <p>Knowledge City, KN 12345</p>
                <p>Email: info@institute.edu</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">
                  Facebook
                </a>
                <a href="#" className="hover:text-blue-400">
                  Twitter
                </a>
                <a href="#" className="hover:text-blue-400">
                  Instagram
                </a>
                <a href="#" className="hover:text-blue-400">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>
              &copy; {new Date().getFullYear()} Institute of Technology. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
