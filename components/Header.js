'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

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
          <ul className="flex space-x-8">
            <li>
              <Link 
                href="/" 
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/admissions" 
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${pathname === '/admissions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              >
                Admissions
              </Link>
            </li>
            <li>
              <Link 
                href="/teacher-login" 
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${pathname === '/teacher-login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              >
                Teacher Login
              </Link>
            </li>
            <li>
              <Link 
                href="/student-performance" 
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${pathname === '/student-performance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              >
                Student Performance
              </Link>
            </li>
            <li>
              <Link 
                href="/book-store" 
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${pathname === '/book-store' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              >
                Book Store
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}