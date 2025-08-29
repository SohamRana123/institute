import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="bg-gray-100 py-12 mt-auto border-t border-gray-200"
      style={{ color: "#000" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.svg"
                alt="V.K. Institute Logo"
                width={32}
                height={32}
              />
              <h3 className="text-lg font-bold text-black">V.K. Institute</h3>
            </div>
            <p className="text-black text-sm mb-4">
              Empowering minds, shaping futures. V.K. Institute is committed to
              providing quality education and fostering academic excellence in a
              nurturing environment.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-black">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <Link href="/admissions" className="hover:text-blue-600">
                  Admissions
                </Link>
              </li>
              <li>
                <Link
                  href="/student-performance"
                  className="hover:text-blue-600"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher-portal" className="hover:text-blue-600">
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link href="/book-store" className="hover:text-blue-600">
                  Book Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Academic */}
          <div className="md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-black">ACADEMIC</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <Link href="/academic-calendar" className="hover:text-blue-600">
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link href="/curriculum" className="hover:text-blue-600">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-blue-600">
                  Faculty
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-blue-600">
                  Library
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-black">
          <p>&copy; 2024 V.K. Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
