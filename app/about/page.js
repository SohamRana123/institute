import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Institute of Technology</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/courses" className="hover:underline">Courses</Link></li>
              <li><Link href="/faculty" className="hover:underline">Faculty</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our History</h2>
            <p className="mb-4">
              Founded in 2000, the Institute of Technology has been at the forefront of technical education for over two decades. 
              What started as a small technical training center has grown into a comprehensive educational institution offering 
              a wide range of programs in engineering, computer science, and technology management.
            </p>
            <p>
              Our journey has been marked by continuous innovation, academic excellence, and a commitment to producing 
              industry-ready professionals who contribute meaningfully to technological advancement and societal progress.
            </p>
          </div>
          <div className="bg-gray-200 h-64 flex items-center justify-center">
            <p className="text-gray-500">[Campus Image Placeholder]</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            To provide high-quality technical education that empowers students with knowledge, skills, and values 
            necessary to excel in their chosen fields and contribute to technological innovation and societal development.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p>
            To be a globally recognized institution of excellence in technical education, research, and innovation, 
            producing leaders who drive technological advancement and create positive impact in society.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p>Striving for the highest standards in all our academic and administrative endeavors.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p>Encouraging creative thinking and innovative approaches to problem-solving.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p>Upholding ethical standards and fostering a culture of honesty and transparency.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p>Embracing diversity and ensuring equal opportunities for all.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p>Promoting teamwork and partnerships that enhance learning and growth.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Social Responsibility</h3>
              <p>Developing solutions that address societal challenges and contribute to sustainable development.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Institute of Technology</h3>
              <p>Providing quality education since 2000</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/courses" className="hover:underline">Courses</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
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
                <a href="#" className="hover:text-blue-400">Facebook</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
                <a href="#" className="hover:text-blue-400">Instagram</a>
                <a href="#" className="hover:text-blue-400">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>&copy; {new Date().getFullYear()} Institute of Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}