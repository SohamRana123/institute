import Link from "next/link";

export default function Contact() {
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
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block mb-1 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subject of your message"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-1 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Education Street
                  <br />
                  Knowledge City, KN 12345
                  <br />
                  United States
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <p className="text-gray-600">
                  Main Office: (123) 456-7890
                  <br />
                  Admissions: (123) 456-7891
                  <br />
                  Student Services: (123) 456-7892
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-gray-600">
                  General Inquiries: info@institute.edu
                  <br />
                  Admissions: admissions@institute.edu
                  <br />
                  Student Support: support@institute.edu
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Office Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 1:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Find Us</h2>
          <div className="bg-gray-200 h-96 flex items-center justify-center">
            <p className="text-gray-500">
              [Map Placeholder - Google Maps would be integrated here]
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                What are the admission requirements?
              </h3>
              <p className="text-gray-600">
                Admission requirements vary by program. Generally, undergraduate
                programs require a high school diploma or equivalent, while
                graduate programs require a bachelor's degree. Specific programs
                may have additional requirements such as standardized test
                scores or prerequisite courses.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                Are scholarships available?
              </h3>
              <p className="text-gray-600">
                Yes, we offer various merit-based and need-based scholarships.
                Please contact our financial aid office or visit the
                scholarships section on our website for more information.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                Do you offer campus tours?
              </h3>
              <p className="text-gray-600">
                Yes, we offer guided campus tours Monday through Friday. Please
                schedule your visit through our admissions office at least 48
                hours in advance.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                What student support services do you provide?
              </h3>
              <p className="text-gray-600">
                We offer a wide range of student support services including
                academic advising, career counseling, health services,
                disability support, and mental health resources.
              </p>
            </div>
          </div>
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
