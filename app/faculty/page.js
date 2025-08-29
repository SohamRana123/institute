import Link from "next/link";

export default function Faculty() {
  // Sample faculty data
  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      position: "Professor & Department Head",
      department: "Computer Science",
      education: "Ph.D. in Computer Science, MIT",
      research: "Artificial Intelligence, Machine Learning, Computer Vision",
      email: "sarah.johnson@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      position: "Associate Professor",
      department: "Electronics Engineering",
      education: "Ph.D. in Electrical Engineering, Stanford University",
      research: "Semiconductor Devices, VLSI Design, Embedded Systems",
      email: "michael.chen@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      position: "Assistant Professor",
      department: "Data Science",
      education: "Ph.D. in Statistics, UC Berkeley",
      research: "Big Data Analytics, Statistical Learning, Data Visualization",
      email: "emily.rodriguez@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 4,
      name: "Prof. David Wilson",
      position: "Professor",
      department: "Computer Science",
      education: "Ph.D. in Computer Science, Carnegie Mellon University",
      research: "Cybersecurity, Cryptography, Network Security",
      email: "david.wilson@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 5,
      name: "Dr. Priya Sharma",
      position: "Associate Professor",
      department: "Artificial Intelligence",
      education: "Ph.D. in Computer Science, ETH Zurich",
      research:
        "Natural Language Processing, Deep Learning, Cognitive Computing",
      email: "priya.sharma@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
    {
      id: 6,
      name: "Dr. James Taylor",
      position: "Assistant Professor",
      department: "Software Engineering",
      education: "Ph.D. in Software Engineering, University of Toronto",
      research: "Software Architecture, DevOps, Agile Methodologies",
      email: "james.taylor@institute.edu",
      image: "/faculty-placeholder.jpg",
    },
  ];

  // Department filters
  const departments = [
    "All Departments",
    "Computer Science",
    "Electronics Engineering",
    "Data Science",
    "Artificial Intelligence",
    "Software Engineering",
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
          <h1 className="text-3xl font-bold mb-2">Our Faculty</h1>
          <p className="text-gray-600">
            Meet our distinguished faculty members who are experts in their
            fields and dedicated to academic excellence.
          </p>
        </div>

        {/* Department Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter by Department</h2>
          <div className="flex flex-wrap gap-2">
            {departments.map((department, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full hover:bg-blue-200 transition-colors ${
                  index === 0
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyMembers.map((faculty) => (
            <div
              key={faculty.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <p className="text-gray-500">[Faculty Photo]</p>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">{faculty.name}</h3>
                <p className="text-blue-600 font-medium">{faculty.position}</p>
                <p className="text-gray-600 mb-2">{faculty.department}</p>

                <div className="mt-4">
                  <p className="mb-1">
                    <span className="font-semibold">Education:</span>{" "}
                    {faculty.education}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Research Areas:</span>{" "}
                    {faculty.research}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {faculty.email}
                  </p>
                </div>

                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Join Our Team Section */}
        <div className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join Our Faculty</h2>
          <p className="mb-6">
            We are always looking for talented educators and researchers to join
            our team. If you are passionate about teaching and innovation,
            we&#39;d love to hear from you.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
            View Open Positions
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
