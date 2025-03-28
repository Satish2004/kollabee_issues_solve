import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full p-4">
      <div className="w-full bg-gray-100 rounded-3xl py-12 px-4 md:px-6 lg:px-8">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Left Column - Logo and Tagline */}
            <div className="space-y-6">
              <div className="flex items-center">
                {/* Placeholder for logo */}
                <div className="flex items-center gap-1">
                  <div className="rounded-full flex items-center justify-center">
                    <Image
                      src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/geqnff1fqxwfjtykctov"
                      alt="Logo"
                      width={200}
                      height={200}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-800 font-medium">
                  Empowering Your Projects,
                </p>
                <p className="text-gray-800 font-medium">
                  Enhancing Your Success, Every
                </p>
                <p className="text-gray-800 font-medium">Step of the Way.</p>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
                >
                  <Linkedin size={20} />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="#"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
                >
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
                >
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>

            {/* Middle Columns - Navigation Links */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Home</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Product Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Benefits
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    How To Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Key Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    FAQ's
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">App</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Mobile App
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Desktop App
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    How To Use
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">All Pages</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    App
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Blog Open
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 hover:text-gray-900 text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Download App Section - Now part of the grid */}
            <div className="space-y-4">
              <div className="bg-gray-900 text-white p-4 rounded-lg">
                <h3 className="font-medium mb-4">Download our App</h3>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="flex items-center gap-3 bg-gray-800 p-3 rounded-md hover:bg-gray-700"
                  >
                    <div className="bg-white rounded-full p-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 3L19 12L5 21V3Z" fill="black" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Get It On</div>
                      <div className="text-sm">Google Play</div>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 bg-gray-800 p-3 rounded-md hover:bg-gray-700"
                  >
                    <div className="bg-white rounded-full p-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C16.42 2 20 5.58 20 10C20 14.42 16.42 18 12 18C7.58 18 4 14.42 4 10C4 5.58 7.58 2 12 2ZM12 4C8.69 4 6 6.69 6 10C6 13.31 8.69 16 12 16C15.31 16 18 13.31 18 10C18 6.69 15.31 4 12 4ZM12 6C14.21 6 16 7.79 16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10C8 7.79 9.79 6 12 6ZM21.5 21.5L16.8 16.8C16.8 16.8 15.5 18 14 18C12.5 18 11.2 16.8 11.2 16.8L6.5 21.5C6.5 21.5 8.5 23 12 23C15.5 23 17.5 21.5 17.5 21.5L21.5 21.5Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">
                        Download on the
                      </div>
                      <div className="text-sm">App Store</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-6 border-t border-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-800 font-semibold">
              © 2024 Sap. All rights reserved.
            </p>
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-600 hover:text-gray-900 mt-2 md:mt-0"
            >
              Privacy Policy
            </Link>
            <div className="text-gray-100">Easter Egg</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
